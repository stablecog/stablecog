import { apiUrl } from '$ts/constants/main';
import { get, writable } from 'svelte/store';
import { generateSSEId } from '$ts/helpers/generateSSEId';
import {
	newGenerationCompleteAnimation,
	newGenerationStartAnimation
} from '$ts/animation/generationAnimation';
import type { Tweened } from 'svelte/motion';
import { isSuperAdmin } from '$ts/helpers/admin/roles';
import { userSummary } from '$ts/stores/user/summary';
import { derived } from 'svelte/store';
import { convertToDBTimeString } from '$ts/helpers/convertToDBTimeString';
import {
	STRIPE_PRODUCT_ID_OBJECTS_SUBSCRIPTIONS_MO,
	roleToProductId
} from '$ts/constants/stripePublic';
import type { TVoiceoverSpeakerId, TVoiceoverModelId } from '$ts/constants/voiceover/models';
import type { TVoiceoverLocale } from '$ts/constants/voiceover/locales';

export const voiceovers = writable<TVoiceover[]>([]);

export const setVoiceoverToFailed = ({ id, error }: { id: string; error?: string }) => {
	voiceovers.update(($voiceovers) => {
		if ($voiceovers === null || $voiceovers.length === 0) {
			return $voiceovers;
		}
		const voiceoverById = $voiceovers.find((g) => g.id === id);
		if (voiceoverById) {
			voiceoverById.status = 'failed';
			voiceoverById.outputs = voiceoverById.outputs.map((o) => ({
				...o,
				status: 'failed'
			}));
			voiceoverById.error = error;
			return $voiceovers;
		}
		const voiceoverByUiId = $voiceovers.find((g) => g.ui_id === id);
		if (voiceoverByUiId) {
			voiceoverByUiId.status = 'failed';
			voiceoverByUiId.outputs = voiceoverByUiId.outputs.map((o) => ({
				...o,
				status: 'failed'
			}));
			voiceoverByUiId.error = error;
			return $voiceovers;
		}
		return $voiceovers;
	});
};

export const setVoiceoverToSucceeded = ({
	id,
	outputs
}: {
	id: string;
	outputs: TVoiceoverOutput[];
}) => {
	const vois = get(voiceovers);
	if (vois === null || vois.length === 0) {
		return vois;
	}
	const voi = vois.find((g) => g.id === id);
	if (!voi) {
		return vois;
	}
	voi.status = 'succeeded';
	voi.outputs = outputs.map((o, i) => ({
		...o,
		status: 'succeeded' as TVoiceoverOutputStatus,
		ui_id: voi.outputs?.[i]?.ui_id || generateSSEId()
	}));
	voi.completed_at = convertToDBTimeString(Date.now());
	voiceovers.set(vois);
};

export const setVoiceoverToServerReceived = ({ ui_id, id }: { ui_id: string; id: string }) => {
	voiceovers.update(($voiceovers) => {
		if ($voiceovers === null || $voiceovers.length === 0) {
			return $voiceovers;
		}
		const voi = $voiceovers.find((g) => g.ui_id === ui_id);
		if (!voi) return $voiceovers;
		if (
			voi.status === 'server-processing' ||
			voi.status === 'succeeded' ||
			voi.status === 'failed'
		) {
			return $voiceovers;
		}
		voi.id = id;
		voi.status = 'server-received';
		voi.outputs = voi.outputs.map((o) => ({
			...o,
			status: 'server-received',
			ui_id: o.ui_id || generateSSEId()
		}));
		return $voiceovers;
	});
};

export const setVoiceoverToServerProcessing = ({ ui_id, id }: { ui_id: string; id: string }) => {
	voiceovers.update(($voiceovers) => {
		if ($voiceovers === null || $voiceovers.length === 0) {
			return $voiceovers;
		}
		const voi = $voiceovers.find((g) => g.id === id);
		if (voi && voi.status !== 'succeeded' && voi.status !== 'failed') {
			voi.status = 'server-processing';
			voi.outputs = voi.outputs.map((o) => ({
				...o,
				status: 'server-processing',
				ui_id: o.ui_id || generateSSEId()
			}));
			voi.outputs.forEach((o) => {
				o.animation = newGenerationCompleteAnimation(o.animation);
			});
			voi.started_at = convertToDBTimeString(Date.now());
			if (!voi.ui_id) voi.ui_id = ui_id;
			return $voiceovers;
		}
		const voi2 = $voiceovers.find((g) => g.ui_id === ui_id);
		if (voi2 && voi2.status !== 'succeeded' && voi2.status !== 'failed') {
			voi2.status = 'server-processing';
			voi2.outputs = voi2.outputs.map((o) => ({ ...o, status: 'server-processing' }));
			voi2.outputs.forEach((o) => {
				o.animation = newGenerationCompleteAnimation(o.animation);
				o.ui_id = o.ui_id || generateSSEId();
			});
			voi2.started_at = convertToDBTimeString(Date.now());
			if (!voi2.id) voi2.id = id;
			return $voiceovers;
		}
		return $voiceovers;
	});
};

export async function queueInitialVoiceoverRequest(request: TInitialVoiceoverRequest) {
	voiceovers.update(($voiceovers) => {
		const voiceoverToSubmit: TVoiceover = {
			...request,
			status: 'to-be-submitted',
			created_at: convertToDBTimeString(Date.now()),
			outputs: [...Array(request.num_outputs)].map(() => ({
				id: generateSSEId(),
				ui_id: generateSSEId(),
				audio_file_url: '',
				audio_duration: 0,
				status: 'to-be-submitted',
				animation: newGenerationStartAnimation()
			}))
		};
		if ($voiceovers === null || $voiceovers.length === 0) {
			return [voiceoverToSubmit];
		}
		if ($voiceovers[0].status === 'pre-submit') {
			$voiceovers[0] = { ...voiceoverToSubmit };
			return $voiceovers;
		}
		$voiceovers.unshift(voiceoverToSubmit);
		return $voiceovers;
	});
}

export async function submitInitialVoiceoverRequest(
	request: TInitialVoiceoverRequest,
	access_token: string,
	app_version: string
) {
	const promptText = request.prompt.text;
	const { prompt, speaker, ...rest } = request;
	const finalRequest = {
		...rest,
		prompt: promptText,
		speaker_id: speaker.id
	};
	const response = await fetch(`${apiUrl.origin}/v1/user/audio/voiceover/create`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			'X-App-Version': app_version,
			Authorization: `Bearer ${access_token}`
		},
		body: JSON.stringify(finalRequest)
	});
	if (!response.ok) {
		throw new Error(`Failed to submit voiceover request: ${response.status}`);
	}
	const resJSON: TInitialVoiceoverResponse = await response.json();
	console.log('Voiceover request response:', resJSON);
	return { ...resJSON, ui_id: request.ui_id };
}

export const setVoiceoverOutputToDeleted = (output_id: string) => {
	voiceovers.update(($voiceovers) => {
		if ($voiceovers === null || $voiceovers.length === 0) {
			return $voiceovers;
		}
		for (let i = 0; i < $voiceovers.length; i++) {
			const voi = $voiceovers[i];
			for (let j = 0; j < voi.outputs.length; j++) {
				const output = voi.outputs[j];
				if (output.id === output_id) {
					voi.outputs[j].is_deleted = true;
					return $voiceovers;
				}
			}
		}
		return $voiceovers;
	});
};

export const setVoiceoverOutputToFavorited = (output_id: string) => {
	voiceovers.update(($voiceovers) => {
		if ($voiceovers === null || $voiceovers.length === 0) {
			return $voiceovers;
		}
		for (let i = 0; i < $voiceovers.length; i++) {
			const voi = $voiceovers[i];
			for (let j = 0; j < voi.outputs.length; j++) {
				const output = voi.outputs[j];
				if (output.id === output_id) {
					voi.outputs[j].is_favorited = true;
					return $voiceovers;
				}
			}
		}
		return $voiceovers;
	});
};

export const setVoiceoverOutputToSubmitted = (output_id: string) => {
	voiceovers.update(($voiceovers) => {
		if ($voiceovers === null || $voiceovers.length === 0) {
			return $voiceovers;
		}
		for (let i = 0; i < $voiceovers.length; i++) {
			const voi = $voiceovers[i];
			for (let j = 0; j < voi.outputs.length; j++) {
				const output = voi.outputs[j];
				if (output.id === output_id) {
					voi.outputs[j].gallery_status = 'submitted';
					return $voiceovers;
				}
			}
		}
		return $voiceovers;
	});
};

export const getOutputOnStageStatuses = (voi: TVoiceover, output_ids: string[]) => {
	let statuses = output_ids.map((id) => false);
	for (let i = 0; i < voi.outputs.length; i++) {
		const output = voi.outputs[i];
		if (output_ids.includes(output.id)) {
			statuses[output_ids.indexOf(output.id)] = true;
		}
	}
	return statuses;
};

const baseCount = 1;

const productIdToMaxOngoingVoiceoversCount = ({
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
			const count = STRIPE_PRODUCT_ID_OBJECTS_SUBSCRIPTIONS_MO[pId]?.parallel_voiceovers;
			if (count) return count;
		}
		return baseCount;
	}
	const count = STRIPE_PRODUCT_ID_OBJECTS_SUBSCRIPTIONS_MO[productId]?.parallel_voiceovers;
	if (!count) return baseCount;
	return count;
};

export const maxOngoingVoiceoversCount = derived(userSummary, ($userSummary) => {
	const active_product_id = $userSummary?.product_id;
	const roles = $userSummary?.roles;
	return productIdToMaxOngoingVoiceoversCount({
		productId: active_product_id,
		roles: roles
	});
});

export const ongoingVoiceoversCount = derived(voiceovers, ($voiceovers) => {
	return $voiceovers.filter(
		(g) => g.status !== 'succeeded' && g.status !== 'failed' && g.status !== 'pre-submit'
	).length;
});

export const maxOngoingVoiceoversCountReached = derived(
	[ongoingVoiceoversCount, maxOngoingVoiceoversCount, userSummary],
	([ongoingVoiceoversCount, $maxOngoingVoiceoversCount, $userSummary]) => {
		return isSuperAdmin($userSummary?.roles)
			? false
			: ongoingVoiceoversCount >= $maxOngoingVoiceoversCount;
	}
);

export interface TInitialVoiceoverResponse {
	id?: string;
	error?: string;
	total_remaining_credits?: number;
}

export interface TVoiceoverBase {
	prompt: {
		id: string;
		text: string;
	};
	model_id: TVoiceoverModelId;
	speaker: {
		id: TVoiceoverSpeakerId;
		locale: TVoiceoverLocale;
	};
	temperature: number;
	seed: number;
	num_outputs: number;
	denoise_audio?: boolean;
	remove_silence?: boolean;
}

export interface TVoiceover extends TVoiceoverBase {
	status: TVoiceoverStatus;
	error?: string;
	id?: string;
	ui_id: string;
	outputs: TVoiceoverOutput[];
	started_at?: string;
	created_at: string;
	completed_at?: string;
	submit_to_gallery: boolean;
	is_placeholder?: boolean;
}

export interface TVoiceoverOutput {
	id: string;
	ui_id?: string;
	audio_file_url: string;
	video_file_url?: string;
	audio_duration: number;
	audio_buffer?: AudioBuffer;
	created_at?: string;
	updated_at?: string;
	is_deleted?: boolean;
	is_favorited?: boolean;
	gallery_status?: TGalleryStatus;
	status?: TVoiceoverOutputStatus;
	animation?: Tweened<number>;
}

export type TGalleryStatus =
	| 'submitted'
	| 'approved'
	| 'rejected'
	| 'not_submitted'
	| 'manually_submitted';

export type TVoiceoverOutputStatus =
	| 'to-be-submitted'
	| 'server-received'
	| 'server-processing'
	| 'succeeded'
	| 'failed';

export interface TVoiceoverFullOutput extends TVoiceoverOutput {
	voiceover: TVoiceover;
}

export interface TVoiceoverWithSelectedOutput extends TVoiceover {
	selected_output: TVoiceoverOutput;
}

export interface TInitialVoiceoverRequest extends TVoiceoverBase {
	ui_id: string;
	stream_id: string;
	submit_to_gallery: boolean;
}

export type TVoiceoverStatus =
	| 'pre-submit'
	| 'to-be-submitted'
	| 'server-received'
	| 'server-processing'
	| 'succeeded'
	| 'failed';
