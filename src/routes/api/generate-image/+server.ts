import { supabaseAdmin } from '$ts/constants/supabaseAdmin';
import type { RequestHandler } from '@sveltejs/kit';

export const POST: RequestHandler = async ({ request }) => {
	const startTimestamp = Date.now();
	const startDate = new Date(startTimestamp).toUTCString();
	const { headers } = request;
	console.log('Country is:', headers.get('CF-IPCountry'));
	try {
		const { server_url, prompt, seed, width, height, num_inference_steps, guidance_scale } =
			await request.json();
		console.log(
			'----',
			'Started:',
			startDate,
			`"${prompt}"`,
			seed,
			width,
			height,
			num_inference_steps,
			guidance_scale,
			server_url,
			'----'
		);
		const response = await fetch(`${server_url}/predictions`, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json'
			},
			body: JSON.stringify({
				input: {
					prompt: prompt,
					width: width.toString(),
					height: height.toString(),
					seed: seed.toString(),
					num_inference_steps: num_inference_steps.toString(),
					guidance_scale: guidance_scale.toString()
				}
			})
		});
		const data: TGenerateImageData = await response.json();
		const output = data.output[0];
		if (data.error) {
			console.log('----', new Date(Date.now()).toUTCString(), data.error, '----');
		}
		console.log(
			'----',
			`Ended in ${(Date.now() - startTimestamp) / 1000}s:`,
			startDate,
			`"${prompt}"`,
			seed,
			width,
			height,
			num_inference_steps,
			guidance_scale,
			server_url,
			'----'
		);
		if (output && !data.error) {
			try {
				let { data, error } = await supabaseAdmin.from('generation').insert([
					{
						prompt,
						seed,
						width,
						height,
						num_inference_steps,
						guidance_scale,
						server_url
					}
				]);
				if (error) {
					console.log('error', error.message);
				} else {
					console.log(
						'----',
						'Inserted into the database:',
						startDate,
						`"${prompt}"`,
						seed,
						width,
						height,
						num_inference_steps,
						guidance_scale,
						server_url,
						'----'
					);
				}
			} catch (error) {
				console.log(error);
			}
		}
		return new Response(JSON.stringify({ data: output, error: data.error }));
	} catch (error) {
		console.log('----', `Failed in ${(Date.now() - startTimestamp) / 1000}s`, '----');
		return new Response(JSON.stringify({ error: 'Something went wrong...' }));
	}
};

interface TGenerateImageData {
	output: string[];
	status: TStatus;
	error?: string;
}

type TStatus = 'succeeded' | 'failed';
