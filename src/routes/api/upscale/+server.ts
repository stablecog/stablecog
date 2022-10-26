import { pickServerUrl } from '$ts/queries/db/pickServerUrl';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const {
		server_url,
		img,
		scale = 4,
		version = 'General - RealESRGANplus'
	}: TUpscaleRequest = await request.json();
	console.log(server_url, scale, version);
	let picked_server_url: string;
	try {
		const res = await pickServerUrl(server_url);
		picked_server_url = res.serverUrl;
	} catch (error) {
		picked_server_url = server_url;
	}
	try {
		const startTimestamp = Date.now();
		console.time('Request');
		const res = await fetch(`${picked_server_url}/predictions`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				input: {
					img,
					scale: scale.toString(),
					version,
					process_type: 'upscale'
				}
			})
		});
		console.timeEnd('Request');
		const endTimestamp = Date.now();
		const upscaleDurationMs = endTimestamp - startTimestamp;
		console.time('res.json() took:');
		const data: TUpscaleData = await res.json();
		console.timeEnd('res.json() took:');
		const output = data.output[0];
		const jsonStr = JSON.stringify({ img: output, duration_ms: upscaleDurationMs });
		return new Response(jsonStr);
	} catch (error) {
		console.log(error);
	}
	return new Response(JSON.stringify({ error: 'Something went wrong :(' }));
};

interface TUpscaleRequest {
	server_url: string;
	img: string;
	scale?: number;
	version: TUpscaleVersion;
}

interface TUpscaleData {
	output: string[];
	status: TStatus;
	error?: string;
}

type TStatus = 'succeeded' | 'failed';

export type TUpscaleVersion =
	| 'General - RealESRGANplus'
	| 'General - v3'
	| 'Anime - anime6B'
	| 'AnimeVideo - v3';
