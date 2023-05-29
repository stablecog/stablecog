import {
	getGalleryInfiniteQueryKey,
	getGalleryInfiniteQueryProps
} from '$routes/(app)/gallery/constants';
import {
	availableGenerationModelIds,
	type TAvailableGenerationModelId
} from '$ts/constants/generationModels';
import { apiUrl } from '$ts/constants/main';
import type { TAvailableSchedulerId } from '$ts/constants/schedulers';
import { convertToDBTimeString } from '$ts/helpers/convertToDBTimeString';
import type { TGalleryGenerationFullOutputPageRes } from '$ts/queries/galleryGenerations';
import type { TGenerationFullOutput, TGenerationOutput } from '$ts/stores/user/generation';
import type { QueryClient } from '@tanstack/svelte-query';
import type { PageLoad } from './$types';

interface TParent {
	queryClient: QueryClient;
	globalSeed: number;
}

export const load: PageLoad = async ({ url, parent, fetch }) => {
	const { queryClient, globalSeed } = (await parent()) as TParent;
	const hasInitialData = queryClient.getQueryData(getGalleryInfiniteQueryKey({})) !== undefined;
	if (!hasInitialData) {
		try {
			await queryClient.prefetchInfiniteQuery(getGalleryInfiniteQueryProps({ seed: globalSeed }));
		} catch (error) {
			console.log(error);
		}
	}
	const outputId = url.searchParams.get('output');
	const searchQuery = url.searchParams.get('q');
	const modelIdQuery = url.searchParams.get('mi');
	const modelIds = modelIdQuery ? modelIdQuery.split(',') : [];
	const filteredModelIds = modelIds.filter((modelId) =>
		availableGenerationModelIds.includes(modelId as TAvailableGenerationModelId)
	);
	let generationFullOutput: TGenerationFullOutput | undefined = undefined;
	if (!outputId) {
		return { generationFullOutput, searchQuery, modelIds: filteredModelIds };
	}
	const res = await fetch(`${apiUrl.origin}/v1/gallery?output_id=${outputId}`);
	if (!res.ok) {
		return { generationFullOutput, searchQuery, modelIds: filteredModelIds };
	}
	const data: TGalleryGenerationFullOutputPageRes = await res.json();
	if (!data.hits || !data.hits[0]) {
		return { generationFullOutput, searchQuery, modelIds: filteredModelIds };
	}
	const hit = data.hits[0];
	const output: TGenerationOutput = {
		id: hit.id,
		image_url: hit.image_url,
		upscaled_image_url: hit.upscaled_image_url,
		created_at: hit.created_at,
		updated_at: hit.updated_at
	};
	generationFullOutput = {
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
	return {
		generationFullOutput,
		searchQuery,
		modelIds: filteredModelIds
	};
};
