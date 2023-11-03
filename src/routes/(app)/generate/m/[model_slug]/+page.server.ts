import { generationModels } from '$ts/constants/generationModels';
import { toSlug } from '$ts/helpers/toSlug';
import type { ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = ({ params }) => {
	const modelSlug = params.model_slug;
	let matchingModelId: string | null = null;
	for (const modelId in generationModels) {
		const model = generationModels[modelId];
		const slug = toSlug(model.name);
		if (slug === modelSlug && model.active !== false) {
			matchingModelId = modelId;
			break;
		}
	}
	return {
		model_id: matchingModelId
	};
};
