import type { TGenerationRequest, TGenerationResponse } from '$ts/types/main';

export async function generateImage({
	server_url,
	prompt,
	width,
	height,
	seed,
	num_inference_steps,
	guidance_scale
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
