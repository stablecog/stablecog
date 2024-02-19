import { mainSortViewDefault } from '$routes/(app)/gallery/constants';
import type { TAvailableGenerationModelId } from '$ts/constants/generationModels';
import { apiUrl } from '$ts/constants/main';
import type { TAvailableSchedulerId } from '$ts/constants/schedulers';
import { convertToDBTimeString } from '$ts/helpers/convertToDBTimeString';
import type {
	TUserProfileFullOutputsPage,
	TUserProfileGenerationFullOutputPageRes
} from '$ts/queries/galleryLike/types';
import type { TGenerationFullOutput, TGenerationOutput } from '$userStores/generation';

const SEARCH_SCORE_THRESHOLD_DEFAULT = 50;
const PER_PAGE_DEFAULT = 50;
const OVERSAMPLING_DEFAULT = 8;

export async function getGalleryGenerationFullOutputs({
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
}): Promise<TUserProfileFullOutputsPage> {
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
	const data: TUserProfileGenerationFullOutputPageRes = await res.json();
	const { hits, next, metadata } = data;
	const outputs: TGenerationFullOutput[] = hits.map((hit) => {
		const output: TGenerationOutput = {
			id: hit.id,
			image_url: hit.image_url,
			upscaled_image_url: hit.upscaled_image_url,
			created_at: hit.created_at,
			updated_at: hit.updated_at,
			was_auto_submitted: hit.was_auto_submitted,
			is_public: hit.is_public,
			like_count: hit.like_count,
			is_liked: hit.is_liked
		};
		return {
			generation: {
				id: hit.generation_id || hit.id,
				ui_id: hit.generation_id || hit.id,
				width: hit.width,
				height: hit.height,
				inference_steps: hit.inference_steps,
				guidance_scale: hit.guidance_scale,
				model_id: hit.model_id as TAvailableGenerationModelId,
				scheduler_id: hit.scheduler_id as TAvailableSchedulerId,
				created_at: convertToDBTimeString(Date.now()),
				prompt: {
					id: hit.prompt_id,
					text: hit.prompt_text
				},
				negative_prompt:
					hit.negative_prompt_id && hit.negative_prompt_text
						? {
								id: hit.negative_prompt_id,
								text: hit.negative_prompt_text
							}
						: undefined,
				outputs: [output],
				status: 'succeeded',
				seed: 1,
				num_outputs: 1,
				submit_to_gallery: true,
				user: {
					username: hit.user.username
				}
			},
			...output
		};
	});
	const page: TUserProfileFullOutputsPage = {
		outputs,
		next,
		metadata
	};
	return page;
}
