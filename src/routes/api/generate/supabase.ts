import { generationLog } from '$routes/api/generate/helpers';
import type {
	TDBGenerationProcessRes,
	TDeviceInfo,
	TGenerationLogObject
} from '$routes/api/generate/types';
import { supabaseAdmin } from '$ts/constants/supabaseAdmin';
import { isValue } from '$ts/helpers/isValue';

export async function updateGenerationAsSucceededSupabase({
	prompt,
	negative_prompt,
	generationDurationMs,
	generationId,
	logObject
}: {
	prompt: string;
	negative_prompt: string | undefined;
	generationDurationMs: number;
	generationId: string | undefined;
	logObject: TGenerationLogObject;
}) {
	let prompt_id: string | undefined;
	let negative_prompt_id: string | undefined;
	if (!supabaseAdmin) {
		console.log('No supabaseAdmin');
		return { prompt_id, negative_prompt_id };
	}
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
			text: `Updated the DB record with "succeeded" in: ${(endTimestamp - startTimestamp) / 1000}s`,
			logObject
		});
	}
	return { prompt_id, negative_prompt_id };
}

export async function insertGenerationSupabase({
	width,
	height,
	seed,
	num_inference_steps,
	guidance_scale,
	picked_server_url,
	countryCode,
	deviceInfo,
	model_id,
	scheduler_id,
	userAgent,
	logObject
}: {
	width: number;
	height: number;
	seed: number;
	num_inference_steps: number;
	guidance_scale: number;
	picked_server_url: string;
	countryCode: string | null;
	model_id: string;
	scheduler_id: string;
	userAgent: string | null;
	logObject: TGenerationLogObject;
	deviceInfo: TDeviceInfo;
}) {
	let generationId: string | undefined;
	if (!supabaseAdmin) {
		console.log('No supabaseAdmin');
		return { generationId };
	}
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
			logObject
		});
	}
	return { generationId };
}

export async function updateGenerationAsFailedSupabase({
	generationDurationMs,
	generationId,
	logObject
}: {
	generationDurationMs: number;
	generationId: string | undefined;
	logObject: TGenerationLogObject;
}) {
	if (!supabaseAdmin) {
		console.log('No supabaseAdmin');
		return;
	}
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
		.select();
	if (error) {
		console.log(error);
	}
	if (data) {
		const endTimestamp = Date.now();
		generationLog({
			text: `Updated the DB record with "failed" in: ${(endTimestamp - startTimestamp) / 1000}s`,
			logObject
		});
	}
}
