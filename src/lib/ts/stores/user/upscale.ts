import {
	newUpscaleCompleteAnimation,
	newUpscaleStartAnimation
} from '$ts/animation/generationAnimation';
import { apiUrl } from '$ts/constants/main';
import type { TAvailableUpscaleModelId } from '$ts/constants/upscaleModels';
import { estimatedUpscaleDurationMs } from '$ts/stores/cost';
import { userSummary } from '$ts/stores/user/summary';
import type { Tweened } from 'svelte/motion';
import { derived, get, writable } from 'svelte/store';
import { isSuperAdmin } from '$ts/helpers/admin/roles';
import { convertToDBTimeString } from '$ts/helpers/convertToDBTimeString';
import { addToRecentlyUpdatedOutputIds } from '$ts/stores/user/recentlyUpdatedOutputIds';
import {
	STRIPE_PRODUCT_ID_OBJECTS_SUBSCRIPTIONS_MO,
	roleToProductId
} from '$ts/constants/stripePublic';

export const upscales = writable<TUpscale[]>([]);

export const setUpscaleToFailed = ({ id, error }: { id: string; error?: string }) => {
	upscales.update(($upscales) => {
		if ($upscales === null) {
			return $upscales;
		}
		const foundUpscale = $upscales.find((ups) => ups.id === id);
		if (foundUpscale) {
			foundUpscale.status = 'failed';
			foundUpscale.error = error;
			foundUpscale.animation = newUpscaleCompleteAnimation(foundUpscale.animation);
			return $upscales;
		}
		const foundUpscale2 = $upscales.find((ups) => ups.ui_id === id);
		if (foundUpscale2) {
			foundUpscale2.status = 'failed';
			foundUpscale2.error = error;
			foundUpscale2.animation = newUpscaleCompleteAnimation(foundUpscale2.animation);
			return $upscales;
		}
		return $upscales;
	});
};

export const setUpscaleToSucceeded = async ({
	id,
	outputs
}: {
	id: string;
	outputs: TUpscaleOutput[];
}) => {
	const ups = get(upscales);
	if (ups === null) return;
	const foundUpscale = ups.find((u) => u.id === id);
	if (!foundUpscale) {
		return;
	}
	foundUpscale.status = 'succeeded';
	foundUpscale.outputs = outputs;
	if (outputs && outputs.length > 0 && outputs[0].image_url) {
		try {
			await loadImage(outputs[0].image_url);
		} catch (e) {
			console.error(e);
		}
	}
	addToRecentlyUpdatedOutputIds(foundUpscale.input);
	foundUpscale.completed_at = convertToDBTimeString(Date.now());
	const started_at = foundUpscale.started_at;
	const completed_at = foundUpscale.completed_at;
	if (started_at && completed_at) {
		estimatedUpscaleDurationMs.set(
			new Date(completed_at).getTime() - new Date(started_at).getTime()
		);
	}
	upscales.set(ups);
};

async function loadImage(url: string) {
	return new Promise<HTMLImageElement>((resolve, reject) => {
		const img = new Image();
		img.onload = () => resolve(img);
		img.onerror = () => reject(img);
		img.src = url;
	});
}

export const setUpscaleToServerReceived = ({ ui_id, id }: { ui_id: string; id: string }) => {
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

export const setUpscaleToServerProcessing = ({ ui_id, id }: { ui_id: string; id: string }) => {
	upscales.update(($upscales) => {
		if ($upscales === null) {
			return $upscales;
		}
		const ups = $upscales.find((ups) => ups.id === id);
		if (ups && ups.status !== 'succeeded' && ups.status !== 'failed') {
			ups.status = 'server-processing';
			ups.started_at = convertToDBTimeString(Date.now());
			if (!ups.ui_id) ups.ui_id = ui_id;
			ups.animation = newUpscaleCompleteAnimation(ups.animation);
			return $upscales;
		}
		const ups2 = $upscales.find((ups) => ups.ui_id === ui_id);
		if (ups2 && ups2.status !== 'succeeded' && ups2.status !== 'failed') {
			ups2.status = 'server-processing';
			ups2.started_at = convertToDBTimeString(Date.now());
			if (!ups2.id) ups2.id = id;
			ups2.animation = newUpscaleCompleteAnimation(ups2.animation);
			return $upscales;
		}
		return $upscales;
	});
};

export async function queueInitialUpscaleRequest(request: TInitialUpscaleRequest) {
	upscales.update(($upscales) => {
		const upscaleToSubmit: TUpscale = {
			...request,
			outputs: [],
			created_at: convertToDBTimeString(Date.now()),
			status: 'to-be-submitted',
			animation: newUpscaleStartAnimation()
		};
		if ($upscales === null) {
			return [upscaleToSubmit];
		}
		$upscales.unshift(upscaleToSubmit);
		return $upscales;
	});
}

export async function submitInitialUpscaleRequest({
	request,
	access_token,
	app_version
}: {
	request: TInitialUpscaleRequest;
	access_token: string;
	app_version: string;
}) {
	const response = await fetch(`${apiUrl.origin}/v1/user/upscale`, {
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

const baseCount = 1;

const productIdToMaxOngoingUpscalesCount = ({
	productId,
	roles
}: {
	productId: string | undefined;
	roles: string[] | undefined;
}) => {
	if (!productId) {
		if (!roles) return baseCount;
		for (let i = 0; i < roles.length; i++) {
			const pId = roleToProductId[roles[i]];
			if (!pId) continue;
			const count = STRIPE_PRODUCT_ID_OBJECTS_SUBSCRIPTIONS_MO[pId]?.parallel_upscales;
			if (count) return count;
		}
		return baseCount;
	}
	const count = STRIPE_PRODUCT_ID_OBJECTS_SUBSCRIPTIONS_MO[productId]?.parallel_upscales;
	if (!count) return baseCount;
	return count;
};

export const maxOngoingUpscalesCount = derived(userSummary, ($userSummary) => {
	const active_product_id = $userSummary?.product_id;
	const roles = $userSummary?.roles;
	return productIdToMaxOngoingUpscalesCount({ productId: active_product_id, roles });
});

export const ongoingUpscalesCount = derived(upscales, ($upscales) => {
	return $upscales.filter((g) => g.status !== 'succeeded' && g.status !== 'failed').length;
});

export const maxOngoingUpscalesCountReached = derived(
	[ongoingUpscalesCount, maxOngoingUpscalesCount, userSummary],
	([ongoingUpscalesCount, $maxOngoingUpscalesCount, $userSummary]) => {
		return isSuperAdmin($userSummary?.roles)
			? false
			: ongoingUpscalesCount >= $maxOngoingUpscalesCount;
	}
);

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
	started_at?: string;
	created_at: string;
	completed_at?: string;
	animation?: Tweened<number>;
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
