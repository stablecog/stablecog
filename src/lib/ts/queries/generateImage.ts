export async function generateImage(
	url: string,
	prompt: string,
	width = 512,
	height = 512,
	seed?: number
) {
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
				seed: _seed,
				num_inference_steps: '50',
				guidance_scale: '7.5'
			}
		})
	});
	const data: TGenerateImageData = await response.json();
	console.log('data', data);
	const output = data.outputs[0];
	return output;
}

interface TGenerateImageData {
	outputs: string[];
}
