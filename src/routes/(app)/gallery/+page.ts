import {
	getGalleryInfiniteQueryKey,
	getGalleryInfiniteQueryProps,
	sortsDefault
} from '$routes/(app)/gallery/constants';
import type { QueryClient } from '@tanstack/svelte-query';
import type { PageLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { getGalleryLikeParamsFromSearchParams } from '$ts/helpers/galleryLike';

interface TParent {
	queryClient: QueryClient;
	globalSeed: number;
	session: Session | null | undefined;
}

export const load: PageLoad = async ({ url, parent }) => {
	const outputId = url.searchParams.get('output');
	if (outputId) throw redirect(302, `/gallery/o/${outputId}`);
	const outputIdShort = url.searchParams.get('o');
	if (outputIdShort) throw redirect(302, `/gallery/o/${outputIdShort}`);

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
		sorts
	};
};
