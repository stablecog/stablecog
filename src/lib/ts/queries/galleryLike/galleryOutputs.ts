import { mainSortViewDefault } from '$routes/(app)/gallery/constants';
import type { TAvailableGenerationModelId } from '$ts/constants/generationModels';
import { apiUrl } from '$ts/constants/main';
import type {
	TGalleryFullOutputsPage,
	TGalleryFullOutputsPageShallow
} from '$ts/queries/galleryLike/types';
import {
	OVERSAMPLING_DEFAULT,
	PER_PAGE_DEFAULT,
	SEARCH_SCORE_THRESHOLD_DEFAULT
} from '$ts/queries/galleryLike/constants';

export async function getGalleryFullOutputs({
	cursor,
	search,
	seed,
	model_ids,
	aspect_ratios,
	sorts,
	username_filters,
	custom_fetch,
	per_page = PER_PAGE_DEFAULT,
	search_score_threshold = SEARCH_SCORE_THRESHOLD_DEFAULT,
	oversampling = OVERSAMPLING_DEFAULT,
	prompt_id,
	accessToken
}: {
	cursor?: string;
	search?: string | null;
	seed?: number;
	model_ids?: TAvailableGenerationModelId[];
	aspect_ratios?: string[];
	sorts?: string[];
	username_filters?: string[];
	custom_fetch?: typeof fetch;
	per_page?: number;
	search_score_threshold?: number;
	oversampling?: number;
	prompt_id?: string;
	accessToken?: string;
}): Promise<TGalleryFullOutputsPage> {
	console.log('getGalleryOutputs');
	const query = new URLSearchParams();
	let shouldAddSeed = true;
	query.append('per_page', per_page.toString());
	query.append('oversampling', oversampling.toString());

	if (cursor) {
		query.append('cursor', cursor);
	}
	if (search && search !== '') {
		query.append('search', search);
		query.append('score_threshold', search_score_threshold.toString());
		shouldAddSeed = false;
	}
	if (model_ids && model_ids.length > 0) {
		query.append('model_ids', model_ids.join(','));
		shouldAddSeed = false;
	}
	if (sorts && sorts.length > 0) {
		query.append('sort', sorts.join(','));
		if (sorts.join(',') !== mainSortViewDefault) {
			shouldAddSeed = false;
		}
	}
	if (prompt_id) {
		query.append('prompt_id', prompt_id);
	}
	if (username_filters && username_filters.length > 0) {
		query.append('username', username_filters.join(','));
		shouldAddSeed = false;
	}
	if (aspect_ratios && aspect_ratios.length > 0) {
		query.append(
			'aspect_ratio',
			aspect_ratios.map((i) => i.replaceAll('.', '_').replaceAll(':', '-')).join(',')
		);
		shouldAddSeed = false;
	}
	if (typeof seed === 'number' && shouldAddSeed) {
		query.append('seed', seed.toString());
	}
	let queryString = query.toString();
	if (queryString) queryString = `?${queryString}`;
	const url = `${apiUrl.origin}/v1/gallery${queryString}`;
	const f = custom_fetch || fetch;
	let headers: Record<string, string> = {
		'Content-Type': 'application/json'
	};
	if (accessToken) {
		headers = {
			...headers,
			Authorization: `Bearer ${accessToken}`
		};
	}
	const res = await f(url, {
		headers
	});
	if (!res.ok) throw new Error(`Failed to fetch gallery outputs: ${res.status}, ${res.statusText}`);
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
