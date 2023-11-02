import { generationModels } from '$ts/constants/generationModels';
import { toSlug } from '$ts/helpers/toSlug';
import { redirect, type ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = ({ params }) => {
	const modelSlug = params.model_slug;
	let matchingModelId: string | undefined = undefined;
	for (const modelId in generationModels) {
		const model = generationModels[modelId];
		const slug = toSlug(model.name);
		if (slug === modelSlug && model.active !== false) {
			matchingModelId = modelId;
			break;
		}
	}

	if (matchingModelId) {
		throw redirect(302, `/generate?mi=${matchingModelId}`);
	}

	throw redirect(302, '/generate');
};
