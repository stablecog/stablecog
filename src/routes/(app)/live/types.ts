import type { TOperationSource } from '$ts/helpers/user/operations';

export type TProcessType = 'upscale' | 'generate' | 'voiceover';
export type TStatus = 'queued' | 'succeeded' | 'failed' | 'processing';

export interface TBaseRealtimePayload {
	process_type: TProcessType;
	id: string;
	country_code: string;
	status: TStatus;
	created_at: string;
	started_at?: string;
	completed_at?: string;
	target_num_outputs: number;
	actual_num_outputs?: number;
	product_id?: string;
	system_generated?: boolean;
	source: TOperationSource;
}
export interface TGenerationRealtimePayloadExt extends TBaseRealtimePayload {
	width: number;
	height: number;
	aspect_ratio?: string;
}
export interface TUpscaleRealtimePayloadExt extends TBaseRealtimePayload {
	width: number;
	height: number;
	aspect_ratio?: string;
}
export interface TVoiceoverRealtimePayloadExt extends TBaseRealtimePayload {
	denoise_audio: boolean;
	remove_silence: boolean;
	speaker_id: string;
	aspect_ratio?: string;
}

export type TAnyRealtimePayloadExt =
	| TGenerationRealtimePayloadExt
	| TUpscaleRealtimePayloadExt
	| TVoiceoverRealtimePayloadExt;

export interface TRow {
	key: string;
	value: string;
}
