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

export const setGenerationToFailed = (id: string, error?: string) => {
	generations.update(($generations) => {
		if ($generations === null) {
			return $generations;
		}
		const index = $generations.findIndex((gen) => gen.id === id);
		if (index >= 0) {
			$generations[index].status = 'failed';
			$generations[index].error = error;
			$generations[index].completed_at = Date.now();
			return $generations;
		}
		const ui_index = $generations.findIndex((gen) => gen.ui_id === id);
		if (ui_index >= 0) {
			$generations[ui_index].status = 'failed';
			$generations[ui_index].error = error;
			$generations[index].completed_at = Date.now();
			return $generations;
		}
		return $generations;
	});
};

export const setGenerationToSucceeded = (id: string, outputs: TGenerationOutput[]) => {
	generations.update(($generations) => {
		if ($generations === null) {
			return $generations;
		}
		const index = $generations.findIndex((gen) => gen.id === id);
		if (index === -1) {
			return $generations;
		}
		$generations[index].status = 'succeeded';
		$generations[index].outputs = outputs;
		$generations[index].completed_at = Date.now();
		const costCompletionPerMs = getCostCompletionPerMsFromGeneration($generations[index]);
		if (costCompletionPerMs !== null) {
			generationCostCompletionPerMs.set(costCompletionPerMs);
		}
		return $generations;
	});
};

export const setGenerationToServerReceived = (id: string) => {
	generations.update(($generations) => {
		if ($generations === null) {
			return $generations;
		}
		if (
			$generations[0].status !== 'server-processing' &&
			$generations[0].status !== 'succeeded' &&
			$generations[0].status !== 'failed'
		) {
			$generations[0].id = id;
			$generations[0].status = 'server-received';
		}
		return $generations;
	});
};

export const setGenerationToServerProcessing = (id: string) => {
	console.log('called');
	generations.update(($generations) => {
		console.log('called2');
		if ($generations === null) {
			return $generations;
		}
		console.log('called3', id, $generations);
		console.log('called3', id, $generations);
		console.log('called3', id, $generations);
		console.log('called3', id, $generations);
		console.log('called3', id, $generations);
		console.log('called3.5', typeof $generations, typeof $generations[0].id);
		for (const item of $generations) {
			for (const k of Object.keys(item)) {
				console.log('item', k, item[k]);
			}
		}
		const gen = $generations.find((g) => g.id === id);
		console.log('called4', gen);
		if (!gen) {
			return $generations;
		}
		if (gen.status !== 'succeeded' && gen.status !== 'failed') {
			gen.status = 'server-processing';
		}
		gen.started_at = Date.now();
		console.log('REACHED HERE');
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
		if ($generations === null) {
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
	const response = await fetch(`${apiUrl.href}v1/user/generation`, {
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
	return resJSON;
}

export const setGenerationOutputToDeleted = (outputId: string) => {
	generations.update(($generations) => {
		if ($generations === null) {
			return $generations;
		}
		for (let i = 0; i < $generations.length; i++) {
			const generation = $generations[i];
			for (let j = 0; j < generation.outputs.length; j++) {
				const output = generation.outputs[j];
				if (output.id === outputId) {
					generation.outputs[j].is_deleted = true;
					return $generations;
				}
			}
		}
		return $generations;
	});
};

export const setGenerationOutputUpscaledImageUrl = (
	outputId: string,
	upscaled_image_url: string,
	currentlyActiveGeneration: TGenerationWithSelectedOutput | undefined
) => {
	generations.update(($generations) => {
		if (currentlyActiveGeneration?.selected_output?.id === outputId) {
			currentlyActiveGeneration.selected_output.upscaled_image_url = upscaled_image_url;
			activeGeneration.set(currentlyActiveGeneration);
		}
		if ($generations === null) {
			return $generations;
		}
		for (let i = 0; i < $generations.length; i++) {
			const generation = $generations[i];
			for (let j = 0; j < generation.outputs.length; j++) {
				const output = generation.outputs[j];
				if (output.id === outputId && !output.upscaled_image_url) {
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
	gallery_status: TGalleryStatus;
}

export type TGalleryStatus = 'submitted' | 'approved' | 'rejected' | 'not-submitted';

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
}

export type TGenerationStatus =
	| 'to-be-submitted'
	| 'server-received'
	| 'server-processing'
	| 'succeeded'
	| 'failed';
