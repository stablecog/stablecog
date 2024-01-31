import { getGalleryGenerationFullOutputs } from '$ts/queries/galleryLike/galleryGenerations';
import type { TUserProfileFullOutputsPage } from '$ts/queries/galleryLike/types';
import type { FetchInfiniteQueryOptions } from '@tanstack/svelte-query';
import { sessionAndUrlParamWritable } from '$ts/stores/sessionAndUrlParamStore';
import type { TAvailableGenerationModelId } from '$ts/constants/generationModels';
import type { TAvailableAspectRatio } from '$ts/constants/generationSize';

export const gallerySearchString = sessionAndUrlParamWritable<string>(
	'gallerySearchString',
	'q',
	''
);
export const galleryUsernameFilters = sessionAndUrlParamWritable<string[]>(
	'galleryUsernameFilters',
	'un',
	[]
);

export const galleryModelIdFilters = sessionAndUrlParamWritable<TAvailableGenerationModelId[]>(
	'galleryModelIdFilters',
	'mi',
	[]
);

export const galleryAspectRatioFilters = sessionAndUrlParamWritable<TAvailableAspectRatio[]>(
	'galleryAspectRatioFilters',
	'ar',
	[]
);

export const mainSortViewDefault = 'new';
export const mainSorts = ['new', 'trending', 'top'];
export const sortsDefault = [mainSortViewDefault];
export const gallerySorts = sessionAndUrlParamWritable<string[]>(
	'gallerySorts',
	'sort',
	sortsDefault
);

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
	modelIdFilters?: string[];
	aspectRatioFilters?: string[];
	sorts?: string[];
	usernameFilters?: string[];
	seed?: number;
	accessToken?: string;
}): FetchInfiniteQueryOptions<
	TUserProfileFullOutputsPage,
	unknown,
	TUserProfileFullOutputsPage,
	any
> {
	return {
		queryKey: getGalleryInfiniteQueryKey({
			searchString,
			modelIdFilters,
			aspectRatioFilters,
			sorts,
			usernameFilters,
			seed
		}),
		queryFn: async (lastPage) => {
			return getGalleryGenerationFullOutputs({
				cursor: lastPage?.pageParam,
				seed,
				search: searchString,
				model_ids: modelIdFilters,
				aspect_ratios: aspectRatioFilters,
				sorts,
				usernameFilters: usernameFilters,
				accessToken
			});
		},
		getNextPageParam: (lastPage: TUserProfileFullOutputsPage) => {
			if (!lastPage.next) return undefined;
			return lastPage.next;
		}
	};
}
