import { upscaleLog } from '$routes/api/upscale/helpers';
import type {
	TDBUpscaleProcessRes,
	TInsertUpscaleRequestSupabase,
	TUpscaleLogObject
} from '$routes/api/upscale/types';
import { supabaseAdmin } from '$ts/constants/supabaseAdmin';

export async function insertUpscaleSupabase({
	type,
	scale,
	negative_prompt,
	prompt,
	seed,
	width,
	height,
	num_inference_steps,
	picked_server_url,
	countryCode,
	guidance_scale,
	deviceInfo,
	userAgent,
	logObject
}: TInsertUpscaleRequestSupabase) {
	let upscaleId: string | undefined;
	if (!supabaseAdmin) {
		console.log('No supabaseAdmin');
		return { upscaleId };
	}
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
			logObject
		});
	}
	return { upscaleId };
}

export async function updateUpscaleAsSucceededSupabase({
	upscaleDurationMs,
	upscaleId,
	logObject
}: {
	upscaleDurationMs: number;
	upscaleId: string;
	logObject: TUpscaleLogObject;
}) {
	if (!supabaseAdmin) {
		console.log('No supabaseAdmin');
		return;
	}
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
			text: `Updated the DB record with "succeeded" in: ${(endTimestamp - startTimestamp) / 1000}s`,
			logObject
		});
	}
}

export async function updateUpscaleAsFailedSupabase({
	upscaleId,
	logObject
}: {
	upscaleId: string;
	logObject: TUpscaleLogObject;
}) {
	if (!supabaseAdmin) {
		console.log('No supabaseAdmin');
		return;
	}
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
			text: `Updated the DB record with "failed" in: ${(endTimestamp - startTimestamp) / 1000}s`,
			logObject
		});
	}
}
