import { supabaseAdmin } from '$ts/constants/supabaseAdmin';
import { getDeviceInfo } from '$ts/helpers/getDeviceInfo';
import type { TGenerationRequest, TGenerationResponse } from '$ts/types/main';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const startTimestamp = Date.now();
	const startDate = new Date(startTimestamp).toUTCString();
	try {
		const {
			server_url,
			prompt,
			seed,
			width,
			height,
			num_inference_steps,
			guidance_scale
		}: TGenerationRequest = await request.json();
		generationLog({
			text: 'Started generation:',
			dateString: startDate,
			prompt,
			width,
			height,
			num_inference_steps,
			guidance_scale,
			seed,
			server_url
		});
		const response = await fetch(`${server_url}/predictions`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				input: {
					prompt: prompt,
					width: width.toString(),
					height: height.toString(),
					seed: seed.toString(),
					num_inference_steps: num_inference_steps.toString(),
					guidance_scale: guidance_scale.toString()
				}
			})
		});
		const data: TGenerateImageData = await response.json();
		const output = data.output[0];
		const endTimestamp = Date.now();
		const endDate = new Date(endTimestamp).toUTCString();
		if (data.error) {
			console.log('----', endDate, '--', data.error, '----');
		}
		generationLog({
			text: `Ended generation in ${(endTimestamp - startTimestamp) / 1000}s:`,
			dateString: endDate,
			prompt,
			width,
			height,
			num_inference_steps,
			guidance_scale,
			seed,
			server_url
		});
		// If Supabase is setup, write to
		if (output && !data.error && supabaseAdmin !== undefined) {
			try {
				const { headers } = request;
				const countryCode = headers.get('cf-ipcountry');
				const userAgent = headers.get('user-agent');
				const deviceInfo = getDeviceInfo(userAgent);
				const dbEntryStartTimestamp = Date.now();
				let { data, error } = await supabaseAdmin.from('generation').insert([
					{
						prompt,
						seed,
						width,
						height,
						num_inference_steps,
						guidance_scale,
						server_url,
						country_code: countryCode,
						device_type: deviceInfo.type,
						device_browser: deviceInfo.browser,
						device_os: deviceInfo.os,
						user_agent: userAgent
					}
				]);
				if (error) {
					console.log('error', error.message);
				} else {
					const dbEntryEndTimestamp = Date.now();
					const dbEntryEndDate = new Date(dbEntryEndTimestamp).toUTCString();
					generationLog({
						text: `Inserted into the DB in ${dbEntryEndTimestamp - dbEntryStartTimestamp}ms:`,
						dateString: dbEntryEndDate,
						prompt,
						seed,
						width,
						height,
						num_inference_steps,
						guidance_scale,
						server_url
					});
				}
			} catch (error) {
				console.log(error);
			}
		}
		const generationResponse: TGenerationResponse = {
			data: output ? { imageDataB64: output } : undefined,
			error: data.error
		};
		return new Response(JSON.stringify(generationResponse));
	} catch (error) {
		const endTimestamp = Date.now();
		const endDate = new Date(endTimestamp).toUTCString();
		console.log(
			'----',
			`Failed generation in ${(endTimestamp - startTimestamp) / 1000}s:`,
			endDate,
			'--',
			error,
			'----'
		);
		return new Response(JSON.stringify({ error: 'Something went wrong :(' }));
	}
};

interface TGenerateImageData {
	output: string[];
	status: TStatus;
	error?: string;
}

type TStatus = 'succeeded' | 'failed';

const generationLog = ({
	text,
	dateString,
	prompt,
	width,
	height,
	num_inference_steps,
	guidance_scale,
	seed,
	server_url
}: {
	text: string;
	dateString: string;
	prompt: string;
	width: number;
	height: number;
	num_inference_steps: number;
	guidance_scale: number;
	seed: number;
	server_url: string;
}) => {
	console.log(
		'----',
		text,
		dateString,
		'--',
		`"${prompt}"`,
		'--',
		width,
		'--',
		height,
		'--',
		num_inference_steps,
		'--',
		guidance_scale,
		'--',
		seed,
		'--',
		server_url,
		'----'
	);
};
