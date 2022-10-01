import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	try {
		const { url, prompt, seed, width, height, num_inference_steps, guidance_scale } =
			await request.json();
		console.log(
			'-----',
			new Date(Date.now()).toUTCString(),
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
		if (data.error) {
			console.log('-----', new Date(Date.now()).toUTCString(), data.error, '-----');
		}
		return new Response(JSON.stringify({ data: output, error: data.error }));
	} catch (error) {
		return new Response(JSON.stringify({ error: 'Something went wrong' }));
	}
};

interface TGenerateImageData {
	output: string[];
	status: TStatus;
	error?: string;
}

type TStatus = 'succeeded' | 'failed';
