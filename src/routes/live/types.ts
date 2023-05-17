import type { TOperationSource } from '$ts/helpers/user/operations';

export type TProcessType = 'upscale' | 'generate';
export type TStatus = 'queued' | 'succeeded' | 'failed' | 'processing';

export interface TBaseRealtimePayload {
	process_type: TProcessType;
	id: string;
	country_code: string;
	status: TStatus;
	created_at: string;
	started_at?: string;
	completed_at?: string;
	width: number;
	height: number;
	target_num_outputs: number;
	actual_num_outputs?: number;
	product_id?: string;
	system_generated?: boolean;
	source: TOperationSource;
}
export interface TGenerationRealtimePayloadExt extends TBaseRealtimePayload {
	aspect_ratio?: string;
}
export interface TUpscaleRealtimePayloadExt extends TBaseRealtimePayload {
	aspect_ratio?: string;
}
export interface TRow {
	key: string;
	value: string;
}
