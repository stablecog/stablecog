import {
	getGalleryInfiniteQueryKey,
	getGalleryInfiniteQueryProps,
	sortsDefault
} from '$routes/(app)/gallery/constants';
import type { QueryClient } from '@tanstack/svelte-query';
import type { PageLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { getGalleryLikeParamsFromSearchParams } from '$ts/helpers/galleryLike';
import { searchParamsToBase64 } from '$ts/helpers/base64';
import { PUBLIC_OG_IMAGE_API_URL } from '$env/static/public';

interface TParent {
	queryClient: QueryClient;
	globalSeed: number;
	session: Session | null | undefined;
}

export const load: PageLoad = async ({ url, parent }) => {
	const outputId = url.searchParams.get('output');
	if (outputId) redirect(302, `/gallery/o/${outputId}`);
	const outputIdShort = url.searchParams.get('o');
	if (outputIdShort) redirect(302, `/gallery/o/${outputIdShort}`);

	const { queryClient, globalSeed, session } = (await parent()) as TParent;
	const galleryLikeParams = getGalleryLikeParamsFromSearchParams(url.searchParams);
	const usernameFiltersQuery = url.searchParams.get('un');
	const usernameFilters = usernameFiltersQuery?.split(',') || [];
	const sortsQuery = url.searchParams.get('sort');
	const sorts = sortsQuery ? sortsQuery.split(',') : sortsDefault;
	const sharedQueryParams = {
		...galleryLikeParams,
		sorts,
		usernameFilters,
		seed: globalSeed
	};
	const hasInitialData =
		queryClient.getQueryData(
			getGalleryInfiniteQueryKey({
				...sharedQueryParams
			})
		) !== undefined;

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

	if (!hasInitialData) {
		try {
			await queryClient.prefetchInfiniteQuery(
				getGalleryInfiniteQueryProps({
					...sharedQueryParams,
					accessToken: session?.access_token
				})
			);
		} catch (error) {
			console.log(error);
		}
	}

	return {
		...galleryLikeParams,
		usernameFilters,
		sorts,
		previewImageUrl
	};
};
