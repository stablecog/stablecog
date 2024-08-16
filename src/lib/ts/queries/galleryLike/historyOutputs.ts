import type { TAvailableGenerationModelId } from '$ts/constants/generationModels';
import type { TAvailableAspectRatio } from '$ts/constants/generationSize';
import { apiUrl } from '$ts/constants/main';
import type {
	TGalleryFullOutputsPage,
	TGalleryFullOutputsPageShallow
} from '$ts/queries/galleryLike/types';
import {
	PER_PAGE_DEFAULT,
	SEARCH_SCORE_THRESHOLD_DEFAULT
} from '$ts/queries/galleryLike/constants';

export async function getHistoryFullOutputs({
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
}): Promise<TGalleryFullOutputsPage> {
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
		query.append('score_threshold', search_score_threshold.toString());
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
	if (!res.ok) {
		throw new Error(`Failed to fetch user outputs: ${res.status}`);
	}
	const data: TGalleryFullOutputsPageShallow = await res.json();
	const editedData: TGalleryFullOutputsPage = {
		...data,
		outputs: data.outputs.map((output) => ({
			...output,
			generation: { ...output.generation, outputs: [] }
		}))
	};
	return editedData;
}
