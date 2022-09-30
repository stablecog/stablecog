import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const { url, prompt, seed, width, height, num_inference_steps, guidance_scale } =
		await request.json();
	console.log(
		'-----',
		new Date(Date.now()),
		`"${prompt}"`,
		seed,
		width,
		height,
		num_inference_steps,
		guidance_scale,
		url,
		'-----'
	);
	const _seed = seed || Math.floor(Math.random() * 1000000);
	const response = await fetch(`${url}/predictions`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json'
		},
		body: JSON.stringify({
			input: {
				prompt: prompt,
				width: width.toString(),
				height: height.toString(),
				seed: _seed.toString(),
				num_inference_steps: num_inference_steps.toString(),
				guidance_scale: guidance_scale.toString()
			}
		})
	});
	const data: TGenerateImageData = await response.json();
	const output = data.output[0];
	return new Response(JSON.stringify({ data: output }));
};

interface TGenerateImageData {
	output: string[];
}
