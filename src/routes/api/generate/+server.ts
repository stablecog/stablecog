import {
	maxSeed,
	modelIdDefault,
	modelIdToCogModelName,
	schedulerIdDefault,
	schedulerIdToCogSchedulerName,
	type TAvailableModelId,
	type TAvailableSchedulerId
} from '$ts/constants/main';
import { supabaseAdmin } from '$ts/constants/supabaseAdmin';
import { formatPrompt } from '$ts/helpers/formatPrompt';
import { getDeviceInfo } from '$ts/helpers/getDeviceInfo';
import { isValue } from '$ts/helpers/isValue';
import { pickServerUrl } from '$ts/queries/db/pickServerUrl';
import { uploadToGallery } from '$ts/queries/db/uploadToGallery';
import type { TGenerationRequest, TGenerationResponse } from '$ts/types/main';
import type { PostgrestError } from '@supabase/supabase-js';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const startTimestamp = Date.now();
	const { headers } = request;
	const countryCode = headers.get('cf-ipcountry');
	let generationId: string | undefined;
	const userAgent = headers.get('user-agent');
	const deviceInfo = getDeviceInfo(userAgent);
	let generationDurationMs: number | undefined;
	let {
		server_url,
		prompt,
		negative_prompt,
		model_id = modelIdDefault,
		scheduler_id = schedulerIdDefault,
		seed = Math.round(Math.random() * maxSeed),
		width = 512,
		height = 512,
		num_inference_steps = 50,
		guidance_scale = 7,
		shouldSubmitToGallery = false
	}: TGenerationRequest = await request.json();
	seed = isValue(seed) ? seed : Math.round(Math.random() * maxSeed);
	negative_prompt =
		negative_prompt !== '' && negative_prompt !== undefined && negative_prompt !== null
			? formatPrompt(negative_prompt)
			: undefined;
	prompt = formatPrompt(prompt);
	let picked_server_url: string;
	try {
		const res = await pickServerUrl(server_url);
		picked_server_url = res.serverUrl;
	} catch (error) {
		picked_server_url = server_url;
	}
	const maxLogLength = 100;
	const sliced_prompt = `${prompt.slice(0, maxLogLength)}${
		prompt.length > maxLogLength ? '...' : ''
	}`;
	const sliced_negative_prompt = negative_prompt
		? `${negative_prompt.slice(0, maxLogLength)}${
				negative_prompt.length > maxLogLength ? '...' : ''
		  }`
		: undefined;
	try {
		generationLog({
			text: 'Started generation',
			prompt: sliced_prompt,
			negative_prompt: sliced_negative_prompt,
			model_id,
			scheduler_id,
			width,
			height,
			num_inference_steps,
			guidance_scale,
			seed,
			server_url: picked_server_url
		});
		// Is Supabase is enabled, record the generation
		if (supabaseAdmin !== undefined) {
			try {
				const startTimestamp = Date.now();
				let { data, error }: TDBGenerationProcessRes = await supabaseAdmin
					.from('generation')
					.insert({
						status: 'started',
						model_id,
						scheduler_id,
						seed,
						width,
						height,
						num_inference_steps,
						guidance_scale,
						server_url: picked_server_url,
						country_code: countryCode || null,
						device_type: deviceInfo.type,
						device_browser: deviceInfo.browser,
						device_os: deviceInfo.os,
						user_agent: userAgent
					})
					.select('id');
				if (error) {
					console.log(error);
				}
				if (data) {
					generationId = data?.[0].id;
					const endTimestamp = Date.now();
					generationLog({
						text: `Inserted into the DB in: ${(endTimestamp - startTimestamp) / 1000}s`,
						prompt: sliced_prompt,
						negative_prompt: sliced_negative_prompt,
						model_id,
						scheduler_id,
						width,
						height,
						num_inference_steps,
						guidance_scale,
						seed,
						server_url: picked_server_url
					});
				}
			} catch (error) {
				console.log(error);
			}
		}
		const startTimestamp = Date.now();
		const res = await fetch(`${picked_server_url}/predictions`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				input: {
					prompt,
					negative_prompt,
					model: modelIdToCogModelName[model_id],
					scheduler_id: schedulerIdToCogSchedulerName[scheduler_id],
					width: width.toString(),
					height: height.toString(),
					seed: seed.toString(),
					num_inference_steps: Math.round(num_inference_steps).toString(),
					guidance_scale: Math.round(guidance_scale).toString(),
					output_image_ext: 'jpg'
				}
			})
		});
		if (!res.ok) {
			throw new Error(`Something went wrong during generation: ${res.status}`);
		}
		const endTimestamp = Date.now();
		generationDurationMs = endTimestamp - startTimestamp;
		const jsonStartTimestamp = Date.now();
		const data: TGenerateImageData = await res.json();
		const jsonEndTimestamp = Date.now();
		console.log(
			`---- Generation body to JSON in: ${(jsonEndTimestamp - jsonStartTimestamp) / 1000}s ----`
		);
		const output = data.output[0];
		const isNSFW = getIsNSFW(output);
		if (data.error) {
			console.log('----', 'Generation error', '--', data.error, '----');
		}
		generationLog({
			text: `Ended generation in ${(endTimestamp - startTimestamp) / 1000}s`,
			prompt: sliced_prompt,
			negative_prompt: sliced_negative_prompt,
			model_id,
			scheduler_id,
			width,
			height,
			num_inference_steps,
			guidance_scale,
			seed,
			server_url: picked_server_url
		});
		// If Supabase is enabled, update the generation with prompt, negative prompt, duration and status
		if (output && !isNSFW && !data.error && supabaseAdmin !== undefined) {
			let negative_prompt_id: string | undefined;
			let prompt_id: string | undefined;
			try {
				const startTimestamp = Date.now();
				// Check if the prompt exists in the DB already
				let { data: promptData, error: promptErr } = await supabaseAdmin
					.from('prompt')
					.select('id')
					.eq('text', prompt)
					.maybeSingle();
				if (promptErr) {
					console.log(promptErr);
				} else if (promptData?.id) {
					prompt_id = promptData.id;
				} else {
					// If not, insert it
					let { data: newPromptData, error: newPromptErr } = await supabaseAdmin
						.from('prompt')
						.insert({
							text: prompt
						})
						.select('id')
						.single();
					if (newPromptErr) {
						console.log(newPromptErr);
					} else {
						prompt_id = newPromptData?.id;
					}
				}
				if (isValue(negative_prompt)) {
					let { data: negativePromptData, error: negativePromptErr } = await supabaseAdmin
						.from('negative_prompt')
						.select('id')
						.eq('text', negative_prompt)
						.maybeSingle();
					if (negativePromptErr) {
						console.log(negativePromptErr);
					} else if (negativePromptData?.id) {
						negative_prompt_id = negativePromptData.id;
					} else {
						// If not, insert it
						let { data: newNegativePromptData, error: newNegativePromptErr } = await supabaseAdmin
							.from('negative_prompt')
							.insert({
								text: negative_prompt
							})
							.select('id')
							.single();
						if (newNegativePromptErr) {
							console.log(newNegativePromptErr);
						} else {
							negative_prompt_id = newNegativePromptData?.id;
						}
					}
				}
				// Update the generation with the prompt, negative prompt, duration and status
				let { data, error } = await supabaseAdmin
					.from('generation')
					.update([
						{
							prompt_id,
							negative_prompt_id,
							duration_ms: generationDurationMs,
							status: 'succeeded'
						}
					])
					.eq('id', generationId)
					.select('id');
				if (error) {
					console.log('error', error.message);
				}
				if (data) {
					const endTimestamp = Date.now();
					generationLog({
						text: `Updated the DB record with "succeeded" in: ${
							(endTimestamp - startTimestamp) / 1000
						}s`,
						prompt: sliced_prompt,
						negative_prompt: sliced_negative_prompt,
						model_id,
						scheduler_id,
						width,
						height,
						num_inference_steps,
						guidance_scale,
						seed,
						server_url: picked_server_url
					});
				}
			} catch (error) {
				console.log(error);
			}
			if (shouldSubmitToGallery && prompt_id) {
				try {
					await uploadToGallery({
						imageDataB64: output,
						prompt_id,
						negative_prompt_id,
						model_id,
						inference_steps: num_inference_steps,
						guidance_scale,
						seed,
						hidden: true
					});
				} catch (error) {
					console.log(error);
				}
			}
		} else if (supabaseAdmin !== undefined) {
			try {
				const startTimestamp = Date.now();
				let { data, error } = await supabaseAdmin
					.from('generation')
					.update([
						{
							duration_ms: generationDurationMs,
							status: 'failed'
						}
					])
					.eq('id', generationId);
				if (error) {
					console.log(error);
				}
				if (data) {
					const endTimestamp = Date.now();
					generationLog({
						text: `Updated the DB record with "failed" in: ${
							(endTimestamp - startTimestamp) / 1000
						}s`,
						prompt: sliced_prompt,
						negative_prompt: sliced_negative_prompt,
						model_id,
						scheduler_id,
						width,
						height,
						num_inference_steps,
						guidance_scale,
						seed,
						server_url: picked_server_url
					});
				}
			} catch (error) {
				console.log(error);
			}
		}
		const generationResponse: TGenerationResponse = {
			data:
				output && !isNSFW ? { imageDataB64: output, duration_ms: generationDurationMs } : undefined,
			error: output && isNSFW ? 'NSFW' : data.error
		};
		return new Response(JSON.stringify(generationResponse));
	} catch (error) {
		const endTimestamp = Date.now();
		generationDurationMs = endTimestamp - startTimestamp;
		console.log(error);
		console.log(
			'----',
			`Failed generation in: ${(endTimestamp - startTimestamp) / 1000}s`,
			'--',
			error,
			'----'
		);
		if (supabaseAdmin !== undefined) {
			try {
				const startTimestamp = Date.now();
				let { data, error } = await supabaseAdmin
					.from('generation')
					.update([
						{
							duration_ms: generationDurationMs,
							status: 'failed'
						}
					])
					.eq('id', generationId)
					.select('id');
				if (error) {
					console.log(error);
				}
				if (data) {
					const endTimestamp = Date.now();
					generationLog({
						text: `Updated the DB record with "failed" in: ${
							(endTimestamp - startTimestamp) / 1000
						}s`,
						prompt: sliced_prompt,
						negative_prompt: sliced_negative_prompt,
						model_id,
						scheduler_id,
						width,
						height,
						num_inference_steps,
						guidance_scale,
						seed,
						server_url: picked_server_url
					});
				}
			} catch (error) {
				console.log(error);
			}
		}
		return new Response(JSON.stringify({ error: 'Something went wrong :(' }));
	}
};

function getIsNSFW(imageDataB64: string) {
	const pngStart = 'data:image/png;base64,';
	const blackStringPng = Array.from({ length: 200 }, () => 'A').join('');
	const jpegStart = 'data:image/jpeg;base64,';
	const blackStringJpeg = Array.from({ length: 30 }, () => 'iiigAooooAKKKKAC').join('');
	if (!imageDataB64) {
		return false;
	}
	return (
		(imageDataB64.startsWith(jpegStart) && imageDataB64.includes(blackStringJpeg)) ||
		(imageDataB64.startsWith(pngStart) && imageDataB64.includes(blackStringPng))
	);
}

interface TGenerateImageData {
	output: string[];
	status: TStatus;
	error?: string;
}

type TStatus = 'succeeded' | 'failed';

export type TDBGenerationProcessStatus = 'started' | 'succeeded' | 'failed' | 'rejected';

export interface TDBGenerationProcessRes {
	data:
		| {
				id: string;
				status: TDBGenerationProcessStatus;
				generation_id: string | null;
				country_code: string | null;
				created_at: string;
				updated_at: string;
		  }[]
		| null;
	error: PostgrestError | null;
}

function generationLog({
	text,
	prompt,
	negative_prompt,
	model_id,
	scheduler_id,
	width,
	height,
	num_inference_steps,
	guidance_scale,
	seed,
	server_url
}: {
	text: string;
	prompt: string;
	negative_prompt: string | undefined;
	model_id: TAvailableModelId;
	scheduler_id: TAvailableSchedulerId;
	width: number;
	height: number;
	num_inference_steps: number;
	guidance_scale: number;
	seed: number;
	server_url: string;
}) {
	console.log(
		'----',
		text,
		'--',
		`"${prompt}"`,
		`--${negative_prompt ? ` "${negative_prompt}" --` : ''}`,
		`${modelIdToCogModelName[model_id]}`,
		'--',
		`${schedulerIdToCogSchedulerName[scheduler_id]}`,
		'--',
		width,
		'--',
		height,
		'--',
		guidance_scale,
		'--',
		num_inference_steps,
		'--',
		seed,
		'--',
		server_url,
		'----'
	);
}
