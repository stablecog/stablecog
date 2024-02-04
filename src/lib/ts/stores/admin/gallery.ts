import type { TGalleryStatus } from '$ts/stores/user/generation';
import { derived, writable } from 'svelte/store';
import { writable as writableLocal } from '@macfja/svelte-persistent-store';
import { sessionAndUrlParamWritable } from '$ts/stores/sessionAndUrlParamStore';

export const adminGalleryActionableItems = writableLocal<TAdminGalleryActionableItem[]>(
	'admin_gallery_actionable_items',
	[]
);
export const adminGalleryCurrentFilterDefault = 'submitted_best';
export const adminGalleryCurrentFilter = sessionAndUrlParamWritable<TGalleryStatus>(
	'adminGalleryCurrentView',
	'view',
	adminGalleryCurrentFilterDefault
);
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

export type TAdminGalleryAction = 'approve' | 'reject' | 'waiting_for_approval';

export interface TAdminGalleryActionableItem {
	output_id: string;
	generation_id: string;
	filter: TGalleryStatus;
}
