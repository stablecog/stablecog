import type { TAvailableGenerationModelId } from '$ts/constants/generationModels';
import type { TAvailableAspectRatio } from '$ts/constants/generationSize';
import { apiUrl } from '$ts/constants/main';
import type {
	TUserProfileFullOutputsPage,
	TUserProfileFullOutputsPageShallow
} from '$ts/queries/galleryLike/types';
import {
	PER_PAGE_DEFAULT,
	SEARCH_SCORE_THRESHOLD_DEFAULT
} from '$ts/queries/galleryLike/constants';

export async function getUserProfileFullOutputs({
	cursor,
	search,
	model_ids,
	aspect_ratios,
	custom_fetch,
	per_page = PER_PAGE_DEFAULT,
	search_score_threshold = SEARCH_SCORE_THRESHOLD_DEFAULT,
	prompt_id,
	username,
	access_token
}: {
	cursor?: string;
	search?: string | null;
	seed?: number;
	model_ids?: TAvailableGenerationModelId[];
	aspect_ratios?: TAvailableAspectRatio[];
	custom_fetch?: typeof fetch;
	per_page?: number;
	search_score_threshold?: number;
	prompt_id?: string;
	username: string;
	access_token?: string;
}): Promise<TUserProfileFullOutputsPage> {
	console.log('getUserProfileFullOutputs');
	const query = new URLSearchParams();

	if (cursor) {
		query.append('cursor', cursor);
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
	query.append('per_page', per_page.toString());
	if (prompt_id) {
		query.append('prompt_id', prompt_id);
	}
	let queryString = query.toString();
	if (queryString) queryString = `?${queryString}`;
	const url = `${apiUrl.origin}/v1/profile/${username}/outputs${queryString}`;
	const f = custom_fetch || fetch;
	let headers: Record<string, string> = {
		'Content-Type': 'application/json'
	};
	if (access_token) {
		headers = {
			...headers,
			Authorization: `Bearer ${access_token}`
		};
	}
	const res = await f(url, {
		headers
	});
	if (!res.ok)
		throw new Error(
			`Failed to user user generation full outputs: ${res.status}, ${res.statusText}`
		);
	const data: TUserProfileFullOutputsPageShallow = await res.json();
	const editedData: TUserProfileFullOutputsPage = {
		...data,
		outputs: data.outputs.map((output) => ({
			...output,
			generation: { ...output.generation, outputs: [] }
		}))
	};
	return editedData;
}
