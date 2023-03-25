import { apiUrl } from '$ts/constants/main';
import type { TAvailableGenerationModelId } from '$ts/constants/generationModels';
import type { TAvailableSchedulerId } from '$ts/constants/schedulers';
import { writable } from 'svelte/store';
import {
	generationCostCompletionPerMs,
	getCostCompletionPerMsFromGeneration
} from '$ts/stores/cost';

export const generations = writable<TGeneration[]>([]);
export const activeGeneration = writable<TGenerationWithSelectedOutput | undefined>(undefined);

export const setGenerationToFailed = ({ id, error }: { id: string; error?: string }) => {
	generations.update(($generations) => {
		if ($generations === null || $generations.length === 0) {
			return $generations;
		}
		const genById = $generations.find((g) => g.id === id);
		if (genById) {
			genById.status = 'failed';
			genById.error = error;
			return $generations;
		}
		const genByUiId = $generations.find((g) => g.ui_id === id);
		if (genByUiId) {
			genByUiId.status = 'failed';
			genByUiId.error = error;
			return $generations;
		}
		return $generations;
	});
};

export const setGenerationToSucceeded = ({
	id,
	outputs
}: {
	id: string;
	outputs: TGenerationOutput[];
}) => {
	generations.update(($generations) => {
		if ($generations === null || $generations.length === 0) {
			return $generations;
		}
		const gen = $generations.find((g) => g.id === id);
		if (!gen) {
			return $generations;
		}
		gen.status = 'succeeded';
		gen.outputs = outputs;
		gen.completed_at = Date.now();
		const costCompletionPerMs = getCostCompletionPerMsFromGeneration(gen);
		if (costCompletionPerMs !== null) {
			generationCostCompletionPerMs.set(costCompletionPerMs);
		}
		return $generations;
	});
};

export const setGenerationToServerReceived = ({ ui_id, id }: { ui_id: string; id: string }) => {
	generations.update(($generations) => {
		if ($generations === null || $generations.length === 0) {
			return $generations;
		}
		const gen = $generations.find((g) => g.ui_id === ui_id);
		if (!gen) return $generations;
		if (
			gen.status === 'server-processing' ||
			gen.status === 'succeeded' ||
			gen.status === 'failed'
		) {
			return $generations;
		}
		gen.id = id;
		gen.status = 'server-received';
		return $generations;
	});
};

export const setGenerationToServerProcessing = ({ ui_id, id }: { ui_id: string; id: string }) => {
	generations.update(($generations) => {
		if ($generations === null || $generations.length === 0) {
			return $generations;
		}
		const gen = $generations.find((g) => g.id === id);
		if (gen && gen.status !== 'succeeded' && gen.status !== 'failed') {
			gen.status = 'server-processing';
			gen.started_at = Date.now();
			if (!gen.ui_id) gen.ui_id = ui_id;
			return $generations;
		}
		const gen2 = $generations.find((g) => g.ui_id === ui_id);
		if (gen2 && gen2.status !== 'succeeded' && gen2.status !== 'failed') {
			gen2.status = 'server-processing';
			gen2.started_at = Date.now();
			if (!gen2.id) gen2.id = id;
			return $generations;
		}
		return $generations;
	});
};

export async function queueInitialGenerationRequest(request: TInitialGenerationRequest) {
	generations.update(($generations) => {
		const generationToSubmit: TGeneration = {
			...request,
			status: 'to-be-submitted',
			created_at: Date.now(),
			outputs: []
		};
		if ($generations === null || $generations.length === 0) {
			return [generationToSubmit];
		}
		$generations = [generationToSubmit, ...$generations];
		return $generations;
	});
}

export async function submitInitialGenerationRequest(
	request: TInitialGenerationRequest,
	access_token: string,
	app_version: string
) {
	const promptText = request.prompt.text;
	const negativePromptText = request.negative_prompt?.text;
	const { prompt, negative_prompt, ...rest } = request;
	const finalRequest = {
		...rest,
		prompt: promptText,
		negative_prompt: negativePromptText
	};
	const response = await fetch(`${apiUrl.origin}/v1/user/generation`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-App-Version': app_version,
			Authorization: `Bearer ${access_token}`
		},
		body: JSON.stringify(finalRequest)
	});
	const resJSON: TInitialGenerationResponse = await response.json();
	console.log('Generation request response:', resJSON);
	return { ...resJSON, ui_id: request.ui_id };
}

export const setGenerationOutputToDeleted = (output_id: string) => {
	generations.update(($generations) => {
		if ($generations === null || $generations.length === 0) {
			return $generations;
		}
		for (let i = 0; i < $generations.length; i++) {
			const generation = $generations[i];
			for (let j = 0; j < generation.outputs.length; j++) {
				const output = generation.outputs[j];
				if (output.id === output_id) {
					generation.outputs[j].is_deleted = true;
					return $generations;
				}
			}
		}
		return $generations;
	});
};

export const setGenerationOutputToFavorited = (output_id: string) => {
	generations.update(($generations) => {
		if ($generations === null || $generations.length === 0) {
			return $generations;
		}
		for (let i = 0; i < $generations.length; i++) {
			const generation = $generations[i];
			for (let j = 0; j < generation.outputs.length; j++) {
				const output = generation.outputs[j];
				if (output.id === output_id) {
					generation.outputs[j].is_favorited = true;
					return $generations;
				}
			}
		}
		return $generations;
	});
};

export const setGenerationOutputToSubmitted = (output_id: string) => {
	generations.update(($generations) => {
		if ($generations === null || $generations.length === 0) {
			return $generations;
		}
		for (let i = 0; i < $generations.length; i++) {
			const generation = $generations[i];
			for (let j = 0; j < generation.outputs.length; j++) {
				const output = generation.outputs[j];
				if (output.id === output_id) {
					generation.outputs[j].gallery_status = 'submitted';
					return $generations;
				}
			}
		}
		return $generations;
	});
};

export const setGenerationOutputUpscaledImageUrl = ({
	output_id,
	upscaled_image_url,
	currently_active_generation
}: {
	output_id: string;
	upscaled_image_url: string;
	currently_active_generation: TGenerationWithSelectedOutput | undefined;
}) => {
	generations.update(($generations) => {
		if (currently_active_generation?.selected_output?.id === output_id) {
			currently_active_generation.selected_output.upscaled_image_url = upscaled_image_url;
			activeGeneration.set(currently_active_generation);
		}
		if ($generations === null || $generations.length === 0) {
			return $generations;
		}
		for (let i = 0; i < $generations.length; i++) {
			const generation = $generations[i];
			for (let j = 0; j < generation.outputs.length; j++) {
				const output = generation.outputs[j];
				if (output.id === output_id && !output.upscaled_image_url) {
					output.upscaled_image_url = upscaled_image_url;
					return $generations;
				}
			}
		}
		return $generations;
	});
};

export interface TInitialGenerationResponse {
	id?: string;
	error?: string;
	total_remaining_credits?: number;
}

export type TProcessType = 'generate' | 'generate_and_upscale';

export interface TGenerationBase {
	prompt: {
		id: string;
		text: string;
	};
	negative_prompt?: {
		id: string;
		text: string;
	};
	model_id: TAvailableGenerationModelId;
	scheduler_id: TAvailableSchedulerId;
	width: number;
	height: number;
	seed: number;
	inference_steps: number;
	guidance_scale: number;
	num_outputs: number;
	init_image_url?: string;
	prompt_strength?: number;
}

export interface TGeneration extends TGenerationBase {
	status: TGenerationStatus;
	error?: string;
	id?: string;
	ui_id: string;
	outputs: TGenerationOutput[];
	started_at?: number;
	created_at: number;
	completed_at?: number;
	submit_to_gallery: boolean;
}

export interface TGenerationOutput {
	id: string;
	image_url: string;
	upscaled_image_url?: string;
	created_at?: string;
	updated_at?: string;
	is_deleted?: boolean;
	is_favorited?: boolean;
	gallery_status?: TGalleryStatus;
}

export type TGalleryStatus = 'submitted' | 'approved' | 'rejected' | 'not_submitted';

export interface TGenerationFullOutput extends TGenerationOutput {
	generation: TGeneration;
}

export interface TGenerationWithSelectedOutput extends TGeneration {
	selected_output: TGenerationOutput;
}

export interface TInitialGenerationRequest extends TGenerationBase {
	ui_id: string;
	stream_id: string;
	output_image_extension: 'jpeg' | 'png' | 'webp';
	process_type: TProcessType;
	submit_to_gallery: boolean;
	init_image_file?: FileList;
}

export type TGenerationStatus =
	| 'to-be-submitted'
	| 'server-received'
	| 'server-processing'
	| 'succeeded'
	| 'failed';
