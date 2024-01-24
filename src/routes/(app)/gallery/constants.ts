import { getGalleryGenerationFullOutputs } from '$ts/queries/galleryLike/galleryGenerations';
import type { TUserProfileFullOutputsPage } from '$ts/queries/galleryLike/types';
import type { FetchInfiniteQueryOptions } from '@tanstack/svelte-query';
import { writable as writableLocal } from '@macfja/svelte-persistent-store';
import type { TAvailableGenerationModelId } from '$ts/constants/generationModels';

export const gallerySearchString = writableLocal<string>('gallerySearchString', '');

export const galleryModelIdFilters = writableLocal<TAvailableGenerationModelId[]>(
	'galleryModelIdFilters',
	[]
);

export const mainSortViewDefault = 'trending';
export const mainSorts = ['trending', 'top', 'new'];
export const sortsDefault = [mainSortViewDefault];
export const gallerySorts = writableLocal<string[]>('gallerySorts', sortsDefault);

export const getGalleryInfiniteQueryKey = ({
	searchString,
	modelIdFilters,
	sorts,
	seed
}: {
	searchString?: string | null;
	modelIdFilters?: string[] | null;
	sorts?: string[] | null;
	seed?: number;
}): string[] => {
	return [
		'gallery_generation_full_outputs',
		searchString ? searchString : '',
		modelIdFilters ? modelIdFilters.join(',') : '',
		sorts ? sorts.join(',') : '',
		typeof seed === 'number' ? String(seed) : ''
	];
};

export function getGalleryInfiniteQueryProps({
	searchString,
	modelIdFilters,
	sorts,
	seed,
	accessToken
}: {
	searchString?: string | null;
	modelIdFilters?: string[];
	sorts?: string[];
	seed?: number;
	accessToken?: string;
}): FetchInfiniteQueryOptions<
	TUserProfileFullOutputsPage,
	unknown,
	TUserProfileFullOutputsPage,
	any
> {
	return {
		queryKey: getGalleryInfiniteQueryKey({ searchString, modelIdFilters, sorts, seed }),
		queryFn: async (lastPage) => {
			return getGalleryGenerationFullOutputs({
				cursor: lastPage?.pageParam,
				seed,
				search: searchString,
				model_ids: modelIdFilters,
				sorts,
				accessToken
			});
		},
		getNextPageParam: (lastPage: TUserProfileFullOutputsPage) => {
			if (!lastPage.next) return undefined;
			return lastPage.next;
		}
	};
}
