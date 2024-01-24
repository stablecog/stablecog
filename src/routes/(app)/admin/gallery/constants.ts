import {
	getAllUserGenerationFullOutputs,
	type TUserGenerationFullOutputsPage
} from '$ts/queries/userGenerations';
import type { TGalleryStatus } from '$ts/stores/user/generation';
import type { CreateInfiniteQueryOptions } from '@tanstack/svelte-query';
import { writable as writableLocal } from '@macfja/svelte-persistent-store';
import type { TAvailableGenerationModelId } from '$ts/constants/generationModels';
import type { TAvailableAspectRatio } from '$ts/constants/generationSize';

export const adminGallerySearchString = writableLocal<string>('adminGallerySearchString', '');
export const adminGalleryModelIdFilters = writableLocal<TAvailableGenerationModelId[]>(
	'adminGalleryModelIdFilters',
	[]
);
export const adminGalleryAspectRatioFilters = writableLocal<TAvailableAspectRatio[]>(
	'adminGalleryAspectRatioFilters',
	[]
);

export const getAllUserGenerationFullOutputsQueryKey = ({
	adminGalleryCurrentFilter,
	searchString,
	modelIdFilters,
	aspectRatioFilters
}: {
	adminGalleryCurrentFilter: TGalleryStatus;
	searchString?: string;
	modelIdFilters?: TAvailableGenerationModelId[];
	aspectRatioFilters?: TAvailableAspectRatio[];
}) => {
	return [
		'admin_user_generation_full_outputs',
		adminGalleryCurrentFilter,
		searchString ? searchString : '',
		modelIdFilters ? modelIdFilters.sort().join(',') : '',
		aspectRatioFilters ? aspectRatioFilters.sort().join(',') : ''
	];
};

export function getAllUserGenerationFullOutputsQueryProps({
	adminGalleryCurrentFilter,
	searchString,
	modelIdFilters,
	aspectRatioFilters,
	session
}: {
	adminGalleryCurrentFilter: TGalleryStatus;
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
		queryKey: getAllUserGenerationFullOutputsQueryKey({
			adminGalleryCurrentFilter,
			searchString,
			modelIdFilters,
			aspectRatioFilters
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
				aspect_ratios: aspectRatioFilters
			});
		},
		getNextPageParam: (lastPage: TUserGenerationFullOutputsPage) => {
			if (!lastPage.next) return undefined;
			return lastPage.next;
		}
	};
}
