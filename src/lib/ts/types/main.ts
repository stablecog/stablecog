export type TStatus = 'idle' | 'loading' | 'success' | 'error';

export interface TGeneration {
	url: string;
	prompt: string;
	width: number;
	height: number;
	seed: number;
	num_inference_steps: number;
	guidance_scale: number;
	imageUrl?: string;
	iterationMpPerSecond?: number;
}

export interface TTab {
	label: string;
	value: string;
}
