import { apiBase } from '$ts/constants/main';
import type { TAvailableModelId } from '$ts/constants/models';
import type { TAvailableSchedulerId } from '$ts/constants/schedulers';
import { writable } from 'svelte/store';

export const generations = writable<TGeneration[] | null>(null);

export const queueGeneration = async (generationBase: TGenerationBase) => {
	const generation: TGeneration = {
		...generationBase,
		status: 'queued',
		start_timestamp: Date.now()
	};
	generations.update(($generations) => {
		if ($generations === null) {
			$generations = [generation];
			return $generations;
		}
		$generations = [generation, ...$generations];
		return $generations;
	});
};

export const setGenerationToFailed = (id: string) => {
	generations.update(($generations) => {
		if ($generations === null) {
			return $generations;
		}
		const index = $generations.findIndex((gen) => gen.id === id);
		if (index === -1) {
			return $generations;
		}
		$generations[index].status = 'failed';
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

export async function submitGeneration(request: TGenerationRequest) {
	const { app_version, access_token, ...rest } = request;
	const response = await fetch(`${apiBase}/v1/user/generation/create`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-App-Version': app_version,
			Authorization: 'Bearer ' + access_token
		},
		body: JSON.stringify({
			...rest
		})
	});
	const resJSON: TGenerationInitialResponse = await response.json();
	console.log('Res JSON:', resJSON);
	return resJSON;
}

function getUrl(url: string) {
	const prefix = 's3://';
	const withoutPrefix = url.slice(prefix.length);
	const [bucket, ...path] = withoutPrefix.split('/');
	return `https://b.stablecog.com/${path.join('/')}`;
}

type TProcessType = 'generate' | 'generate_and_upscale' | 'upscale';

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

export interface TGenerationRequest extends TGenerationBase {
	access_token: string;
	app_version: string;
	stream_id: string;
	output_image_extension: 'jpeg' | 'png' | 'webp';
	process_type: TProcessType;
}

export interface TGenerationInitialResponse {
	id: string;
}

export interface TGeneration extends TGenerationBase {
	status: TGenerationStatus;
	id?: string;
	outputs?: TGenerationOutput[];
	start_timestamp?: number;
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
	| 'queued'
	| 'server-received'
	| 'server-processing'
	| 'succeeded'
	| 'failed';
