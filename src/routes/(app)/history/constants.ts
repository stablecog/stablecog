import {
	getUserGenerationFullOutputs,
	type TUserGenerationFullOutputsPage
} from '$ts/queries/userGenerations';
import type { TUserGalleryView } from '$ts/stores/user/gallery';
import type { Session } from '@supabase/supabase-js';
import type { CreateInfiniteQueryOptions } from '@tanstack/svelte-query';
import { writable as writableLocal } from '@macfja/svelte-persistent-store';
import type { TAvailableAspectRatio } from '$ts/constants/generationSize';
import type { TAvailableGenerationModelId } from '$ts/constants/generationModels';
import { sessionAndUrlParamWritable } from '$ts/stores/sessionAndUrlParamStore';

export const userGallerySearchString = sessionAndUrlParamWritable<string>(
	'userGallerySearchString',
	'q',
	''
);

export const getHistoryInfiniteQueryKey = ({
	userGalleryCurrentView,
	searchString,
	modelIdFilters,
	aspectRatioFilters
}: {
	userGalleryCurrentView: TUserGalleryView;
	searchString?: string;
	modelIdFilters?: string[];
	aspectRatioFilters?: string[];
}) => {
	return [
		'user_generation_full_outputs',
		userGalleryCurrentView,
		searchString ? searchString : '',
		modelIdFilters ? modelIdFilters.sort().join(',') : '',
		aspectRatioFilters ? aspectRatioFilters.sort().join(',') : ''
	];
};

export function getHistoryInfiniteQueryProps({
	userGalleryCurrentView,
	searchString,
	modelIdFilters,
	aspectRatioFilters,
	session
}: {
	userGalleryCurrentView: TUserGalleryView;
	searchString?: string;
	modelIdFilters?: TAvailableGenerationModelId[];
	aspectRatioFilters?: TAvailableAspectRatio[];
	session: Session;
}): CreateInfiniteQueryOptions<
	TUserGenerationFullOutputsPage,
	unknown,
	TUserGenerationFullOutputsPage,
	TUserGenerationFullOutputsPage,
	string[]
> {
	return {
		queryKey: getHistoryInfiniteQueryKey({
			userGalleryCurrentView,
			searchString,
			modelIdFilters,
			aspectRatioFilters
		}),
		queryFn: (lastPage) => {
			return getUserGenerationFullOutputs({
				access_token: session.access_token || '',
				cursor: lastPage?.pageParam,
				is_favorited: userGalleryCurrentView === 'favorites' ? true : undefined,
				is_liked: userGalleryCurrentView === 'likes' ? true : undefined,
				search: searchString,
				model_ids: modelIdFilters,
				aspect_ratios: aspectRatioFilters
			});
		},
		getNextPageParam: (lastPage: TUserGenerationFullOutputsPage) => {
			if (!lastPage.next) return undefined;
			return lastPage.next;
		}
	};
}
