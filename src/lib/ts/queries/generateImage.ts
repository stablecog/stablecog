import { apiBase } from '$ts/constants/main';
import type { TGenerationRequest, TGenerationResponse } from '$ts/types/main';

export async function generateImage({
	server_url,
	prompt,
	negative_prompt,
	model_id,
	scheduler_id,
	width,
	height,
	seed,
	num_inference_steps,
	guidance_scale,
	shouldSubmitToGallery = false
}: TGenerationRequest) {
	const response = await fetch(`${apiBase}/generate`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			server_url,
			prompt,
			negative_prompt,
			model_id,
			scheduler_id,
			width,
			height,
			num_inference_steps,
			guidance_scale,
			seed,
			shouldSubmitToGallery
		})
	});
	const start = Date.now();
	if (!response.ok) {
		throw new Error('Failed to generate image');
	}
	const resJSON: TGenerationResponse = await response.json();
	const end = Date.now();
	console.log(`JSON deserialization in: ${(end - start) / 1000}s`);
	return resJSON;
}
