import type { TAvailableGenerationModelId } from '$ts/constants/generationModels';
import { derived, writable } from 'svelte/store';
import { z } from 'zod';
import { sessionWritable } from '@macfja/svelte-persistent-store';
import type { TAvailableAspectRatio } from '$ts/constants/generationSize';

export const userGalleryActionableItems = sessionWritable<TUserGalleryActionableItem[]>(
	'user_gallery_actionable_items',
	[]
);

export const userGalleryCurrentView = sessionWritable<TUserGalleryView>(
	'userGalleryCurrentView',
	'all'
);
export const userGalleryModelIdFilters = sessionWritable<TAvailableGenerationModelId[]>(
	'userGalleryModelIdFilters',
	[]
);
export const userGalleryAspectRatioFilters = sessionWritable<TAvailableAspectRatio[]>(
	'userGalleryAspectRatioFilters',
	[]
);
export const isUserGalleryEditActive = writable<boolean>(false);

export const userGallerySelectedOutputObjects = derived(
	[userGalleryActionableItems, userGalleryCurrentView],
	([$items, $userGalleryCurrentView]) => {
		return $items.filter((i) => i.view === $userGalleryCurrentView);
	}
);

export const userGallerySelectedOutputIds = derived(
	[userGallerySelectedOutputObjects],
	([$userGallerySelectedOutputObjects]) => {
		return $userGallerySelectedOutputObjects.map((i) => i.output_id);
	}
);

export interface TUserGalleryActionableItem {
	output_id: string;
	generation_id: string;
	view: TUserGalleryView;
}

export const TUserGalleryViewSchema = z.enum(['all', 'favorites', 'likes']).default('all');
export type TUserGalleryView = z.infer<typeof TUserGalleryViewSchema>;
