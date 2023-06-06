import { writable } from 'svelte/store';

export let sse = writable<EventSource | null>(null);
export let sseId = writable<string | null>(null);

export interface TSSECreationProcessMessage {
	id: string;
	ui_id?: string;
	status?: TSSECreationProcessStatus;
	outputs?: TSSECreationProcessGenerationOutput[] | TSSECreationProcessUpscaleOutput[];
	audio_outputs?: TSSECreationProcessVoiceoverOutput[];
	process_type: TProcessType;
	stream_id: string;
	error?: string;
}

export type TSSECreationProcessStatus = 'processing' | 'succeeded' | 'failed';

export interface TSSECreationProcessGenerationOutput {
	id: string;
	gallery_status: TGalleryStatus;
	image_url: string;
}

export interface TSSECreationProcessUpscaleOutput {
	id: string;
	image_url: string;
	input_image_url: string;
	output_id?: string;
}

export interface TSSECreationProcessVoiceoverOutput {
	id: string;
	audio_file_url: string;
}

type TGalleryStatus = 'submitted';

type TProcessType = 'generate' | 'upscale' | 'generate_and_upscale' | 'voiceover';
