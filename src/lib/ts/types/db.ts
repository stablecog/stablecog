import type { TGenerationBase } from '$ts/types/main';

export interface TIndexedDBGeneration extends TGenerationBase {
	id?: number;
}

export interface TDBServer {
	id: string;
	url: string;
	healthy: boolean;
	last_health_check_at: string;
	created_at: string;
	updated_at: string;
}

export interface TDBGenerationRealtimePayload {
	id: string;
	country_code: string | null;
	duration_ms: number | null;
	status: 'started' | 'succeeded' | 'failed' | 'rejected';
	uses_default_server: boolean;
	created_at: string;
	updated_at: string;
	width: number | null;
	height: number | null;
	num_inference_steps: number | null;
}
