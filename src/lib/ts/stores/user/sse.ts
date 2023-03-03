import { writable } from 'svelte/store';

export let sse = writable<EventSource | null>(null);
export let sseId = writable<string | null>(null);

export interface TSSEGenerationOrUpscaleMessage {
	id: string;
	ui_id?: string;
	status?: TSSEGenerationOrUpscaleMessageStatus;
	outputs?: TSSEGenerationMessageOutput[] | TSSEUpscaleMessageOutput[];
	process_type: TProcessType;
	stream_id: string;
	error?: string;
}

export type TSSEGenerationOrUpscaleMessageStatus = 'processing' | 'succeeded' | 'failed';

export interface TSSEGenerationMessageOutput {
	id: string;
	gallery_status: TGalleryStatus;
	image_url: string;
}

export interface TSSEUpscaleMessageOutput {
	id: string;
	image_url: string;
	input_image_url: string;
	output_id?: string;
}

type TGalleryStatus = 'submitted';

type TProcessType = 'generate' | 'upscale' | 'generate_and_upscale';
