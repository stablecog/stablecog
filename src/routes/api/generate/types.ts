import type { TAvailableModelId, TAvailableSchedulerId } from '$ts/constants/main';
import type { PostgrestError } from '@supabase/supabase-js';

export interface TGenerateImageData {
	output: string[];
	status: TStatus;
	error?: string;
}

export type TSchedulerNameCog = 'K_LMS' | 'K_EULER' | 'K_EULER_ANCESTRAL';

export type TModelNameCog =
	| 'Stable Diffusion v1.5'
	| 'Openjourney'
	| 'Arcane Diffusion'
	| 'Ghibli Diffusion'
	| 'Mo-Di Diffusion';
export type TOutputImageExt = 'png' | 'jpg';

export interface TPredictionsRequest {
	input: {
		prompt: string;
		negative_prompt?: string;
		model: TModelNameCog;
		scheduler: TSchedulerNameCog;
		width: string;
		height: string;
		seed: string;
		num_inference_steps: string;
		guidance_scale: string;
		output_image_ext: TOutputImageExt;
	};
}
type TStatus = 'succeeded' | 'failed';

export type TDBGenerationProcessStatus = 'started' | 'succeeded' | 'failed' | 'rejected';

export interface TDBGenerationProcessRes {
	data:
		| {
				id: string;
				/* status: TDBGenerationProcessStatus;
				generation_id: string | null;
				country_code: string | null;
				created_at: string;
				updated_at: string; */
		  }[]
		| null;
	error: PostgrestError | null;
}

export interface TGenerationLogObject {
	prompt: string;
	negative_prompt?: string;
	model_id: TAvailableModelId;
	scheduler_id: TAvailableSchedulerId;
	width: number;
	height: number;
	num_inference_steps: number;
	guidance_scale: number;
	seed: number;
	server_url: string;
}

export interface TDeviceInfo {
	type: string | null;
	browser: string | null | undefined;
	os: string | null | undefined;
}
