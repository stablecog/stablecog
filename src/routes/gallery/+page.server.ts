import type { TAvailableGenerationModelId } from '$ts/constants/generationModels';
import { apiUrl } from '$ts/constants/main';
import type { TAvailableSchedulerId } from '$ts/constants/schedulers';
import type { TGalleryGenerationFullOutputPageRes } from '$ts/queries/galleryGenerations';
import type { TGenerationFullOutput, TGenerationOutput } from '$ts/stores/user/generation';
import type { ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async ({ url }) => {
	let outputId = url.searchParams.get('output');
	let generationFullOutput: TGenerationFullOutput | undefined = undefined;
	if (!outputId) {
		return { generationFullOutput };
	}
	const res = await fetch(`${apiUrl.origin}/v1/gallery?output_id=${outputId}`);
	if (!res.ok) {
		return { generationFullOutput };
	}
	const data: TGalleryGenerationFullOutputPageRes = await res.json();
	if (!data.hits || !data.hits[0]) return { generationFullOutput };
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
			created_at: Date.now(),
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
		generationFullOutput
	};
};
