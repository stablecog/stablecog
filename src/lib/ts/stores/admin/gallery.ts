import type { TGalleryStatus } from '$ts/stores/user/generation';
import { writable as writableLocal } from 'svelte-local-storage-store';
import { derived, writable } from 'svelte/store';

export const adminGalleryActionableItems = writableLocal<TAdminGalleryActionableItem[]>(
	'admin_gallery_actionable_items',
	[]
);
export const adminGalleryFilter = writable<TGalleryStatus>('submitted');
export const lastFetchedAdminGalleryFilter = writable<TGalleryStatus>('submitted');

export const adminGallerySelectedIds = derived(
	[adminGalleryActionableItems, adminGalleryFilter],
	([$items, $filter]) => {
		return $items.filter((i) => i.filter === undefined || i.filter === $filter).map((i) => i.id);
	}
);

export const isAdminGalleryEditActive = writable<boolean>(false);

export type TAdminGalleryAction = 'approve' | 'reject';

export interface TAdminGalleryActionableItem {
	id: string;
	filter: TGalleryStatus;
}
