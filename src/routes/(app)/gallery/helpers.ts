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
	if (searchString !== undefined && searchString !== null && searchString !== '') {
		return {
			title: `"${searchString}" | Stablecog Gallery`,
			description: `Search results for "${searchString}" on Stablecog's gallery. Check out images created with Stable Diffusion and Kandinsky.`
		};
	}
	return {
		title: 'Gallery | Stablecog',
		description:
			"'A gallery full of images created with Stable Diffusion and Kandinsky. Check out images and their metadata including their prompt, negative prompt, inference steps, guidance scale and seed. Generate similar images directly from the gallery or submit your own.'"
	};
}

export interface TGalleryMeta {
	title: string;
	description: string;
}

function shortSearchString(s: string, l = 40): string {
	return s.length > l ? s.substring(0, l) + '...' : s;
}
