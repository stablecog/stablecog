import {
	AvailableGenerationModelIdSchema,
	type TAvailableGenerationModelId
} from '$ts/constants/generationModels';
import {
	AvailableAspectRatiosSchema,
	type TAvailableAspectRatio
} from '$ts/constants/generationSize';
import { getAdminFullOutputs } from '$ts/queries/galleryLike/adminOutputs';
import type {
	TGalleryFullOutputsPage,
	TGalleryLikeQueryProps
} from '$ts/queries/galleryLike/types';
import { writableSessionAndUrlParam } from '$ts/stores/writableSessionAndUrlParam';
import type { TGalleryStatus } from '$ts/stores/user/generation';
import { z } from 'zod';

export const adminGallerySearchString = writableSessionAndUrlParam<string>({
	key: 'adminGallerySearchString',
	paramKey: 'q',
	defaultValue: '',
	schema: z.string()
});
export const adminGalleryModelIdFilters = writableSessionAndUrlParam<TAvailableGenerationModelId[]>(
	{
		key: 'adminGalleryModelIdFilters',
		paramKey: 'mi',
		defaultValue: [],
		schema: z.array(AvailableGenerationModelIdSchema)
	}
);
const usernameDisallowedStartChars = ['[', ']', '{', '}', '#', '@'];
export const adminGalleryUsernameFilters = writableSessionAndUrlParam<string[]>({
	key: 'adminGalleryUsernameFilters',
	paramKey: 'un',
	defaultValue: [],
	schema: z.array(
		z.string().refine(
			(val) => {
				return !usernameDisallowedStartChars.some((char) => val.startsWith(char));
			},
			{ message: 'Username cannot start with disallowed characters' }
		)
	)
});
export const adminGalleryAspectRatioFilters = writableSessionAndUrlParam<TAvailableAspectRatio[]>({
	key: 'adminGalleryAspectRatioFilters',
	paramKey: 'ar',
	defaultValue: [],
	schema: z.array(AvailableAspectRatiosSchema)
});

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
