import type { TAvailableGenerationModelId } from '$ts/constants/generationModels';
import type { TAvailableAspectRatio } from '$ts/constants/generationSize';
import { apiUrl } from '$ts/constants/main';
import type { TGalleryStatus, TGenerationFullOutput } from '$userStores/generation';

const SEARCH_SCORE_THRESHOLD_DEFAULT = 50;
export const PER_PAGE_DEFAULT = 50;

export async function getUserGenerationFullOutputs({
	cursor,
	access_token,
	is_favorited,
	is_liked,
	search,
	model_ids,
	aspect_ratios,
	search_score_threshold = SEARCH_SCORE_THRESHOLD_DEFAULT,
	per_page = PER_PAGE_DEFAULT
}: {
	cursor?: string;
	access_token: string;
	is_favorited?: boolean;
	is_liked?: boolean;
	search?: string;
	model_ids?: TAvailableGenerationModelId[];
	aspect_ratios?: TAvailableAspectRatio[];
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
	if (is_liked !== undefined) {
		query.append('is_liked', is_liked.toString());
	}
	if (search && search !== '') {
		query.append('search', search);
		query.append('search_score_threshold', search_score_threshold.toString());
	}
	if (model_ids && model_ids.length > 0) {
		query.append('model_ids', model_ids.join(','));
	}
	if (aspect_ratios && aspect_ratios.length > 0) {
		query.append(
			'aspect_ratio',
			aspect_ratios.map((i) => i.replaceAll('.', '_').replaceAll(':', '-')).join(',')
		);
	}
	const url = `${apiUrl.origin}/v1/user/outputs?${query.toString()}`;
	const res = await fetch(url, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: 'Bearer ' + access_token
		}
	});
	const data: TUserGenerationFullOutputsPage = await res.json();
	return data;
}

export async function getAllUserGenerationFullOutputs({
	cursor,
	access_token,
	gallery_status,
	order_by,
	search,
	model_ids,
	aspect_ratios
}: {
	cursor?: string;
	gallery_status?: TGalleryStatus;
	access_token: string;
	order_by?: string;
	search?: string;
	model_ids?: TAvailableGenerationModelId[];
	aspect_ratios?: TAvailableAspectRatio[];
}) {
	console.log('getAllUserOutputs');
	const query = new URLSearchParams();
	query.append('per_page', PER_PAGE_DEFAULT.toString());
	if (cursor) {
		query.append('cursor', cursor);
	}
	if (gallery_status === 'manually_submitted') {
		query.append('gallery_status', 'submitted');
		query.append('was_auto_submitted', 'false');
	} else if (gallery_status === 'submitted_best') {
		query.append('gallery_status', 'submitted');
		query.append('aesthetic_rating_score_gte', '0.5');
		query.append('aesthetic_artifact_score_lte', '0.5');
	} else if (gallery_status) {
		query.append('gallery_status', gallery_status);
	}
	if (search && search !== '') {
		query.append('search', search);
		query.append('search_score_threshold', SEARCH_SCORE_THRESHOLD_DEFAULT.toString());
	}
	if (model_ids && model_ids.length > 0) {
		query.append('model_ids', model_ids.join(','));
	}
	if (aspect_ratios && aspect_ratios.length > 0) {
		query.append(
			'aspect_ratio',
			aspect_ratios.map((i) => i.replaceAll('.', '_').replaceAll(':', '-')).join(',')
		);
	}
	if (order_by) {
		query.append('order_by', order_by);
	}
	const url = `${apiUrl.origin}/v1/admin/outputs?${query.toString()}`;
	const res = await fetch(url, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${access_token}`
		}
	});
	const data: TUserGenerationFullOutputsPage = await res.json();
	if (data.error) throw new Error(data.error);
	return data;
}

export interface TUserGenerationFullOutputsPage {
	outputs: TGenerationFullOutput[];
	total_count?: number;
	next?: string | number;
	error?: string;
}
