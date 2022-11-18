import type { TDBGenerationG } from '$ts/types/db';

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
	width?: number;
	height?: number;
	seed?: number;
	num_inference_steps?: number;
	guidance_scale?: number;
	shouldSubmitToGallery?: boolean;
}

export interface TGenerationResponse {
	data?: {
		imageDataB64: string;
		duration_ms: number;
	};
	error?: string;
}

export interface TUpscaleRequest {
	imageDataB64: string;
	width?: number;
	height?: number;
	version: TUpscaleVersion;
	scale: number;
	server_url: string;
	seed?: number;
	num_inference_steps?: number;
	guidance_scale?: number;
	prompt?: string;
	negative_prompt?: string;
}

export interface TUpscaleResponse {
	data?: {
		imageDataB64: string;
		duration_ms: number;
	};
	error?: string;
}

export type TUpscaleVersion =
	| 'General - RealESRGANplus'
	| 'General - v3'
	| 'Anime - anime6B'
	| 'AnimeVideo - v3';

export interface TTab {
	label: string;
	value: string | number;
}

export type TServerFeatures = 'negative_prompt' | 'upscale';
export type TServerHealthStatus = 'healthy' | 'unhealthy' | 'not-set' | 'unknown' | 'loading';
export type TLastServerHealthStatus = 'healthy' | 'unhealthy' | 'not-set' | 'unknown';

export type TServerLocalStorage = {
	lastHealthStatus: TLastServerHealthStatus;
	features?: TServerFeatures[] | undefined;
};

export interface TServerHealthRes {
	status: TServerHealthStatus;
	features?: TServerFeatures[] | undefined;
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

export type TNavbarRouteOption = 'home' | 'live' | 'blog' | 'history' | 'gallery';
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
}

export interface TGenerationGWithLoaded extends TDBGenerationG {
	didLoadBefore: boolean;
}

export interface TGenerationGAdmin extends TDBGenerationG {
	didLoadBefore: boolean;
	status: 'deleted' | 'approved' | 'idle';
}

export type TCurrentSettingsPage = 'settings' | 'language';
