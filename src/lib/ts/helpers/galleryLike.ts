import {
	availableGenerationModelIds,
	type TAvailableGenerationModelId
} from '$ts/constants/generationModels';
import { availableAspectRatios, type TAvailableAspectRatio } from '$ts/constants/generationSize';

export function getGalleryLikeParamsFromSearchParams(searchParams: URLSearchParams) {
	const modelIdQuery = searchParams.get('mi');
	const modelIds = modelIdQuery?.split(',') || [];
	const filteredModelIds = modelIds.filter((modelId) =>
		availableGenerationModelIds.includes(modelId as TAvailableGenerationModelId)
	) as TAvailableGenerationModelId[];
	const aspectRatioFiltersQuery = searchParams.get('ar');
	const aspectRatioFilters = aspectRatioFiltersQuery?.split(',') || [];
	const filteredAspectRatioFilters = aspectRatioFilters.filter((aspectRatio) =>
		availableAspectRatios.includes(aspectRatio as TAvailableAspectRatio)
	) as TAvailableAspectRatio[];
	const searchStringParam = searchParams.get('q');
	const searchString = searchStringParam || '';
	return {
		modelIdFilters: filteredModelIds,
		aspectRatioFilters: filteredAspectRatioFilters,
		searchString
	};
}
