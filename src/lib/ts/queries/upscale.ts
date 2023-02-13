import { apiBase } from '$ts/constants/main';

export async function upscaleGenerationOutput({ output_id }: TUpscaleRequest) {
	const endpoint = 'upscale';
	const response = await fetch(`${apiBase}/${endpoint}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			output_id
		})
	});
	const resJSON: TUpscaleResponse = await response.json();
	return resJSON;
}

export interface TUpscaleRequest {
	output_id: string;
}

export interface TUpscaleResponse {
	data?: {
		image_b64: string;
		duration_ms: number;
	};
	error?: string;
}
