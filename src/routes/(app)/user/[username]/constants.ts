import { getSomeUsersGenerationFullOutputs } from '$ts/queries/galleryLike/someUsersOutputs';
import type { TUserProfileFullOutputsPage } from '$ts/queries/galleryLike/types';
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
		typeof seed === 'number' ? String(seed) : ''
	];
};

export function getSomeUserProfileInfiniteQueryProps({
	searchString,
	modelIdFilters,
	seed,
	username,
	accessToken
}: {
	searchString?: string | null;
	modelIdFilters?: string[];
	seed?: number;
	username: string;
	accessToken?: string;
}): FetchInfiniteQueryOptions<
	TUserProfileFullOutputsPage,
	unknown,
	TUserProfileFullOutputsPage,
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
				username,
				access_token: accessToken
			});
		},
		getNextPageParam: (lastPage: TUserProfileFullOutputsPage) => {
			if (!lastPage.next) return undefined;
			return lastPage.next;
		}
	};
}
