import { AvailableAspectRatiosSchema } from '$ts/constants/generationSize';
import { writableLocal } from '$ts/stores/writableLocal';
import { writableSessionAndUrlParam } from '$ts/stores/writableSessionAndUrlParam';
import { derived, writable } from 'svelte/store';
import { z } from 'zod';

export interface TUserGalleryActionableItem {
	output_id: string;
	generation_id: string;
	view: TUserGalleryView;
}

export const TUserGalleryViewSchema = z.enum(['all', 'favorites', 'likes']).default('all');
export type TUserGalleryView = z.infer<typeof TUserGalleryViewSchema>;
export const TUserGalleryActionableItemSchema = z.object({
	output_id: z.string(),
	generation_id: z.string(),
	view: TUserGalleryViewSchema
});

export const userGalleryActionableItems = writableLocal({
	key: 'user_gallery_actionable_items',
	defaultValue: [],
	schema: z.array(TUserGalleryActionableItemSchema)
});

export const userGalleryCurrentView = writableSessionAndUrlParam({
	key: 'userGalleryCurrentView',
	paramKey: 'view',
	defaultValue: 'all',
	schema: TUserGalleryViewSchema
});
export const userGalleryModelIdFilters = writableSessionAndUrlParam({
	key: 'userGalleryModelIdFilters',
	paramKey: 'mi',
	defaultValue: [],
	schema: z.array(z.string())
});
export const userGalleryAspectRatioFilters = writableSessionAndUrlParam({
	key: 'userGalleryAspectRatioFilters',
	paramKey: 'ar',
	defaultValue: [],
	schema: z.array(AvailableAspectRatiosSchema)
});
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
