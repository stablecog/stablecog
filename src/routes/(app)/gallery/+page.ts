import { PUBLIC_OG_IMAGE_API_URL } from '$env/static/public';
import { mainSorts, sortsDefault, type TGalleryMainSort } from '$routes/(app)/gallery/constants';
import { searchParamsToBase64 } from '$ts/helpers/base64';
import { getGalleryLikeParamsFromSearchParams } from '$ts/helpers/galleryLike';
import { redirect } from '@sveltejs/kit';

export const load = async ({ url, parent }) => {
	const outputId = url.searchParams.get('output');
	if (outputId) redirect(302, `/gallery/o/${outputId}`);
	const outputIdShort = url.searchParams.get('o');
	if (outputIdShort) redirect(302, `/gallery/o/${outputIdShort}`);

	const galleryLikeParams = getGalleryLikeParamsFromSearchParams(url.searchParams);
	const usernameFiltersQuery = url.searchParams.get('un');
	const usernameFilters = usernameFiltersQuery?.split(',') || [];
	const sortsQuery = url.searchParams.get('sort');
	const sorts = (
		sortsQuery
			? sortsQuery.split(',').filter((i) => mainSorts.includes(i as TGalleryMainSort))
			: sortsDefault
	) as TGalleryMainSort[];

	const searchParamsFiltered = new URLSearchParams();
	if (galleryLikeParams.searchString !== '') {
		searchParamsFiltered.set('q', galleryLikeParams.searchString);
	}
	if (galleryLikeParams.modelIdFilters.length > 0) {
		searchParamsFiltered.set('mi', galleryLikeParams.modelIdFilters.join(','));
	}
	if (galleryLikeParams.aspectRatioFilters.length > 0) {
		searchParamsFiltered.set(
			'ar',
			galleryLikeParams.aspectRatioFilters.join(',').replaceAll('.', '_').replaceAll(':', '-')
		);
	}
	if (sorts.length > 0 && sorts !== sortsDefault) {
		searchParamsFiltered.set('sort', sorts.join(','));
	}
	if (usernameFilters.length > 0) {
		searchParamsFiltered.set('un', usernameFilters.join(','));
	}
	const base64SearchParams = searchParamsToBase64(searchParamsFiltered);
	const previewImageUrl = `${PUBLIC_OG_IMAGE_API_URL}/api/gallery/preview/${searchParamsFiltered.toString() !== '' ? base64SearchParams : 'main'}.png`;

	return {
		...galleryLikeParams,
		usernameFilters,
		sorts,
		previewImageUrl
	};
};
