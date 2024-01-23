import {
	getGalleryInfiniteQueryKey,
	getGalleryInfiniteQueryProps,
	sortsDefault
} from '$routes/(app)/gallery/constants';
import {
	availableGenerationModelIds,
	type TAvailableGenerationModelId
} from '$ts/constants/generationModels';
import type { QueryClient } from '@tanstack/svelte-query';
import type { PageLoad } from './$types';
import { redirect } from '@sveltejs/kit';

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
	const searchString = url.searchParams.get('q') || '';
	const modelIdQuery = url.searchParams.get('mi');
	const modelIds = modelIdQuery ? modelIdQuery.split(',') : [];
	const filteredModelIds = modelIds.filter((modelId) =>
		availableGenerationModelIds.includes(modelId as TAvailableGenerationModelId)
	);
	const sortsQuery = url.searchParams.get('sort');
	const sorts = sortsQuery ? sortsQuery.split(',') : sortsDefault;
	const hasInitialData =
		queryClient.getQueryData(
			getGalleryInfiniteQueryKey({
				searchString: searchString,
				modelIdFilters: filteredModelIds,
				sorts,
				seed: globalSeed
			})
		) !== undefined;
	if (!hasInitialData) {
		try {
			await queryClient.prefetchInfiniteQuery(
				getGalleryInfiniteQueryProps({
					searchString: searchString,
					modelIdFilters: filteredModelIds,
					sorts: sorts,
					seed: globalSeed,
					accessToken: session?.access_token
				})
			);
		} catch (error) {
			console.log(error);
		}
	}

	return {
		searchString,
		modelIdFilters: filteredModelIds,
		sorts
	};
};
