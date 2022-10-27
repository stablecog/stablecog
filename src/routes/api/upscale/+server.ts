import { pickServerUrl } from '$ts/queries/db/pickServerUrl';
import type { TUpscaleRequest, TUpscaleResponse } from '$ts/types/main';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const {
		server_url,
		imageDataB64,
		scale = 4,
		version = 'General - RealESRGANplus'
	}: TUpscaleRequest = await request.json();
	let picked_server_url: string;
	try {
		const res = await pickServerUrl(server_url);
		picked_server_url = res.serverUrl;
	} catch (error) {
		picked_server_url = server_url;
	}
	try {
		const startTimestamp = Date.now();
		upscaleLog({ text: 'Started upscale', scale, server_url, version });
		const res = await fetch(`${picked_server_url}/predictions`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				input: {
					img: imageDataB64,
					scale: scale.toString(),
					version,
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
			version
		});
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
		console.log(error);
	}
	return new Response(JSON.stringify({ error: 'Something went wrong :(' }));
};

function upscaleLog({
	text,
	scale,
	version,
	server_url
}: {
	text: string;
	scale: number;
	version: string;
	server_url: string;
}) {
	console.log('----', text, '--', `"${version}"`, '--', scale, '--', server_url, '----');
}

interface TUpscaleData {
	output: string[];
	status: TStatus;
	error?: string;
}

type TStatus = 'succeeded' | 'failed';
