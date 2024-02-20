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
	const hasModelIdFilter = modelIdFilters && modelIdFilters.length > 0;
	const hasAspectRatioFilter = aspectRatioFilters && aspectRatioFilters.length > 0;
	const hasUsernameFilter = usernameFilters && usernameFilters.length > 0;
	const hasSorts = sorts && sorts.length > 0 && !arraysEqual(sorts, sortsDefault);

	const hasSearchString =
		searchString !== undefined && searchString !== null && searchString !== '';

	if (hasSearchString && isUUID(searchString)) {
		return {
			title: `Similar to "${shortenString(searchString, 8, false)}" | Gallery | Stablecog`,
			description: `Generations similar to "${shortenString(searchString, 8, false)}" on Stablecog's gallery. Check out images created with Stable Diffusion and Kandinsky.`
		};
	}

	if (hasSearchString) {
		return {
			title: `"${shortenString(searchString)}" | Gallery | Stablecog`,
			description: `Search results for "${shortenString(searchString)}" on Stablecog's gallery. Check out images created with Stable Diffusion and Kandinsky.`
		};
	}

	if (
		sorts &&
		sorts.includes('trending') &&
		!hasAspectRatioFilter &&
		!hasModelIdFilter &&
		!hasUsernameFilter
	) {
		return {
			title: 'Trending | Gallery | Stablecog',
			description: defaultDescription
		};
	}

	if (
		sorts &&
		sorts.includes('top') &&
		!hasAspectRatioFilter &&
		!hasModelIdFilter &&
		!hasUsernameFilter
	) {
		return {
			title: 'Top | Gallery | Stablecog',
			description: defaultDescription
		};
	}

	if (hasAspectRatioFilter || hasModelIdFilter || hasUsernameFilter || hasSorts) {
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

function arraysEqual(a: any[], b: any[]): boolean {
	if (a === b) return true;
	if (a == null || b == null) return false;
	if (a.length !== b.length) return false;

	for (let i = 0; i < a.length; i++) {
		if (a[i] !== b[i]) return false;
	}

	return true;
}
