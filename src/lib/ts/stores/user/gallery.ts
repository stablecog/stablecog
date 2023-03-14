import { writable as writableLocal } from 'svelte-local-storage-store';
import { derived, writable } from 'svelte/store';

export const userGalleryActionableItems = writableLocal<TUserGalleryActionableItem[]>(
	'user_gallery_actionable_items',
	[]
);
export const userGalleryView = writable<TUserGalleryView>('normal');
export const lastFetchedUserGalleryView = writable<TUserGalleryView>('normal');

export const userGalleryScheduledIds = derived(
	[userGalleryActionableItems, userGalleryView],
	([$items, $view]) => {
		return $items.filter((i) => i.view === undefined || i.view === $view).map((i) => i.id);
	}
);

export const isUserGalleryEditActive = writable<boolean>(false);

export type TAdminGalleryAction = 'approve' | 'reject';

export interface TUserGalleryActionableItem {
	id: string;
	view: TUserGalleryView;
}

export type TUserGalleryView = 'normal';
