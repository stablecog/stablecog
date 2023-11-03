import { writable as writableLocal } from 'svelte-local-storage-store';
import { derived, writable } from 'svelte/store';

export const userGalleryActionableItems = writableLocal<TUserGalleryActionableItem[]>(
	'user_gallery_actionable_items',
	[]
);

export const userGalleryCurrentView = writableLocal<TUserGalleryView>(
	'userGalleryCurrentView',
	'all'
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

export type TUserGalleryView = 'all' | 'favorites' | 'likes';
