import { apiUrl } from '$ts/constants/main';
import type { TAvailableUpscaleModelId } from '$ts/constants/upscaleModels';
import { estimatedUpscaleDurationMs, getUpscaleDurationMsFromUpscale } from '$ts/stores/cost';
import { writable } from 'svelte/store';

export const upscales = writable<TUpscale[]>([]);

export const setUpscaleToFailed = (id: string, error?: string) => {
	upscales.update(($upscales) => {
		if ($upscales === null) {
			return $upscales;
		}
		const index = $upscales.findIndex((ups) => ups.id === id);
		if (index >= 0) {
			$upscales[index].status = 'failed';
			$upscales[index].error = error;
			$upscales[index].completed_at = Date.now();
			return $upscales;
		}
		const ui_index = $upscales.findIndex((ups) => ups.ui_id === id);
		if (ui_index >= 0) {
			$upscales[ui_index].status = 'failed';
			$upscales[ui_index].error = error;
			$upscales[index].completed_at = Date.now();
			return $upscales;
		}
		return $upscales;
	});
};

export const setUpscaleToSucceeded = (id: string, outputs: TUpscaleOutput[]) => {
	upscales.update(($upscales) => {
		if ($upscales === null) {
			return $upscales;
		}
		const index = $upscales.findIndex((gen) => gen.id === id);
		if (index === -1) {
			return $upscales;
		}
		$upscales[index].status = 'succeeded';
		$upscales[index].outputs = outputs;
		$upscales[index].completed_at = Date.now();
		const durationMs = getUpscaleDurationMsFromUpscale($upscales[index]);
		if (durationMs !== null) {
			estimatedUpscaleDurationMs.set(durationMs);
		}
		return $upscales;
	});
};

export const setUpscaleToServerReceived = (ui_id: string, id: string) => {
	upscales.update(($upscales) => {
		if ($upscales === null) {
			return $upscales;
		}
		const ups = $upscales.find((ups) => ups.ui_id === ui_id);
		if (!ups) return $upscales;
		if (
			ups.status === 'server-processing' ||
			ups.status === 'succeeded' ||
			ups.status === 'failed'
		) {
			return $upscales;
		}
		ups.id = id;
		ups.status = 'server-received';
		return $upscales;
	});
};

export const setUpscaleToServerProcessing = (ui_id: string, id: string) => {
	upscales.update(($upscales) => {
		if ($upscales === null) {
			return $upscales;
		}
		const ups = $upscales.find((ups) => ups.id === id);
		if (ups && ups.status !== 'succeeded' && ups.status !== 'failed') {
			ups.status = 'server-processing';
			ups.started_at = Date.now();
			if (!ups.ui_id) ups.ui_id = ui_id;
			return $upscales;
		}
		const ups2 = $upscales.find((ups) => ups.ui_id === ui_id);
		if (ups2 && ups2.status !== 'succeeded' && ups2.status !== 'failed') {
			ups2.status = 'server-processing';
			ups2.started_at = Date.now();
			if (!ups2.id) ups2.id = id;
			return $upscales;
		}
		return $upscales;
	});
};

export async function queueInitialUpscaleRequest(request: TInitialUpscaleRequest) {
	upscales.update(($upscales) => {
		const upscalesToSubmit: TUpscale = {
			...request,
			outputs: [],
			created_at: Date.now(),
			status: 'to-be-submitted'
		};
		if ($upscales === null) {
			return [upscalesToSubmit];
		}
		$upscales = [upscalesToSubmit, ...$upscales];
		return $upscales;
	});
}

export async function submitInitialUpscaleRequest(
	request: TInitialUpscaleRequest,
	access_token: string,
	app_version: string
) {
	const response = await fetch(`${apiUrl.href}v1/user/upscale`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-App-Version': app_version,
			Authorization: `Bearer ${access_token}`
		},
		body: JSON.stringify(request)
	});
	const resJSON: TInitialUpscaleResponse = await response.json();
	console.log('Upscale request response:', resJSON);
	return { ...resJSON, ui_id: request.ui_id };
}

export interface TInitialUpscaleResponse {
	id?: string;
	error?: string;
	total_remaining_credits?: number;
}

export interface TUpscaleBase {
	input: string;
	type: TUpscaleType;
	model_id: TAvailableUpscaleModelId;
}

export interface TUpscale extends TUpscaleBase {
	status: TUpscaleStatus;
	error?: string;
	id?: string;
	ui_id: string;
	outputs: TUpscaleOutput[];
	started_at?: number;
	created_at: number;
	completed_at?: number;
}

export interface TInitialUpscaleRequest extends TUpscaleBase {
	ui_id: string;
	stream_id: string;
}

export interface TUpscaleOutput {
	id: string;
	image_url: string;
	input_image_url: string;
	output_id?: string;
}

export type TUpscaleStatus =
	| 'to-be-submitted'
	| 'server-received'
	| 'server-processing'
	| 'succeeded'
	| 'failed';

export type TUpscaleType = 'from_output' | 'from_image';
