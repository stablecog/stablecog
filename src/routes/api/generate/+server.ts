import { generationLog, getIsNSFW } from '$routes/api/generate/helpers';
import {
	insertGenerationSupabase,
	updateGenerationAsFailedSupabase,
	updateGenerationAsSucceededSupabase
} from '$routes/api/generate/supabase';
import type {
	TGenerateImageData,
	TGenerationLogObject,
	TPredictionsRequestGeneration
} from '$routes/api/generate/types';
import {
	maxSeed,
	modelIdDefault,
	modelIdToCogModelName,
	schedulerIdDefault,
	schedulerIdToCogSchedulerName
} from '$ts/constants/main';
import { supabaseAdmin } from '$ts/constants/supabaseAdmin';
import { formatPrompt } from '$ts/helpers/formatPrompt';
import { getDeviceInfo } from '$ts/helpers/getDeviceInfo';
import { isValue } from '$ts/helpers/isValue';
import { pickServerUrl } from '$ts/queries/db/pickServerUrl';
import { uploadToGallery } from '$ts/queries/db/uploadToGallery';
import type { TGenerationRequest, TGenerationResponse } from '$ts/types/main';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const startTimestamp = Date.now();
	const { headers } = request;
	const countryCode = headers.get('cf-ipcountry');
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
	const logObject: TGenerationLogObject = {
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
	};
	generationLog({
		text: 'Started generation',
		logObject
	});
	// Is Supabase is enabled, record the generation
	let generationId: string | undefined;
	if (supabaseAdmin !== undefined) {
		try {
			const iRes = await insertGenerationSupabase({
				width,
				height,
				seed,
				countryCode,
				deviceInfo,
				logObject,
				guidance_scale,
				model_id,
				num_inference_steps,
				picked_server_url,
				scheduler_id,
				userAgent
			});
			if (iRes.generationId !== undefined) generationId = iRes.generationId;
		} catch (error) {
			console.log(error);
		}
	}
	try {
		const startTimestamp = Date.now();
		const predictionsBody: TPredictionsRequestGeneration = {
			input: {
				prompt,
				negative_prompt,
				model: modelIdToCogModelName[model_id],
				scheduler: schedulerIdToCogSchedulerName[scheduler_id],
				width: width.toString(),
				height: height.toString(),
				seed: seed.toString(),
				num_inference_steps: Math.round(num_inference_steps).toString(),
				guidance_scale: Math.round(guidance_scale).toString(),
				output_image_ext: 'jpg'
			}
		};
		const res = await fetch(`${picked_server_url}/predictions`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(predictionsBody)
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
			logObject
		});
		// If Supabase is enabled, update the generation with prompt, negative prompt, duration and status
		if (output && !isNSFW && !data.error && supabaseAdmin !== undefined) {
			let prompt_id: string | undefined;
			let negative_prompt_id: string | undefined;
			try {
				const uRes = await updateGenerationAsSucceededSupabase({
					prompt,
					negative_prompt,
					generationId,
					generationDurationMs,
					logObject
				});
				if (uRes.prompt_id !== undefined) prompt_id = uRes.prompt_id;
				if (uRes.negative_prompt_id !== undefined) negative_prompt_id = uRes.negative_prompt_id;
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
						scheduler_id,
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
				await updateGenerationAsFailedSupabase({ generationId, generationDurationMs, logObject });
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
				await updateGenerationAsFailedSupabase({ generationId, generationDurationMs, logObject });
			} catch (error) {
				console.log(error);
			}
		}
		return new Response(JSON.stringify({ error: 'Something went wrong :(' }));
	}
};
