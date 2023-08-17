import type { TGenerationFullOutput } from '$ts/stores/user/generation';

export interface TGalleryGenerationFullOutputPageRes {
	hits: TGalleryGenerationHit[];
	next?: string;
}
export interface TUserProfileGenerationFullOutputPageRes {
	hits: TGalleryGenerationHit[];
	next?: string;
	metadata: {
		username: string;
	};
}

export interface TGalleryGenerationHit {
	id: string;
	generation_id: string;
	image_url: string;
	upscaled_image_url?: string;
	created_at: string;
	updated_at: string;
	width: number;
	height: number;
	inference_steps: number;
	guidance_scale: number;
	model_id: string;
	scheduler_id: string;
	prompt_text: string;
	prompt_id: string;
	negative_prompt_text?: string;
	negative_prompt_id?: string;
	is_public: boolean;
	was_auto_submitted: boolean;
	user: {
		username: string;
	};
}

export interface TUserProfileFullOutputsPage {
	outputs: TGenerationFullOutput[];
	next?: string | number;
	metadata: {
		username: string;
	};
}
