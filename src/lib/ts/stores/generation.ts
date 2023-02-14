import { apiUrl } from '$ts/constants/main';
import type { TAvailableModelId } from '$ts/constants/models';
import type { TAvailableSchedulerId } from '$ts/constants/schedulers';
import { writable } from 'svelte/store';

export const activeGeneration = writable<TGeneration | undefined>(undefined);
export const activeGenerationOutputIndex = writable(0);
export const generations = writable<TGeneration[]>([]);

export const setGenerationToFailed = (id: string, error?: string) => {
	generations.update(($generations) => {
		if ($generations === null) {
			return $generations;
		}
		const index = $generations.findIndex((gen) => gen.id === id);
		if (index >= 0) {
			$generations[index].status = 'failed';
			$generations[index].error = error;
			return $generations;
		}
		const ui_index = $generations.findIndex((gen) => gen.ui_id === id);
		if (ui_index >= 0) {
			$generations[ui_index].status = 'failed';
			$generations[ui_index].error = error;
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
		const outputsEdited = outputs.map((o) => {
			const { image_url, upscaled_image_url, ...rest } = o;
			return {
				...rest,
				image_url: getUrl(image_url),
				upscaled_image_url: upscaled_image_url ? getUrl(upscaled_image_url) : undefined
			};
		});
		$generations[index].outputs = outputsEdited;
		return $generations;
	});
};

export const setGenerationToServerReceived = (id: string) => {
	generations.update(($generations) => {
		if ($generations === null) {
			return $generations;
		}
		$generations[0].id = id;
		$generations[0].status = 'server-received';
		return $generations;
	});
};

export async function qeueuInitialGenerationRequest(request: TInitialGenerationRequest) {
	generations.update(($generations) => {
		const generationToSubmit: TGeneration = {
			...request,
			status: 'to-be-submitted',
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
	const response = await fetch(`${apiUrl.href}v1/user/generation`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-App-Version': app_version,
			Authorization: 'Bearer ' + access_token
		},
		body: JSON.stringify(request)
	});
	const resJSON: TInitialGenerationResponse = await response.json();
	console.log('Generation request response:', resJSON);
	return resJSON;
}

function getUrl(url: string) {
	const prefix = 's3://';
	const withoutPrefix = url.slice(prefix.length);
	const [_bucket, ...path] = withoutPrefix.split('/');
	return `https://b.stablecog.com/${path.join('/')}`;
}

export interface TInitialGenerationResponse {
	id?: string;
	error?: string;
}

export type TProcessType = 'generate' | 'generate_and_upscale' | 'upscale';

export interface TGenerationBase {
	prompt: string;
	negative_prompt?: string;
	model_id: TAvailableModelId;
	scheduler_id: TAvailableSchedulerId;
	width: number;
	height: number;
	seed: number;
	inference_steps: number;
	guidance_scale: number;
	num_outputs: number;
}

export interface TInitialGenerationRequest extends TGenerationBase {
	ui_id: string;
	stream_id: string;
	output_image_extension: 'jpeg' | 'png' | 'webp';
	process_type: TProcessType;
	queued_at: number;
	submit_to_gallery: boolean;
}

export interface TGeneration extends TGenerationBase {
	status: TGenerationStatus;
	error?: string;
	id?: string;
	ui_id: string;
	outputs: TGenerationOutput[];
	started_at?: number;
	queued_at: number;
	submit_to_gallery: boolean;
}

export interface TGenerationOutput {
	id: string;
	image_url: string;
	upscaled_image_url?: string;
	created_at: string;
	updated_at: string;
	generation_id: string;
}

export type TGenerationStatus =
	| 'to-be-submitted'
	| 'server-received'
	| 'server-processing'
	| 'succeeded'
	| 'failed';
