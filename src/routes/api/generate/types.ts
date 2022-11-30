import type { TAvailableModelId, TAvailableSchedulerId } from '$ts/constants/main';
import type { TModelNameCog, TOutputImageExtCog, TSchedulerNameCog } from '$ts/types/cog';
import type { PostgrestError } from '@supabase/supabase-js';

export interface TGenerateImageData {
	output: string[];
	status: TStatus;
	error?: string;
}

export interface TPredictionsRequestGeneration {
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
		output_image_ext: TOutputImageExtCog;
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

export interface TInsertGenerationRequestSupabase {
	width: number;
	height: number;
	seed: number;
	num_inference_steps: number;
	guidance_scale: number;
	picked_server_url: string;
	countryCode: string | null;
	model_id: string;
	scheduler_id: string;
	userAgent: string | null;
	logObject: TGenerationLogObject;
	deviceInfo: TDeviceInfo;
}
