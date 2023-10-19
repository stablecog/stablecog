import { writable } from 'svelte/store';
import type { TQueueItem } from '$ts/stores/user/queue';

export let sse = writable<EventSource | null>(null);
export let sseId = writable<string | null>(null);

export interface TSSEQueueUpdateMessage {
	message_type: 'queue';
	queue_items: TQueueItem[];
}

export interface TSSECreationProcessMessage {
	message_type: 'creation_process';
	id: string;
	ui_id?: string;
	status?: TSSECreationProcessStatus;
	outputs?:
		| TSSECreationProcessGenerationOutput[]
		| TSSECreationProcessUpscaleOutput[]
		| TSSECreationProcessVoiceoverOutput[];
	process_type: TProcessType;
	stream_id: string;
	error?: string;
}

export type TSSEMessage = TSSEQueueUpdateMessage | TSSECreationProcessMessage;

export type TSSECreationProcessStatus = 'processing' | 'succeeded' | 'failed';

export interface TSSECreationProcessGenerationOutput {
	id: string;
	gallery_status: TGalleryStatus;
	image_url: string;
	was_auto_submitted: boolean;
	is_public: boolean;
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
	audio_duration: number;
}

type TGalleryStatus = 'submitted';

type TProcessType = 'generate' | 'upscale' | 'generate_and_upscale' | 'voiceover';
