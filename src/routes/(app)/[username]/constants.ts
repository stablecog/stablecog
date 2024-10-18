import type { TAvailableGenerationModelId } from '$ts/constants/generationModels';
import {
	AvailableAspectRatiosSchema,
	type TAvailableAspectRatio
} from '$ts/constants/generationSize';
import type {
	TGalleryFullOutputsPage,
	TGalleryLikeQueryProps
} from '$ts/queries/galleryLike/types';
import { getUserProfileFullOutputs } from '$ts/queries/galleryLike/userProfileOutputs';
import { writableSessionAndUrlParam } from '$ts/stores/writableSessionAndUrlParam';
import { z } from 'zod';

export const userProfileSearchString = writableSessionAndUrlParam({
	key: 'userProfileSearchString',
	paramKey: 'q',
	defaultValue: '',
	schema: z.string()
});
export const userProfileModelIdFilters = writableSessionAndUrlParam<TAvailableGenerationModelId[]>({
	key: 'userProfileModelIdFilters',
	paramKey: 'mi',
	defaultValue: [],
	schema: z.array(z.string())
});
export const userProfileAspectRatioFilters = writableSessionAndUrlParam<TAvailableAspectRatio[]>({
	key: 'userProfileAspectRatioFilters',
	paramKey: 'ar',
	defaultValue: [],
	schema: z.array(AvailableAspectRatiosSchema)
});

export const getUserProfileInfiniteQueryKey = ({
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
		'user_profile_full_outputs',
		username,
		searchString ? searchString : '',
		modelIdFilters ? modelIdFilters.sort().join(',') : '',
		aspectRatioFilters ? aspectRatioFilters.sort().join(',') : ''
	];
};

export function getUserProfileProfileInfiniteQueryProps({
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
}): TGalleryLikeQueryProps {
	return {
		queryKey: getUserProfileInfiniteQueryKey({
			searchString,
			modelIdFilters,
			aspectRatioFilters,
			username
		}),
		queryFn: async ({ pageParam }) => {
			return getUserProfileFullOutputs({
				cursor: pageParam === undefined ? undefined : String(pageParam),
				search: searchString,
				model_ids: modelIdFilters,
				aspect_ratios: aspectRatioFilters,
				username,
				access_token: accessToken
			});
		},
		getNextPageParam: (lastPage: TGalleryFullOutputsPage) => {
			if (!lastPage.next) return undefined;
			return lastPage.next;
		},
		initialPageParam: undefined
	};
}
