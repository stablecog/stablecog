import { apiUrl } from '$ts/constants/main';

export async function upscaleGenerationOutput({
	input,
	stream_id,
	access_token,
	app_version
}: TUpscaleRequest) {
	const response = await fetch(`${apiUrl.href}v1/user/upscale`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + access_token,
			'X-App-Version': app_version
		},
		body: JSON.stringify({
			type: 'from_output',
			input,
			stream_id: stream_id,
			model_id: '14c9c5a4-33a8-4aed-a648-ee8510ae65b2'
		})
	});
	const resJSON: TUpscaleResponse = await response.json();
	console.log(resJSON);
	return resJSON;
}

export interface TUpscaleRequest {
	input: string;
	access_token: string;
	stream_id: string;
	app_version: string;
}

export type TUpscaleType = 'from_image' | 'from_output';

export interface TUpscaleResponse {
	data?: {
		image_b64: string;
		duration_ms: number;
	};
	error?: string;
}
