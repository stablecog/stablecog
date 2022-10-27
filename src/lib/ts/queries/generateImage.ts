import type { TGenerationRequest, TGenerationResponse } from '$ts/types/main';

export async function generateImage({
	server_url,
	prompt,
	negative_prompt,
	width,
	height,
	seed,
	num_inference_steps,
	guidance_scale
}: TGenerationRequest) {
	const response = await fetch(`/api/generate`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			server_url,
			prompt,
			negative_prompt,
			width,
			height,
			num_inference_steps,
			guidance_scale,
			seed
		})
	});
	const start = Date.now();
	const resJSON: TGenerationResponse = await response.json();
	const end = Date.now();
	console.log(`JSON deserialization in: ${(end - start) / 1000}s`);
	return resJSON;
}
