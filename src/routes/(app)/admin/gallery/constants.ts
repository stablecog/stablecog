import {
	getAllUserGenerationFullOutputs,
	type TUserGenerationFullOutputsPage
} from '$ts/queries/userGenerations';
import type { TGalleryStatus } from '$ts/stores/user/generation';
import type { CreateInfiniteQueryOptions, FetchInfiniteQueryOptions } from '@tanstack/svelte-query';

export const getAllUserGenerationFullOutputsQueryKey = ({
	adminGalleryCurrentFilter,
	searchString,
	modelIdFilters
}: {
	adminGalleryCurrentFilter: TGalleryStatus;
	searchString?: string;
	modelIdFilters?: string[];
}) => {
	return [
		'admin_user_generation_full_outputs',
		adminGalleryCurrentFilter,
		searchString ? searchString : '',
		modelIdFilters ? modelIdFilters.join(',') : ''
	];
};

export function getAllUserGenerationFullOutputsQueryProps({
	adminGalleryCurrentFilter,
	searchString,
	modelIdFilters,
	session
}: {
	adminGalleryCurrentFilter: TGalleryStatus;
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
		queryKey: getAllUserGenerationFullOutputsQueryKey({
			adminGalleryCurrentFilter,
			searchString,
			modelIdFilters
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
				model_ids: modelIdFilters
			});
		},
		getNextPageParam: (lastPage: TUserGenerationFullOutputsPage) => {
			if (!lastPage.next) return undefined;
			return lastPage.next;
		}
	};
}
