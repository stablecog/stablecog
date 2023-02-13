import type { TAvailableModelId } from '$ts/constants/models';
import type { TAvailableSchedulerId } from '$ts/constants/schedulers';
import type { TGenerationBase } from '$ts/types/main';
import type { IStripeSubscriptionTier } from '$ts/types/stripe';

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
	user_tier: IStripeSubscriptionTier;
}

export interface TDBUpscaleRealtimePayload {
	id: string;
	country_code: string | null;
	duration_ms: number | null;
	status: 'started' | 'succeeded' | 'failed' | 'rejected';
	scale: number;
	uses_default_server: boolean;
	created_at: string;
	updated_at: string;
	width: number | null;
	height: number | null;
	user_tier: IStripeSubscriptionTier;
}

export interface TDBGenerationG {
	id: string;
	width: number;
	height: number;
	seed: number;
	num_inference_steps: number | null;
	guidance_scale: number;
	image_id: string;
	created_at: string;
	updated_at: string;
	prompt: {
		id: string;
		text: string;
	};
	negative_prompt: { id: string; text: string } | null;
	model: {
		id: TAvailableModelId;
		name: string;
	} | null;
	scheduler: {
		id: TAvailableSchedulerId;
		name: string;
	} | null;
}

export interface TDBGeneration {
	id: string;
	width: number;
	height: number;
	seed: number;
	num_inference_steps: number | null;
	guidance_scale: number;
	image_object_name: string;
	created_at: string;
	updated_at: string;
	prompt: {
		id: string;
		text: string;
	};
	negative_prompt: { id: string; text: string } | null;
	model: {
		id: TAvailableModelId;
		name: string;
	} | null;
	scheduler: {
		id: TAvailableSchedulerId;
		name: string;
	} | null;
	duration_ms: number | null;
}
