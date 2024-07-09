import type {
	TGenerationFullOutput,
	TGenerationFullOutputShallow
} from '$ts/stores/user/generation';
import type {
	CreateInfiniteQueryResult,
	InfiniteData,
	InfiniteQueryObserverOptions
} from '@tanstack/svelte-query';

export interface TGalleryFullOutputsPage {
	outputs: TGenerationFullOutput[];
	next?: string | number;
	error?: string;
	total?: number;
}

export interface TGalleryFullOutputsPageShallow {
	outputs: TGenerationFullOutputShallow[];
	next?: string | number;
	error?: string;
}

export interface TUserProfileFullOutputsPage {
	outputs: TGenerationFullOutput[];
	next?: string | number;
	metadata: {
		username: string;
	};
}

export interface TUserProfileFullOutputsPageShallow {
	outputs: TGenerationFullOutputShallow[];
	next?: string | number;
	metadata: {
		username: string;
	};
}

export type TGalleryLikeQueryProps = InfiniteQueryObserverOptions<
	TGalleryFullOutputsPage,
	unknown,
	InfiniteData<TGalleryFullOutputsPage, unknown>
>;

export type TGalleryLikeCreateInfiniteQueryResult = CreateInfiniteQueryResult<
	InfiniteData<TGalleryFullOutputsPage, unknown>,
	unknown
>;
