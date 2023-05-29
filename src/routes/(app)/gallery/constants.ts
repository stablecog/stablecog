import {
	getGalleryGenerationFullOutputs,
	type TGalleryGenerationFullOutputsPage
} from '$ts/queries/galleryGenerations';
import type { FetchInfiniteQueryOptions } from '@tanstack/svelte-query';

export const getGalleryInfiniteQueryKey = ({
	searchString,
	modelIdFilters
}: {
	searchString?: string;
	modelIdFilters?: string[];
}) => {
	return [
		'gallery_generation_full_outputs',
		searchString ? searchString : '',
		modelIdFilters ? modelIdFilters.join(',') : ''
	];
};

export function getGalleryInfiniteQueryProps({
	searchString,
	modelIdFilters,
	seed
}: {
	searchString?: string;
	modelIdFilters?: string[];
	seed: number;
}): FetchInfiniteQueryOptions<
	TGalleryGenerationFullOutputsPage,
	unknown,
	TGalleryGenerationFullOutputsPage,
	any
> {
	return {
		queryKey: getGalleryInfiniteQueryKey({ searchString, modelIdFilters }),
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
