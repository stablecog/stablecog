import type { TAvailableGenerationModelId } from '$ts/constants/generationModels';
import { apiUrl } from '$ts/constants/main';
import type { TGenerationFullOutput } from '$userStores/generation';

export const generationsPerPage = 50;
const score_threshold = 50;

export async function getUserGenerationFullOutputs({
	cursor,
	access_token,
	is_favorited,
	is_liked,
	search,
	model_ids
}: {
	cursor?: string;
	access_token: string;
	is_favorited?: boolean;
	is_liked?: boolean;
	search?: string;
	model_ids?: TAvailableGenerationModelId[];
}) {
	console.log('getUserOutputs');
	const query = new URLSearchParams();
	query.append('per_page', generationsPerPage.toString());
	if (cursor) {
		if ((search && typeof cursor === 'number') || (!search && typeof cursor === 'string')) {
			query.append('cursor', cursor.toString());
		}
	}
	if (is_favorited !== undefined) {
		query.append('is_favorited', is_favorited.toString());
	}
	if (is_liked !== undefined) {
		query.append('is_liked', is_liked.toString());
	}
	if (search && search !== '') {
		query.append('search', search);
		query.append('score_threshold', score_threshold.toString());
	}
	if (model_ids && model_ids.length > 0) {
		query.append('model_ids', model_ids.join(','));
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
	model_ids
}: {
	cursor?: string;
	gallery_status?: string;
	access_token: string;
	order_by?: string;
	search?: string;
	model_ids?: TAvailableGenerationModelId[];
}) {
	console.log('getAllUserOutputs');
	const query = new URLSearchParams();
	query.append('per_page', generationsPerPage.toString());
	if (cursor) {
		query.append('cursor', cursor);
	}
	if (gallery_status) {
		if (gallery_status === 'manually_submitted') {
			query.append('was_auto_submitted', 'false');
			query.append('gallery_status', 'submitted');
		} else {
			query.append('gallery_status', gallery_status);
		}
	}
	if (search && search !== '') {
		query.append('search', search);
		query.append('score_threshold', score_threshold.toString());
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
			Authorization: `Bearer ${access_token}`
		}
	});
	const data: TUserGenerationFullOutputsPage = await res.json();
	if (data.error) throw new Error(data.error);
	console.log(data);
	return data;
}

export interface TUserGenerationFullOutputsPage {
	outputs: TGenerationFullOutput[];
	total_count?: number;
	next?: string | number;
	error?: string;
}
