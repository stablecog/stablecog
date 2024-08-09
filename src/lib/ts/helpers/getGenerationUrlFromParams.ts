import { page } from '$app/stores';
import { get } from 'svelte/store';

export function getGenerationUrlFromParams({
	prompt,
	negative_prompt,
	model_id,
	scheduler_id,
	width,
	height,
	guidance_scale,
	seed
}: TGenerationUrlFromParamsParams) {
	const baseUrl = '/generate';
	const urlParams = new URLSearchParams();
	if (prompt) {
		urlParams.set('p', prompt.text);
	}
	if (negative_prompt) {
		urlParams.set('np', negative_prompt.text);
	}
	if (width) {
		urlParams.set('w', width.toString());
	}
	if (height) {
		urlParams.set('h', height.toString());
	}
	if (seed || seed === 0) {
		urlParams.set('s', seed.toString());
	}
	if (model_id) {
		urlParams.set('mi', model_id);
	}
	if (guidance_scale) {
		urlParams.set('gs', guidance_scale.toString());
	}
	// TO-DO: Removed scheduler_id for now
	/* if (scheduler_id) params.push(`si=${scheduler_id}`); */
	if (get(page).url.pathname === '/generate') {
		urlParams.set('rn', Math.round(Math.random() * 1_000_000_000).toString());
	}
	const paramsStr = urlParams.toString();
	const relativeUrl = baseUrl + (paramsStr !== '' ? `?${paramsStr}` : '');
	return relativeUrl;
}

export interface TGenerationUrlFromParamsParams {
	prompt: {
		id: string;
		text: string;
	};
	negative_prompt?: {
		id: string;
		text: string;
	};
	model_id?: string;
	scheduler_id?: string;
	width?: number;
	height?: number;
	seed?: number;
	num_inference_steps?: number;
	guidance_scale?: number;
}
