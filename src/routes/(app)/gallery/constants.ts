import {
	AvailableGenerationModelIdSchema,
	type TAvailableGenerationModelId
} from '$ts/constants/generationModels';
import {
	AvailableAspectRatiosSchema,
	type TAvailableAspectRatio
} from '$ts/constants/generationSize';
import { getGalleryFullOutputs } from '$ts/queries/galleryLike/galleryOutputs';
import type { TGalleryLikeQueryProps } from '$ts/queries/galleryLike/types';
import { writableSessionAndUrlParam } from '$ts/stores/writableSessionAndUrlParam';
import { z } from 'zod';

export const gallerySearchString = writableSessionAndUrlParam<string>({
	key: 'gallerySearchString',
	paramKey: 'q',
	defaultValue: '',
	schema: z.string()
});

const usernameDisallowedStartChars = ['[', ']', '{', '}', '#', '@'];
export const galleryUsernameFilters = writableSessionAndUrlParam<string[]>({
	key: 'galleryUsernameFilters',
	paramKey: 'un',
	defaultValue: [],
	schema: z.array(
		z.string().refine(
			(val) => {
				return !usernameDisallowedStartChars.some((char) => val.startsWith(char));
			},
			{
				message: `Username cannot start with disallowed characters: ${usernameDisallowedStartChars.join(', ')}`
			}
		)
	)
});

export const galleryModelIdFilters = writableSessionAndUrlParam<TAvailableGenerationModelId[]>({
	key: 'galleryModelIdFilters',
	paramKey: 'mi',
	defaultValue: [],
	schema: z.array(AvailableGenerationModelIdSchema)
});

export const galleryAspectRatioFilters = writableSessionAndUrlParam<TAvailableAspectRatio[]>({
	key: 'galleryAspectRatioFilters',
	paramKey: 'ar',
	defaultValue: [],
	schema: z.array(AvailableAspectRatiosSchema)
});

export const mainSorts = ['new', 'trending', 'top'] as const;
export const MainSortsSchema = z.enum(mainSorts);
export type TGalleryMainSort = z.infer<typeof MainSortsSchema>;
export const mainSortViewDefault: TGalleryMainSort = 'new';
export const sortsDefault: TGalleryMainSort[] = [mainSortViewDefault];
export const gallerySorts = writableSessionAndUrlParam({
	key: 'gallerySorts',
	paramKey: 'sort',
	defaultValue: sortsDefault,
	schema: z.array(MainSortsSchema).default(sortsDefault)
});

export const getGalleryInfiniteQueryKey = ({
	searchString,
	modelIdFilters,
	aspectRatioFilters,
	sorts,
	usernameFilters,
	seed
}: {
	searchString?: string | null;
	modelIdFilters?: string[] | null;
	aspectRatioFilters?: string[] | null;
	sorts?: string[];
	usernameFilters?: string[];
	seed?: number;
}): string[] => {
	return [
		'gallery_generation_full_outputs',
		searchString ? searchString : '',
		modelIdFilters ? modelIdFilters.sort().join(',') : '',
		aspectRatioFilters ? aspectRatioFilters.sort().join(',') : '',
		sorts ? sorts.join(',') : '',
		usernameFilters
			? usernameFilters
					.map((i) => i.toLowerCase())
					.sort()
					.join(',')
			: '',
		typeof seed === 'number' ? String(seed) : ''
	];
};

export function getGalleryInfiniteQueryProps({
	searchString,
	modelIdFilters,
	aspectRatioFilters,
	sorts,
	usernameFilters,
	seed,
	accessToken
}: {
	searchString?: string | null;
	modelIdFilters?: TAvailableGenerationModelId[];
	aspectRatioFilters?: string[];
	sorts?: string[];
	usernameFilters?: string[];
	seed?: number;
	accessToken?: string;
}): TGalleryLikeQueryProps {
	return {
		queryKey: getGalleryInfiniteQueryKey({
			searchString,
			modelIdFilters,
			aspectRatioFilters,
			sorts,
			usernameFilters,
			seed
		}),
		queryFn: async ({ pageParam }) => {
			return getGalleryFullOutputs({
				cursor: pageParam === undefined ? undefined : String(pageParam),
				seed,
				search: searchString,
				model_ids: modelIdFilters,
				aspect_ratios: aspectRatioFilters,
				sorts,
				username_filters: usernameFilters,
				accessToken
			});
		},
		getNextPageParam: (lastPage) => {
			if (!lastPage.next) return undefined;
			return lastPage.next;
		},
		initialPageParam: undefined
	};
}
