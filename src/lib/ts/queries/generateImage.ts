export async function generateImage({
	server_url,
	prompt,
	width = 512,
	height = 512,
	seed = Math.floor(Math.random() * 1000000000),
	num_inference_steps = 100,
	guidance_scale = 7
}: {
	server_url: string;
	prompt: string;
	width: number;
	height: number;
	num_inference_steps: number;
	guidance_scale: number;
	seed: number;
}) {
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
	const resJSON: { data: string | undefined; error: string | undefined } = await response.json();
	return resJSON;
}
