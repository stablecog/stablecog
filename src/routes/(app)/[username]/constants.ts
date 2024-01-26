import { getSomeUsersGenerationFullOutputs } from '$ts/queries/galleryLike/someUsersOutputs';
import type { TUserProfileFullOutputsPage } from '$ts/queries/galleryLike/types';
import type { FetchInfiniteQueryOptions } from '@tanstack/svelte-query';
import type { TAvailableGenerationModelId } from '$ts/constants/generationModels';
import type { TAvailableAspectRatio } from '$ts/constants/generationSize';
import { sessionAndUrlParamWritable } from '$ts/stores/sessionAndUrlParamStore';

export const someUserGallerySearchString = sessionAndUrlParamWritable<string>(
	'someUserGallerySearchString',
	'q',
	''
);
export const someUserGalleryModelIdFilters = sessionAndUrlParamWritable<
	TAvailableGenerationModelId[]
>('someUserGalleryModelIdFilters', 'mi', []);
export const someUserGalleryAspectRatioFilters = sessionAndUrlParamWritable<
	TAvailableAspectRatio[]
>('someUserGalleryAspectRatioFilters', 'ar', []);

export const getSomeUserProfileInfiniteQueryKey = ({
	searchString,
	modelIdFilters,
	aspectRatioFilters,
	username
}: {
	searchString?: string | null;
	modelIdFilters?: string[] | null;
	aspectRatioFilters?: string[] | null;
	username: string;
}) => {
	return [
		'other_user_generation_full_outputs',
		username,
		searchString ? searchString : '',
		modelIdFilters ? modelIdFilters.sort().join(',') : '',
		aspectRatioFilters ? aspectRatioFilters.sort().join(',') : ''
	];
};

export function getSomeUserProfileInfiniteQueryProps({
	searchString,
	modelIdFilters,
	aspectRatioFilters,
	username,
	accessToken
}: {
	searchString?: string | null;
	modelIdFilters?: TAvailableGenerationModelId[];
	aspectRatioFilters?: TAvailableAspectRatio[];
	username: string;
	accessToken?: string;
}): FetchInfiniteQueryOptions<
	TUserProfileFullOutputsPage,
	unknown,
	TUserProfileFullOutputsPage,
	any
> {
	return {
		queryKey: getSomeUserProfileInfiniteQueryKey({
			searchString,
			modelIdFilters,
			aspectRatioFilters,
			username
		}),
		queryFn: async (lastPage) => {
			return getSomeUsersGenerationFullOutputs({
				cursor: lastPage?.pageParam,
				search: searchString,
				model_ids: modelIdFilters,
				aspect_ratios: aspectRatioFilters,
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
