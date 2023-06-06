import {
	setGenerationToFailed,
	setGenerationToServerProcessing,
	setGenerationToSucceeded
} from '$ts/stores/user/generation';
import type {
	TSSECreationProcessGenerationOutput,
	TSSECreationProcessMessage,
	TSSECreationProcessUpscaleOutput,
	TSSECreationProcessVoiceoverOutput
} from '$ts/stores/user/sse';
import {
	setUpscaleToFailed,
	setUpscaleToServerProcessing,
	setUpscaleToSucceeded
} from '$ts/stores/user/upscale';
import {
	setVoiceoverToFailed,
	setVoiceoverToServerProcessing,
	setVoiceoverToSucceeded
} from '$ts/stores/user/voiceovers';

export function isCreationProcessData(data: any) {
	return (
		data.process_type === 'upscale' ||
		data.process_type === 'generate' ||
		data.process_type === 'generate_and_upscale' ||
		data.process_type === 'voiceover'
	);
}

export function setCreationProcessStatus(data: TSSECreationProcessMessage) {
	if (data.process_type === 'voiceover') {
		if (data.id && data.ui_id && data.status === 'processing') {
			setVoiceoverToServerProcessing({ ui_id: data.ui_id, id: data.id });
		} else if (
			data.id &&
			data.ui_id &&
			data.status === 'succeeded' &&
			data.outputs &&
			data.outputs.length > 0
		) {
			const outputs = data.outputs as TSSECreationProcessVoiceoverOutput[];
			setVoiceoverToSucceeded({ id: data.id, outputs });
		} else if (data.id && data.status === 'failed') {
			setVoiceoverToFailed({ id: data.id, error: data.error });
		}
	} else if (data.process_type === 'generate' || data.process_type === 'generate_and_upscale') {
		if (data.id && data.ui_id && data.status === 'processing') {
			setGenerationToServerProcessing({ ui_id: data.ui_id, id: data.id });
		} else if (
			data.id &&
			data.ui_id &&
			data.status === 'succeeded' &&
			data.outputs &&
			data.outputs.length > 0
		) {
			const outputs = data.outputs as TSSECreationProcessGenerationOutput[];
			setGenerationToSucceeded({ id: data.id, outputs: outputs });
		} else if (data.id && data.status === 'failed') {
			setGenerationToFailed({ id: data.id, error: data.error });
		}
	} else if (data.process_type === 'upscale') {
		if (data.id && data.ui_id && data.status === 'processing') {
			setUpscaleToServerProcessing({ ui_id: data.ui_id, id: data.id });
		} else if (data.id && data.status === 'succeeded' && data.outputs && data.outputs.length > 0) {
			const outputs = data.outputs as TSSECreationProcessUpscaleOutput[];
			setUpscaleToSucceeded({ id: data.id, outputs: outputs });
		} else if (data.id && data.status === 'failed') {
			setUpscaleToFailed({ id: data.id, error: data.error });
		}
	}
}
