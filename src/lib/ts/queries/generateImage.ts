import type { TGenerationRequest, TGenerationResponse } from '$ts/types/main';

export async function generateImage({
	server_url,
	prompt,
	width = 512,
	height = 512,
	seed = Math.floor(Math.random() * 1000000000),
	num_inference_steps = 100,
	guidance_scale = 7
}: TGenerationRequest) {
	const response = await fetch(`/api/generate-image`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			server_url,
			prompt,
			width,
			height,
			num_inference_steps,
			guidance_scale,
			seed
		})
	});
	const resJSON: TGenerationResponse = await response.json();
	return resJSON;
}
