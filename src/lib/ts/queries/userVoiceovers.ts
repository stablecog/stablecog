import type { TAvailableGenerationModelId } from '$ts/constants/generationModels';
import { apiUrl } from '$ts/constants/main';
import type { TVoiceoverFullOutput } from '$ts/stores/user/voiceovers';

const SEARCH_SCORE_THRESHOLD_DEFAULT = 50;
export const PER_PAGE_DEFAULT = 50;

export async function getUserVoiceoverFullOutputs({
	cursor,
	access_token,
	is_favorited,
	per_page = PER_PAGE_DEFAULT
}: {
	cursor?: string;
	access_token: string;
	is_favorited?: boolean;
	search_score_threshold?: number;
	per_page?: number;
}) {
	console.log('getUserOutputs');
	const query = new URLSearchParams();
	query.append('per_page', per_page.toString());
	if (cursor) {
		query.append('cursor', cursor.toString());
	}
	if (is_favorited !== undefined) {
		query.append('is_favorited', is_favorited.toString());
	}
	const url = `${apiUrl.origin}/v1/user/audio/voiceover/outputs?${query.toString()}`;
	const res = await fetch(url, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + access_token
		}
	});
	if (!res.ok) {
		throw new Error(`Failed to fetch user outputs: ${res.status}`);
	}
	const data: TUserVoiceoverFullOutputsPage = await res.json();
	return data;
}

export async function getAllUserGenerationFullOutputs({
	cursor,
	access_token,
	gallery_status,
	order_by,
	search,
	model_ids,
	per_page = PER_PAGE_DEFAULT,
	search_score_threshold = SEARCH_SCORE_THRESHOLD_DEFAULT
}: {
	cursor?: string;
	gallery_status?: string;
	access_token: string;
	order_by?: string;
	search?: string;
	model_ids?: TAvailableGenerationModelId[];
	per_page?: number;
	search_score_threshold?: number;
}) {
	console.log('getAllUserOutputs');
	const query = new URLSearchParams();
	query.append('per_page', per_page.toString());
	if (cursor) {
		query.append('cursor', cursor);
	}
	if (gallery_status === 'manually_submitted') {
		query.append('was_auto_submitted', 'false');
		query.append('gallery_status', 'submitted');
	} else if (gallery_status) {
		query.append('gallery_status', gallery_status);
	}
	if (search && search !== '') {
		query.append('search', search);
		query.append('score_threshold', search_score_threshold.toString());
	}
	if (model_ids && model_ids.length > 0) {
		query.append('model_ids', model_ids.join(','));
	}
	if (order_by) {
		query.append('order_by', order_by);
	}
	const url = `${apiUrl.origin}/v1/admin/outputs?${query.toString()}`;
	const res = await fetch(url, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + access_token
		}
	});
	if (!res.ok) {
		throw new Error(`Failed to fetch user outputs: ${res.status}`);
	}
	const data: TUserVoiceoverFullOutputsPage = await res.json();
	if (data.error) throw new Error(data.error);
	return data;
}

export interface TUserVoiceoverFullOutputsPage {
	outputs: TVoiceoverFullOutput[];
	total_count?: number;
	next?: string | number;
	error?: string;
}
