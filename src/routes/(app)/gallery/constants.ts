import { getGalleryGenerationFullOutputs } from '$ts/queries/galleryLike/galleryGenerations';
import type { TGalleryGenerationFullOutputsPage } from '$ts/queries/galleryLike/types';
import type { FetchInfiniteQueryOptions } from '@tanstack/svelte-query';

export const getGalleryInfiniteQueryKey = ({
	searchString,
	modelIdFilters,
	seed
}: {
	searchString?: string | null;
	modelIdFilters?: string[] | null;
	seed?: number;
}) => {
	return [
		'gallery_generation_full_outputs',
		searchString ? searchString : '',
		modelIdFilters ? modelIdFilters.join(',') : '',
		typeof seed === 'number' ? seed : ''
	];
};

export function getGalleryInfiniteQueryProps({
	searchString,
	modelIdFilters,
	seed
}: {
	searchString?: string | null;
	modelIdFilters?: string[];
	seed?: number;
}): FetchInfiniteQueryOptions<
	TGalleryGenerationFullOutputsPage,
	unknown,
	TGalleryGenerationFullOutputsPage,
	any
> {
	return {
		queryKey: getGalleryInfiniteQueryKey({ searchString, modelIdFilters, seed }),
		queryFn: async (lastPage) => {
			return getGalleryGenerationFullOutputs({
				cursor: lastPage?.pageParam,
				seed,
				search: searchString,
				model_ids: modelIdFilters
			});
		},
		getNextPageParam: (lastPage: TGalleryGenerationFullOutputsPage) => {
			if (!lastPage.next) return undefined;
			return lastPage.next;
		}
	};
}
