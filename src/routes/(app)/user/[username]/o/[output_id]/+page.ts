import type { TAvailableGenerationModelId } from '$ts/constants/generationModels';
import { apiUrl } from '$ts/constants/main';
import type { TAvailableSchedulerId } from '$ts/constants/schedulers';
import { convertToDBTimeString } from '$ts/helpers/convertToDBTimeString';
import { getGalleryGenerationFullOutputs } from '$ts/queries/galleryLike/galleryGenerations';
import type { TGenerationFullOutput, TGenerationOutput } from '$ts/stores/user/generation';
import { error } from '@sveltejs/kit';
import { similarCount } from '$routes/(app)/gallery/o/[output_id]/constants';
import type { PageLoad } from './$types';
import type { QueryClient } from '@tanstack/svelte-query';
import type {
	TGalleryGenerationFullOutputPageRes,
	TGalleryGenerationFullOutputsPage
} from '$ts/queries/galleryLike/types';
import { getOtherUserGenerationFullOutputs } from '$ts/queries/galleryLike/otherUserOutputs';

interface TParent {
	queryClient: QueryClient;
	globalSeed: number;
}

export const load: PageLoad = async ({ params, parent }) => {
	const outputId = params.output_id;
	const username = params.username;
	let generationFullOutput: TGenerationFullOutput | undefined = undefined;
	let similarGenerationFullOutputs: TGenerationFullOutput[] | undefined = undefined;
	const [generationFullOutputRes, similarGenerationFullOutputsRes] = await Promise.all([
		fetch(`${apiUrl.origin}/v1/profile/${username}/outputs?output_id=${outputId}`),
		getOtherUserGenerationFullOutputs({
			search: outputId,
			per_page: similarCount + 1,
			username
		})
	]);
	if (!generationFullOutputRes.ok) {
		throw error(404, 'Response for generation not ok');
	}
	const data: TGalleryGenerationFullOutputPageRes = await generationFullOutputRes.json();
	if (!data.hits || !data.hits[0]) {
		throw error(404, 'No output found');
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
			created_at: output.created_at || convertToDBTimeString(Date.now()),
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

	similarGenerationFullOutputs = similarGenerationFullOutputsRes.outputs
		.filter((o) => o.id !== generationFullOutput?.id)
		.slice(0, similarCount);

	const page: TGalleryGenerationFullOutputsPage = {
		outputs: similarGenerationFullOutputs,
		next: undefined
	};

	const { queryClient } = (await parent()) as TParent;
	queryClient.setQueryData(['other_user_similar_outputs_short', outputId], page);

	return {
		generationFullOutput,
		similarGenerationFullOutputs,
		username
	};
};
