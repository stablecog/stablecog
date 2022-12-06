import { upscaleLog } from '$routes/api/upscale/helpers';
import {
	insertUpscaleSupabase,
	updateUpscaleAsFailedSupabase,
	updateUpscaleAsSucceededSupabase
} from '$routes/api/upscale/supabase';
import type {
	TPredictionsRequestUpscale,
	TUpscaleData,
	TUpscaleLogObject
} from '$routes/api/upscale/types';
import { supabaseAdmin } from '$ts/constants/supabaseAdmin';
import { getDeviceInfo } from '$ts/helpers/getDeviceInfo';
import { pickServerUrl } from '$ts/queries/db/pickServerUrl';
import type { TTaskUCog } from '$ts/types/cog';
import type { TUpscaleRequest, TUpscaleResponse } from '$ts/types/main';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const startTimestamp = Date.now();
	const { headers } = request;
	const countryCode = headers.get('cf-ipcountry');
	let upscaleId: string | undefined;
	const userAgent = headers.get('user-agent');
	const deviceInfo = getDeviceInfo(userAgent);
	const {
		server_url,
		image_b64,
		width,
		height,
		seed,
		num_inference_steps,
		guidance_scale,
		negative_prompt,
		prompt
	}: TUpscaleRequest = await request.json();

	const scale = 4;
	const type: TTaskUCog = 'Real-World Image Super-Resolution-Large';

	let picked_server_url: string;
	try {
		const res = await pickServerUrl(server_url);
		picked_server_url = res.serverUrl;
	} catch (error) {
		picked_server_url = server_url;
	}

	const logObject: TUpscaleLogObject = {
		scale,
		server_url,
		type
	};

	upscaleLog({ text: 'Started upscale', logObject });

	if (supabaseAdmin !== undefined) {
		try {
			const res = await insertUpscaleSupabase({
				type,
				scale,
				width,
				height,
				prompt,
				negative_prompt,
				picked_server_url,
				logObject,
				userAgent,
				countryCode,
				deviceInfo,
				guidance_scale,
				num_inference_steps,
				seed
			});
			if (res?.upscaleId) upscaleId = res.upscaleId;
		} catch (error) {
			console.log(error);
		}
	}
	try {
		const startTimestamp = Date.now();
		const predictionsBody: TPredictionsRequestUpscale = {
			input: {
				image_u: image_b64,
				task_u: 'Real-World Image Super-Resolution-Large',
				process_type: 'upscale'
			}
		};
		const res = await fetch(`${picked_server_url}/predictions`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify(predictionsBody)
		});
		const endTimestamp = Date.now();
		const upscaleDurationMs = endTimestamp - startTimestamp;
		upscaleLog({
			text: `Finished upscale in: ${(endTimestamp - startTimestamp) / 1000}s`,
			logObject
		});
		if (supabaseAdmin !== undefined && upscaleId !== undefined) {
			try {
				await updateUpscaleAsSucceededSupabase({ upscaleId, upscaleDurationMs, logObject });
			} catch (error) {
				console.log(error);
			}
		}
		const startTimestampJson = Date.now();
		const data: TUpscaleData = await res.json();
		const endTimestampJson = Date.now();
		console.log(
			`---- Upscale body to JSON in: ${(endTimestampJson - startTimestampJson) / 1000}s ----`
		);
		const output = data.output[0];
		const upscaleResponse: TUpscaleResponse = {
			data: { image_b64: output, duration_ms: upscaleDurationMs }
		};
		return new Response(JSON.stringify(upscaleResponse));
	} catch (error) {
		const endTimestamp = Date.now();
		upscaleLog({
			text: `Upscale error in: ${(endTimestamp - startTimestamp) / 1000}s`,
			logObject
		});
		console.log(error);
		if (supabaseAdmin !== undefined && upscaleId !== undefined) {
			try {
				await updateUpscaleAsFailedSupabase({ upscaleId, logObject });
			} catch (error) {
				console.log(error);
			}
		}
	}
	return new Response(JSON.stringify({ error: 'Something went wrong :(' }));
};
