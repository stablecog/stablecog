import {
	getUserGenerationFullOutputs,
	type TUserGenerationFullOutputsPage
} from '$ts/queries/userGenerations';
import type { TUserGalleryView } from '$ts/stores/user/gallery';
import type { Session } from '@supabase/supabase-js';
import type { CreateInfiniteQueryOptions } from '@tanstack/svelte-query';
import { writable as writableLocal } from '@macfja/svelte-persistent-store';

export const historySearchString = writableLocal<string>('historySearchString', '');

export const getHistoryInfiniteQueryKey = ({
	userGalleryCurrentView,
	searchString,
	modelIdFilters
}: {
	userGalleryCurrentView: TUserGalleryView;
	searchString?: string;
	modelIdFilters?: string[];
}) => {
	return [
		'user_generation_full_outputs',
		userGalleryCurrentView,
		searchString ? searchString : '',
		modelIdFilters ? modelIdFilters.join(',') : ''
	];
};

export function getHistoryInfiniteQueryProps({
	userGalleryCurrentView,
	searchString,
	modelIdFilters,
	session
}: {
	userGalleryCurrentView: TUserGalleryView;
	searchString?: string;
	modelIdFilters?: string[];
	session: Session;
}): CreateInfiniteQueryOptions<
	TUserGenerationFullOutputsPage,
	unknown,
	TUserGenerationFullOutputsPage,
	TUserGenerationFullOutputsPage,
	string[]
> {
	return {
		queryKey: getHistoryInfiniteQueryKey({ userGalleryCurrentView, searchString, modelIdFilters }),
		queryFn: (lastPage) => {
			return getUserGenerationFullOutputs({
				access_token: session.access_token || '',
				cursor: lastPage?.pageParam,
				is_favorited: userGalleryCurrentView === 'favorites' ? true : undefined,
				is_liked: userGalleryCurrentView === 'likes' ? true : undefined,
				search: searchString,
				model_ids: modelIdFilters
			});
		},
		getNextPageParam: (lastPage: TUserGenerationFullOutputsPage) => {
			if (!lastPage.next) return undefined;
			return lastPage.next;
		}
	};
}
