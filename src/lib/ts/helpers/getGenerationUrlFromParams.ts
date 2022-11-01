export function getGenerationUrlFromParams({
	prompt,
	negative_prompt,
	width,
	height,
	guidance_scale,
	num_inference_steps,
	seed
}: TGenerationUrlFromParamsParams) {
	const baseUrl = '/?';
	let params: string[] = [];
	if (prompt) params.push(`p=${encodeURIComponent(prompt)}`);
	if (negative_prompt) params.push(`np=${encodeURIComponent(negative_prompt)}`);
	if (width) params.push(`w=${width}`);
	if (height) params.push(`h=${height}`);
	if (guidance_scale) params.push(`gs=${guidance_scale}`);
	if (num_inference_steps) params.push(`is=${num_inference_steps}`);
	if (seed || seed === 0) params.push(`s=${seed}`);
	return baseUrl + params.join('&');
}

export interface TGenerationUrlFromParamsParams {
	prompt?: string;
	negative_prompt?: string;
	width?: number;
	height?: number;
	seed?: number;
	num_inference_steps?: number;
	guidance_scale?: number;
}
