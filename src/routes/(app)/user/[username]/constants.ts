import { getSomeUsersGenerationFullOutputs } from '$ts/queries/galleryLike/someUsersOutputs';
import type { TGalleryGenerationFullOutputsPage } from '$ts/queries/galleryLike/types';
import type { FetchInfiniteQueryOptions } from '@tanstack/svelte-query';

export const getSomeUserProfileInfiniteQueryKey = ({
	searchString,
	modelIdFilters,
	seed,
	username
}: {
	searchString?: string | null;
	modelIdFilters?: string[] | null;
	seed?: number;
	username: string;
}) => {
	return [
		'other_user_generation_full_outputs',
		username,
		searchString ? searchString : '',
		modelIdFilters ? modelIdFilters.join(',') : '',
		typeof seed === 'number' ? seed : ''
	];
};

export function getSomeUserProfileInfiniteQueryProps({
	searchString,
	modelIdFilters,
	seed,
	username
}: {
	searchString?: string | null;
	modelIdFilters?: string[];
	seed?: number;
	username: string;
}): FetchInfiniteQueryOptions<
	TGalleryGenerationFullOutputsPage,
	unknown,
	TGalleryGenerationFullOutputsPage,
	any
> {
	return {
		queryKey: getSomeUserProfileInfiniteQueryKey({ searchString, modelIdFilters, seed, username }),
		queryFn: async (lastPage) => {
			return getSomeUsersGenerationFullOutputs({
				cursor: lastPage?.pageParam,
				seed,
				search: searchString,
				model_ids: modelIdFilters,
				username
			});
		},
		getNextPageParam: (lastPage: TGalleryGenerationFullOutputsPage) => {
			if (!lastPage.next) return undefined;
			return lastPage.next;
		}
	};
}
