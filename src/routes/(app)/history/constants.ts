import type { TAvailableGenerationModelId } from '$ts/constants/generationModels';
import type { TAvailableAspectRatio } from '$ts/constants/generationSize';
import { getHistoryFullOutputs } from '$ts/queries/galleryLike/historyOutputs';
import type { TGalleryLikeQueryProps } from '$ts/queries/galleryLike/types';
import { sessionAndUrlParamWritable } from '$ts/stores/sessionAndUrlParamStore';
import type { TUserGalleryView } from '$ts/stores/user/gallery';
import type { Session } from '@supabase/supabase-js';

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
}): TGalleryLikeQueryProps {
	return {
		queryKey: getHistoryInfiniteQueryKey({
			userGalleryCurrentView,
			searchString,
			modelIdFilters,
			aspectRatioFilters
		}),
		queryFn: ({ pageParam }) => {
			return getHistoryFullOutputs({
				access_token: session.access_token || '',
				cursor: pageParam === undefined ? undefined : String(pageParam),
				is_favorited: userGalleryCurrentView === 'favorites' ? true : undefined,
				is_liked: userGalleryCurrentView === 'likes' ? true : undefined,
				search: searchString,
				model_ids: modelIdFilters,
				aspect_ratios: aspectRatioFilters
			});
		},
		getNextPageParam: (lastPage) => {
			if (!lastPage.next) return undefined;
			return lastPage.next;
		},
		initialPageParam: undefined,
		refetchOnMount: false
	};
}
