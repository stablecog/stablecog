import type { TAvailableGenerationModelId } from '$ts/constants/generationModels';
import { apiUrl } from '$ts/constants/main';
import type { TAvailableSchedulerId } from '$ts/constants/schedulers';
import { convertToDBTimeString } from '$ts/helpers/convertToDBTimeString';
import type {
	TGalleryGenerationFullOutputPageRes,
	TGalleryGenerationFullOutputsPage
} from '$ts/queries/galleryLike/types';
import type { TGenerationFullOutput, TGenerationOutput } from '$userStores/generation';

const score_threshold_default = 50;
const per_page_default = 50;

export async function getOtherUserGenerationFullOutputs({
	cursor,
	search,
	seed,
	model_ids,
	custom_fetch,
	per_page = per_page_default,
	score_threshold = score_threshold_default,
	prompt_id,
	username
}: {
	cursor?: string;
	search?: string | null;
	seed?: number;
	model_ids?: TAvailableGenerationModelId[];
	custom_fetch?: typeof fetch;
	per_page?: number;
	score_threshold?: number;
	prompt_id?: string;
	username: string;
}): Promise<TGalleryGenerationFullOutputsPage> {
	console.log('getOtherUserGenerationFullOutputs');
	const query = new URLSearchParams();
	if (cursor) {
		if ((search && typeof cursor === 'number') || (!search && typeof cursor === 'string')) {
			query.append('cursor', cursor);
		}
	}
	if (search && search !== '') {
		query.append('search', search);
		query.append('score_threshold', score_threshold.toString());
	}
	if (model_ids && model_ids.length > 0) {
		query.append('model_ids', model_ids.join(','));
	}
	query.append('per_page', per_page.toString());
	if (typeof seed === 'number') {
		query.append('seed', seed.toString());
	}
	if (prompt_id) {
		query.append('prompt_id', prompt_id);
	}
	let queryString = query.toString();
	if (queryString) queryString = `?${queryString}`;
	const url = `${apiUrl.origin}/v1/profile/${username}/outputs${queryString}`;
	const f = custom_fetch || fetch;
	const res = await f(url, {
		headers: {
			'Content-Type': 'application/json'
		}
	});
	if (!res.ok)
		throw new Error(
			`Failed to user user generation full outputs: ${res.status}, ${res.statusText}`
		);
	const data: TGalleryGenerationFullOutputPageRes = await res.json();
	const { hits, next } = data;
	const outputs: TGenerationFullOutput[] = hits.map((hit) => {
		const output: TGenerationOutput = {
			id: hit.id,
			image_url: hit.image_url,
			upscaled_image_url: hit.upscaled_image_url,
			created_at: hit.created_at,
			updated_at: hit.updated_at
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
					username
				}
			},
			...output
		};
	});
	const page: TGalleryGenerationFullOutputsPage = {
		outputs,
		next
	};
	return page;
}
