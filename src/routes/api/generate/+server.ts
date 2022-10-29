import { maxSeed } from '$ts/constants/main';
import { supabaseAdmin } from '$ts/constants/supabaseAdmin';
import { formatPrompt } from '$ts/helpers/formatPrompt';
import { getDeviceInfo } from '$ts/helpers/getDeviceInfo';
import { pickServerUrl } from '$ts/queries/db/pickServerUrl';
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
	const {
		server_url,
		prompt,
		negative_prompt,
		seed = Math.round(Math.random() * maxSeed),
		width = 512,
		height = 512,
		num_inference_steps = 50,
		guidance_scale = 7
	}: TGenerationRequest = await request.json();
	const _negative_prompt =
		negative_prompt !== '' && negative_prompt !== undefined
			? formatPrompt(negative_prompt)
			: undefined;
	const _prompt = formatPrompt(prompt);
	let picked_server_url: string;
	try {
		const res = await pickServerUrl(server_url);
		picked_server_url = res.serverUrl;
	} catch (error) {
		picked_server_url = server_url;
	}
	try {
		generationLog({
			text: 'Started generation',
			prompt: _prompt,
			negative_prompt: _negative_prompt,
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
						prompt: _prompt,
						negative_prompt: _negative_prompt,
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
					prompt: _prompt,
					negative_prompt: _negative_prompt,
					width: width.toString(),
					height: height.toString(),
					seed: seed.toString(),
					num_inference_steps: Math.round(num_inference_steps).toString(),
					guidance_scale: Math.round(guidance_scale).toString()
				}
			})
		});
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
			prompt: _prompt,
			negative_prompt: _negative_prompt,
			width,
			height,
			num_inference_steps,
			guidance_scale,
			seed,
			server_url: picked_server_url
		});
		// If Supabase is enabled, update the generation with prompt, negative prompt, duration and status
		if (output && !isNSFW && !data.error && supabaseAdmin !== undefined) {
			try {
				const startTimestamp = Date.now();
				let { data, error } = await supabaseAdmin
					.from('generation')
					.update([
						{
							prompt: _prompt,
							negative_prompt: _negative_prompt,
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
						prompt: _prompt,
						negative_prompt: _negative_prompt,
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
						prompt: _prompt,
						negative_prompt: _negative_prompt,
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
			error: output && isNSFW ? 'NSFW content detected, try another prompt :(' : data.error
		};
		return new Response(JSON.stringify(generationResponse));
	} catch (error) {
		const endTimestamp = Date.now();
		generationDurationMs = endTimestamp - startTimestamp;
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
						prompt: _prompt,
						negative_prompt: _negative_prompt,
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
	const blackStartString = 'data:image/png;base64,iVBORw0KGg';
	const blackString = Array.from({ length: 200 }, () => 'A').join('');
	if (!imageDataB64) {
		return false;
	}
	return imageDataB64.startsWith(blackStartString) && imageDataB64.includes(blackString);
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
