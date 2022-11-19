import { supabaseAdmin } from '$ts/constants/supabaseAdmin';
import { getDeviceInfo } from '$ts/helpers/getDeviceInfo';
import { pickServerUrl } from '$ts/queries/db/pickServerUrl';
import type { TUpscaleRequest, TUpscaleResponse, TUpscaleType } from '$ts/types/main';
import type { PostgrestError } from '@supabase/supabase-js';
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
		imageDataB64,
		width,
		height,
		seed,
		num_inference_steps,
		guidance_scale,
		negative_prompt,
		prompt
	}: TUpscaleRequest = await request.json();

	const scale = 4;
	const type: TUpscaleType = 'Real-World Image Super-Resolution-Large';

	let picked_server_url: string;
	try {
		const res = await pickServerUrl(server_url);
		picked_server_url = res.serverUrl;
	} catch (error) {
		picked_server_url = server_url;
	}

	upscaleLog({ text: 'Started upscale', scale, server_url, type });

	if (supabaseAdmin !== undefined) {
		try {
			const startTimestamp = Date.now();
			let { data, error }: TDBUpscaleProcessRes = await supabaseAdmin
				.from('upscale')
				.insert({
					status: 'started',
					type,
					scale,
					prompt,
					negative_prompt,
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
				upscaleId = data?.[0].id;
				const endTimestamp = Date.now();
				upscaleLog({
					text: `Inserted into the DB in: ${(endTimestamp - startTimestamp) / 1000}s`,
					type,
					scale,
					server_url: picked_server_url
				});
			}
		} catch (error) {
			console.log(error);
		}
	}
	try {
		const startTimestamp = Date.now();
		const res = await fetch(`${picked_server_url}/predictions`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				input: {
					image_u: imageDataB64,
					task_u: 'Real-World Image Super-Resolution-Large',
					process_type: 'upscale'
				}
			})
		});
		const endTimestamp = Date.now();
		const upscaleDurationMs = endTimestamp - startTimestamp;
		upscaleLog({
			text: `Finished upscale in: ${(endTimestamp - startTimestamp) / 1000}s`,
			scale,
			server_url,
			type
		});
		if (supabaseAdmin !== undefined) {
			try {
				const startTimestamp = Date.now();
				let { data, error } = await supabaseAdmin
					.from('upscale')
					.update([
						{
							duration_ms: upscaleDurationMs,
							status: 'succeeded'
						}
					])
					.eq('id', upscaleId)
					.select('id');
				if (error) {
					console.log('error', error.message);
				}
				if (data) {
					const endTimestamp = Date.now();
					upscaleLog({
						text: `Updated the DB record with "succeeded" in: ${
							(endTimestamp - startTimestamp) / 1000
						}s`,
						type,
						scale,
						server_url
					});
				}
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
			data: { imageDataB64: output, duration_ms: upscaleDurationMs }
		};
		return new Response(JSON.stringify(upscaleResponse));
	} catch (error) {
		const endTimestamp = Date.now();
		upscaleLog({
			text: `Upscale error in: ${(endTimestamp - startTimestamp) / 1000}s`,
			scale,
			server_url,
			type
		});
		console.log(error);
		if (supabaseAdmin !== undefined && upscaleId !== undefined) {
			try {
				const startTimestamp = Date.now();
				let { data, error } = await supabaseAdmin
					.from('upscale')
					.update([
						{
							status: 'failed'
						}
					])
					.eq('id', upscaleId)
					.select('id');
				if (error) {
					console.log('error', error.message);
				}
				if (data) {
					const endTimestamp = Date.now();
					upscaleLog({
						text: `Updated the DB record with "failed" in: ${
							(endTimestamp - startTimestamp) / 1000
						}s`,
						type,
						scale,
						server_url
					});
				}
			} catch (error) {
				console.log(error);
			}
		}
	}
	return new Response(JSON.stringify({ error: 'Something went wrong :(' }));
};

function upscaleLog({
	text,
	scale,
	type,
	server_url
}: {
	text: string;
	scale: number;
	type: string;
	server_url: string;
}) {
	console.log('----', text, '--', `"${type}"`, '--', scale, '--', server_url, '----');
}

interface TUpscaleData {
	output: string[];
	status: TStatus;
	error?: string;
}

type TStatus = 'succeeded' | 'failed';

export interface TDBUpscaleProcessRes {
	data:
		| {
				id: string;
		  }[]
		| null;
	error: PostgrestError | null;
}
