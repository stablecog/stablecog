import { apiBase } from '$ts/constants/main';
import type { TUpscaleRequest, TUpscaleResponse } from '$ts/types/main';

export async function upscaleImage({
	image_b64,
	server_url,
	width,
	height,
	num_inference_steps,
	guidance_scale,
	negative_prompt,
	prompt,
	seed,
	access_token
}: TUpscaleRequest) {
	const endpoint = 'upscale';
	const response = await fetch(`${apiBase}/${endpoint}`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			image_b64,
			server_url,
			width,
			height,
			num_inference_steps,
			guidance_scale,
			negative_prompt,
			prompt,
			seed,
			access_token
		})
	});
	const resJSON: TUpscaleResponse = await response.json();
	return resJSON;
}
