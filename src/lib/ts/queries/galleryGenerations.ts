import type { TAvailableGenerationModelId } from '$ts/constants/generationModels';
import { apiUrl } from '$ts/constants/main';
import type { TAvailableSchedulerId } from '$ts/constants/schedulers';
import { convertToDBTimeString } from '$ts/helpers/convertToDBTimeString';
import type { TGenerationFullOutput, TGenerationOutput } from '$userStores/generation';

const score_threshold = 50;

export async function getGalleryGenerationFullOutputs({
	cursor,
	search,
	seed,
	model_ids
}: {
	cursor?: string;
	search?: string;
	seed: number;
	model_ids?: TAvailableGenerationModelId[];
}): Promise<TGalleryGenerationFullOutputsPage> {
	console.log('getGalleryOutputs');
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
	query.append('seed', seed.toString());
	let queryString = query.toString();
	if (queryString) queryString = `?${queryString}`;
	const url = `${apiUrl.origin}/v1/gallery${queryString}`;
	const res = await fetch(url, {
		headers: {
			'Content-Type': 'application/json'
		}
	});
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
				submit_to_gallery: true
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

export interface TGalleryGenerationFullOutputPageRes {
	hits: TGalleryGenerationHit[];
	next?: string;
}

export interface TGalleryGenerationHit {
	id: string;
	generation_id: string;
	image_url: string;
	upscaled_image_url?: string;
	created_at: string;
	updated_at: string;
	width: number;
	height: number;
	inference_steps: number;
	guidance_scale: number;
	model_id: string;
	scheduler_id: string;
	prompt_text: string;
	prompt_id: string;
	negative_prompt_text?: string;
	negative_prompt_id?: string;
}

export interface TGalleryGenerationFullOutputsPage {
	outputs: TGenerationFullOutput[];
	next?: string | number;
}
