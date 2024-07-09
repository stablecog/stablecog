import type { TAvailableGenerationModelId } from '$ts/constants/generationModels';
import type { TAvailableAspectRatio } from '$ts/constants/generationSize';
import { getAdminFullOutputs } from '$ts/queries/galleryLike/adminOutputs';
import type {
	TGalleryFullOutputsPage,
	TGalleryLikeQueryProps
} from '$ts/queries/galleryLike/types';
import { sessionAndUrlParamWritable } from '$ts/stores/sessionAndUrlParamStore';
import type { TGalleryStatus } from '$ts/stores/user/generation';

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

export const getAdminFullOutputsQueryKey = ({
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

export function getAdminFullOutputsQueryProps({
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
}): TGalleryLikeQueryProps {
	return {
		queryKey: getAdminFullOutputsQueryKey({
			adminGalleryCurrentFilter,
			searchString,
			modelIdFilters,
			aspectRatioFilters,
			usernameFilters
		}),
		queryFn: ({ pageParam }) => {
			return getAdminFullOutputs({
				access_token: session?.access_token || '',
				cursor: pageParam === undefined ? undefined : String(pageParam),
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
		getNextPageParam: (lastPage: TGalleryFullOutputsPage) => {
			if (!lastPage.next) return undefined;
			return lastPage.next;
		},
		initialPageParam: undefined
	};
}
