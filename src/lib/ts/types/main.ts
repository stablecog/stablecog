export type TStatus = 'idle' | 'loading' | 'success' | 'error';

export interface TGenerationBase {
	prompt: string;
	negative_prompt?: string;
	width: number;
	height: number;
	seed: number;
	num_inference_steps: number;
	guidance_scale: number;
	duration_ms?: number;
	server_url: string;
}

export interface TGenerationUI extends TGenerationBase {
	imageUrl?: string;
	computeRatePerSec?: number;
}

export interface TDBGeneration extends TGenerationBase {
	id?: number;
	imageDataB64: string;
}

export interface TGenerationRequest {
	server_url: string;
	prompt: string;
	negative_prompt?: string;
	width: number;
	height: number;
	seed: number;
	num_inference_steps: number;
	guidance_scale: number;
}

export interface TGenerationResponse {
	data?: {
		imageDataB64: string;
		duration_ms: number;
	};
	error?: string;
}

export interface TTab {
	label: string;
	value: string | number;
}

export type TServerFeatures = 'negative_prompt';
export type TServerHealthStatus = 'healthy' | 'unhealthy' | 'not-set' | 'unknown' | 'loading';

export type TServerHealth = {
	status: TServerHealthStatus;
	features?: TServerFeatures[] | undefined;
};

export type TSetServerProcessStatus = 'idle' | 'loading' | 'success' | 'error';

export type TIconSocial =
	| 'discord'
	| 'reddit'
	| 'twitter'
	| 'instagram'
	| 'telegram'
	| 'facebook'
	| 'github'
	| 'medium'
	| 'youtube'
	| 'email';
