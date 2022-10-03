export type TStatus = 'idle' | 'loading' | 'success' | 'error';

export interface TGeneration {
	server_url: string;
	prompt: string;
	width: number;
	height: number;
	seed: number;
	num_inference_steps: number;
	guidance_scale: number;
	imageUrl?: string;
	iterationMpPerSec?: number;
}

export interface TGenerationRequest {
	server_url: string;
	prompt: string;
	width: number;
	height: number;
	seed: number;
	num_inference_steps: number;
	guidance_scale: number;
}

export interface TGenerationResponse {
	data?: {
		imageDataB64: string;
	};
	error?: string;
}

export interface TTab {
	label: string;
	value: string;
}

export type TServerHealth = 'healthy' | 'unhealthy' | 'unknown' | 'loading';
