import { sortsDefault, type TGalleryMainSort } from '$routes/(app)/gallery/constants';
import type { TAvailableGenerationModelId } from '$ts/constants/generationModels';
import type { TAvailableAspectRatio } from '$ts/constants/generationSize';
import { shortenString } from '$ts/helpers/metaTag';
import { isUUID } from '$ts/helpers/uuid';

const defaultDescription =
	'A gallery full of AI-generated images created with Stable Diffusion and Kandinsky. Check out images and their metadata including their prompt, negative prompt, inference steps, guidance scale and seed.';

export function getGalleryMeta({
	searchString,
	usernameFilters,
	aspectRatioFilters,
	modelIdFilters,
	sorts
}: {
	searchString?: string;
	aspectRatioFilters?: TAvailableAspectRatio[];
	usernameFilters?: string[];
	modelIdFilters?: TAvailableGenerationModelId[];
	sorts?: TGalleryMainSort[];
}): TGalleryMeta {
	const hasSearchString =
		searchString !== undefined && searchString !== null && searchString !== '';

	if (hasSearchString && isUUID(searchString)) {
		return {
			title: `Similar to "${shortenString(searchString, 8, false)}" | Gallery | Stablecog`,
			description: `Results for generations similar to "${shortenString(searchString, 8, false)}" on Stablecog's gallery. Check out images created with Stable Diffusion and Kandinsky.`
		};
	}

	if (hasSearchString) {
		return {
			title: `"${shortenString(searchString)}" | Gallery | Stablecog`,
			description: `Search results for "${shortenString(searchString)}" on Stablecog's gallery. Check out images created with Stable Diffusion and Kandinsky.`
		};
	}

	if (sorts && sorts[0] === 'trending') {
		return {
			title: 'Trending | Gallery | Stablecog',
			description: defaultDescription
		};
	}

	if (sorts && sorts[0] === 'top') {
		return {
			title: 'Top | Gallery | Stablecog',
			description: defaultDescription
		};
	}

	if (
		(aspectRatioFilters && aspectRatioFilters.length > 0) ||
		(modelIdFilters && modelIdFilters.length > 0) ||
		(usernameFilters && usernameFilters.length > 0) ||
		(sorts && sorts.length > 0 && sorts !== sortsDefault)
	) {
		return {
			title: 'Filtered Results | Gallery | Stablecog',
			description: defaultDescription
		};
	}

	return {
		title: 'Gallery | Stablecog',
		description: defaultDescription
	};
}

export interface TGalleryMeta {
	title: string;
	description: string;
}
