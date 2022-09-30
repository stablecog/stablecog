export async function generateImage(
	url: string,
	prompt: string,
	width = 512,
	height = 768,
	num_inference_steps = 100,
	guidance_scale = 7,
	seed?: number
) {
	const _seed = seed || Math.floor(Math.random() * 1000000);
	const response = await fetch(`/api/generate-image`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			url,
			prompt,
			width,
			height,
			num_inference_steps,
			guidance_scale,
			seed: _seed
		})
	});
	console.log(response);
	const resJSON: { data: string } = await response.json();
	const output = resJSON.data;
	return output;
}
