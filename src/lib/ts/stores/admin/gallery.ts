import type { TGalleryStatus } from '$ts/stores/user/generation';
import { writable as writableLocal } from 'svelte-local-storage-store';
import { derived, writable } from 'svelte/store';

export const adminGalleryActionableItems = writableLocal<TAdminGalleryActionableItem[]>(
	'admin_gallery_actionable_items',
	[]
);
export const adminGalleryCurrentFilter = writable<TGalleryStatus>('submitted');
export const allUserGenerationFullOutputsQueryKey = writable<string[]>(undefined);

export const adminGallerySelectedOutputObjects = derived(
	[adminGalleryActionableItems, adminGalleryCurrentFilter],
	([$items, $filter]) => {
		return $items.filter((i) => i.filter === undefined || i.filter === $filter);
	}
);

export const adminGallerySelectedOutputIds = derived(
	[adminGallerySelectedOutputObjects],
	([$adminGallerySelectedOutputObjects]) => {
		return $adminGallerySelectedOutputObjects.map((i) => i.output_id);
	}
);

export const isAdminGalleryEditActive = writable<boolean>(false);

export type TAdminGalleryAction = 'approve' | 'reject';

export interface TAdminGalleryActionableItem {
	output_id: string;
	generation_id: string;
	filter: TGalleryStatus;
}
