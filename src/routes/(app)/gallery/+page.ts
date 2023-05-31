import {
	getGalleryInfiniteQueryKey,
	getGalleryInfiniteQueryProps
} from '$routes/(app)/gallery/constants';
import {
	availableGenerationModelIds,
	type TAvailableGenerationModelId
} from '$ts/constants/generationModels';
import { apiUrl } from '$ts/constants/main';
import type { TAvailableSchedulerId } from '$ts/constants/schedulers';
import { convertToDBTimeString } from '$ts/helpers/convertToDBTimeString';
import type { TGalleryGenerationFullOutputPageRes } from '$ts/queries/galleryGenerations';
import type { TGenerationFullOutput, TGenerationOutput } from '$ts/stores/user/generation';
import type { QueryClient } from '@tanstack/svelte-query';
import type { PageLoad } from './$types';
import { isHydrated } from '$ts/helpers/isHydrated';
import { redirect } from '@sveltejs/kit';

interface TParent {
	queryClient: QueryClient;
	globalSeed: number;
}

export const load: PageLoad = async ({ url, parent }) => {
	const outputId = url.searchParams.get('output');
	if (outputId) throw redirect(302, `/gallery/o/${outputId}`);
	const outputIdShort = url.searchParams.get('o');
	if (outputIdShort) throw redirect(302, `/gallery/o/${outputIdShort}`);

	const { queryClient, globalSeed } = (await parent()) as TParent;
	const searchQuery = url.searchParams.get('q');
	const modelIdQuery = url.searchParams.get('mi');
	const modelIds = modelIdQuery ? modelIdQuery.split(',') : [];
	const filteredModelIds = modelIds.filter((modelId) =>
		availableGenerationModelIds.includes(modelId as TAvailableGenerationModelId)
	);

	const hasInitialData =
		queryClient.getQueryData(
			getGalleryInfiniteQueryKey({
				searchString: searchQuery,
				modelIdFilters: filteredModelIds,
				seed: globalSeed
			})
		) !== undefined;
	if (!hasInitialData) {
		try {
			await queryClient.prefetchInfiniteQuery(
				getGalleryInfiniteQueryProps({
					searchString: searchQuery,
					modelIdFilters: filteredModelIds,
					seed: globalSeed
				})
			);
		} catch (error) {
			console.log(error);
		}
	}

	return {
		searchQuery,
		modelIds: filteredModelIds
	};
};
