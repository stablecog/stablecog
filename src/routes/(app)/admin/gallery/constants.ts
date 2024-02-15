import {
	getAllUserGenerationFullOutputs,
	type TUserGenerationFullOutputsPage
} from '$ts/queries/userGenerations';
import type { TGalleryStatus } from '$ts/stores/user/generation';
import type { CreateInfiniteQueryOptions } from '@tanstack/svelte-query';
import type { TAvailableGenerationModelId } from '$ts/constants/generationModels';
import type { TAvailableAspectRatio } from '$ts/constants/generationSize';
import { sessionAndUrlParamWritable } from '$ts/stores/sessionAndUrlParamStore';

export const adminGallerySearchString = sessionAndUrlParamWritable<string>(
	'adminGallerySearchString',
	'q',
	''
);
export const adminGalleryModelIdFilters = sessionAndUrlParamWritable<TAvailableGenerationModelId[]>(
	'adminGalleryModelIdFilters',
	'mi',
	[]
);
export const adminGalleryUsernameFilters = sessionAndUrlParamWritable<string[]>(
	'adminGalleryUsernameFilters',
	'un',
	[]
);
export const adminGalleryAspectRatioFilters = sessionAndUrlParamWritable<TAvailableAspectRatio[]>(
	'adminGalleryAspectRatioFilters',
	'ar',
	[]
);

export const getAllUserGenerationFullOutputsQueryKey = ({
	adminGalleryCurrentFilter,
	searchString,
	modelIdFilters,
	aspectRatioFilters,
	usernameFilters
}: {
	adminGalleryCurrentFilter: TGalleryStatus;
	searchString?: string;
	modelIdFilters?: TAvailableGenerationModelId[];
	aspectRatioFilters?: TAvailableAspectRatio[];
	usernameFilters?: string[];
}) => {
	return [
		'admin_user_generation_full_outputs',
		adminGalleryCurrentFilter,
		searchString ? searchString : '',
		modelIdFilters ? modelIdFilters.sort().join(',') : '',
		aspectRatioFilters ? aspectRatioFilters.sort().join(',') : '',
		usernameFilters ? usernameFilters.sort().join(',') : ''
	];
};

export function getAllUserGenerationFullOutputsQueryProps({
	adminGalleryCurrentFilter,
	searchString,
	modelIdFilters,
	aspectRatioFilters,
	usernameFilters,
	session
}: {
	adminGalleryCurrentFilter: TGalleryStatus;
	searchString?: string;
	modelIdFilters?: TAvailableGenerationModelId[];
	aspectRatioFilters?: TAvailableAspectRatio[];
	usernameFilters?: string[];
	session: Session;
}): CreateInfiniteQueryOptions<
	TUserGenerationFullOutputsPage,
	unknown,
	TUserGenerationFullOutputsPage,
	TUserGenerationFullOutputsPage,
	string[]
> {
	return {
		queryKey: getAllUserGenerationFullOutputsQueryKey({
			adminGalleryCurrentFilter,
			searchString,
			modelIdFilters,
			aspectRatioFilters,
			usernameFilters
		}),
		queryFn: (lastPage) => {
			return getAllUserGenerationFullOutputs({
				access_token: session?.access_token || '',
				cursor: lastPage?.pageParam,
				gallery_status: adminGalleryCurrentFilter,
				order_by:
					adminGalleryCurrentFilter === 'approved' || adminGalleryCurrentFilter === 'rejected'
						? 'updated_at'
						: 'created_at',
				search: searchString,
				model_ids: modelIdFilters,
				aspect_ratios: aspectRatioFilters,
				username_filters: usernameFilters
			});
		},
		getNextPageParam: (lastPage: TUserGenerationFullOutputsPage) => {
			if (!lastPage.next) return undefined;
			return lastPage.next;
		}
	};
}
