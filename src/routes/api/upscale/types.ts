import type { TDeviceInfo } from '$routes/api/generate/types';
import type { PostgrestError } from '@supabase/supabase-js';
import type { TProcessTypeCog, TTaskUCog } from '$ts/types/cog';

export interface TUpscaleData {
	output: string[];
	status: TStatus;
	error?: string;
}

export type TStatus = 'succeeded' | 'failed';

export interface TDBUpscaleProcessRes {
	data:
		| {
				id: string;
		  }[]
		| null;
	error: PostgrestError | null;
}

export interface TUpscaleLogObject {
	scale: number;
	type: string;
	server_url: string;
}

export interface TInsertUpscaleRequestSupabase {
	type: string;
	scale: number;
	prompt: string | undefined;
	negative_prompt: string | undefined;
	width: number | undefined;
	height: number | undefined;
	seed: number | undefined;
	num_inference_steps: number | undefined;
	guidance_scale: number | undefined;
	picked_server_url: string;
	countryCode: string | null;
	userAgent: string | null;
	logObject: TUpscaleLogObject;
	deviceInfo: TDeviceInfo;
}

export interface TPredictionsRequestUpscale {
	input: {
		image_u: string;
		task_u: TTaskUCog;
		process_type: TProcessTypeCog;
	};
}
