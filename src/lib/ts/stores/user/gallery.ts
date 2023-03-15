import { writable as writableLocal } from 'svelte-local-storage-store';
import { derived, writable } from 'svelte/store';

export const userGalleryActionableItems = writableLocal<TUserGalleryActionableItem[]>(
	'user_gallery_actionable_items',
	[]
);

export const lastFetchedUserGalleryView = writable<TUserGalleryView>('all');
export const userGalleryCurrentView = writableLocal<TUserGalleryView>(
	'userGalleryCurrentView',
	'all'
);
export const isUserGalleryEditActive = writable<boolean>(false);

export const userGallerySelectedIds = derived(
	[userGalleryActionableItems, userGalleryCurrentView],
	([$items, $userGalleryCurrentView]) => {
		return $items.filter((i) => i.view === $userGalleryCurrentView).map((i) => i.id);
	}
);

export interface TUserGalleryActionableItem {
	id: string;
	view: TUserGalleryView;
}

export type TUserGalleryView = 'all' | 'favorites';
