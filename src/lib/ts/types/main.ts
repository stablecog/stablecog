import type { TAvailableModelId } from '$ts/constants/models';
import type { TAvailableSchedulerId } from '$ts/constants/schedulers';
import type { TDBGenerationG } from '$ts/types/db';

export type TStatus = 'idle' | 'loading' | 'success' | 'error';

export type THrefTarget = '_blank' | '_self';

export interface TGenerationBase {
	prompt: string;
	negative_prompt?: string;
	model_id?: TAvailableModelId;
	scheduler_id?: TAvailableSchedulerId;
	width: number;
	height: number;
	seed: number;
	num_inference_steps: number;
	guidance_scale: number;
	duration_ms?: number;
	server_url: string;
	imageDataB64: string;
	upscaledImageDataB64?: string;
}

export interface TGenerationUI extends TGenerationBase {
	id?: number;
	imageUrl?: string;
	upscaledImageUrl?: string;
	computeRatePerSec?: number;
}

export interface TGenerationRequest {
	server_url: string;
	prompt: string;
	negative_prompt?: string;
	model_id?: TAvailableModelId;
	scheduler_id?: TAvailableSchedulerId;
	width?: number;
	height?: number;
	seed?: number;
	num_inference_steps?: number;
	guidance_scale?: number;
	output_image_ext?: 'jpg' | 'png';
	init_image?: string;
	mask?: string;
	prompt_strength?: number;
	should_submit_to_gallery?: boolean;
	access_token?: string;
	app_version: string;
}

export interface TGenerationResponse {
	data?: {
		image_b64: string;
		duration_ms: number;
	};
	error?: string;
}

export interface TTab<T> {
	label: string;
	value: T;
}

export type TServerHealthStatus = 'healthy' | 'unhealthy' | 'not-set' | 'unknown' | 'loading';
export type TLastServerHealthStatus = 'healthy' | 'unhealthy' | 'not-set' | 'unknown';

export interface TServerFeature {
	name: string;
	values?: string[];
}
export type TServerLocalStorage = {
	lastHealthStatus: TLastServerHealthStatus;
	features?: TServerFeature[] | undefined;
};

export interface TServerHealthRes {
	status: TServerHealthStatus;
	features?: TServerFeature[] | undefined;
}

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
	| 'email'
	| 'producthunt';

export type TNavbarRouteOption =
	| 'home'
	| 'live'
	| 'blog'
	| 'history'
	| 'gallery'
	| 'servers'
	| 'users';

export interface TNavbarRoute {
	name: string;
	href: string;
	icon: TNavbarRouteOption;
}

export interface TBlogPost {
	slug: string;
	title: string;
	description: string;
	author: string;
	author_url?: string;
	date: string;
}

export interface TToC {
	title: string;
	description: string;
	author: string;
	author_url?: string;
	date: string;
}

export type TTabBarPlacement = 'bottom' | 'normal';

export type TUpscaleStatus = 'idle' | 'success' | 'loading' | 'error';

export interface TGalleryResponse {
	generations: TDBGenerationG[];
	page: number;
	next: number | null | undefined;
	totalCount?: number;
}

export interface TGalleryResponse {
	generations: TDBGenerationG[];
	page: number;
	next: number | null | undefined;
}

export interface TGenerationGWithLoaded extends TDBGenerationG {
	didLoadBefore: boolean;
}

export interface TGenerationGAdmin extends TDBGenerationG {
	didLoadBefore: boolean;
	status: 'deleted' | 'approved' | 'idle';
}

export type TCurrentSettingsPage = 'settings' | 'language';

export interface TServerHealthData {
	paths?: {
		predictions?: {
			post?: {
				summary?: string;
			};
		};
	};
	components?: {
		schemas?: {
			Input?: {
				properties?: {
					prompt?: {
						title?: string;
					};
					negative_prompt?: {
						title?: string;
					};
					width?: {
						[key: string]: string;
					};
					height?: {
						[key: string]: string;
					};
					num_inference_steps?: {
						title: string;
					};
					guidance_scale?: {
						title: string;
					};
					seed?: {
						title: string;
					};
					image_u?: {
						title: string;
					};
				};
			};
		};
	};
}
