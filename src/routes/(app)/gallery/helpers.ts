import { shortenString } from '$ts/helpers/metaTag';
import { isUUID } from '$ts/helpers/uuid';

export function getGalleryMeta({
	searchString,
	usernameFilters,
	aspectRatioFilters,
	modelIdFilters,
	sorts
}: {
	searchString?: string;
	aspectRatioFilters?: string[];
	usernameFilters?: string[];
	modelIdFilters?: string[];
	sorts?: string[];
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

	return {
		title: 'Gallery | Stablecog',
		description:
			'A gallery full of AI-generated images created with Stable Diffusion and Kandinsky. Check out images and their metadata including their prompt, negative prompt, inference steps, guidance scale and seed.'
	};
}

export interface TGalleryMeta {
	title: string;
	description: string;
}
