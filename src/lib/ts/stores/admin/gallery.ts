import { TGalleryStatusSchema, type TGalleryStatus } from '$ts/stores/user/generation';
import { derived, writable } from 'svelte/store';
import { writableSessionAndUrlParam } from '$ts/stores/writableSessionAndUrlParam';
import { writableLocal } from '$ts/stores/writableLocal';
import { z } from 'zod';

export const adminGalleryActionableItemSchema = z.object({
	output_id: z.string(),
	generation_id: z.string(),
	filter: TGalleryStatusSchema
});

export type TAdminGalleryActionableItem = z.infer<typeof adminGalleryActionableItemSchema>;

export const adminGalleryActionableItems = writableLocal({
	key: 'admin_gallery_actionable_items',
	defaultValue: [],
	schema: z.array(adminGalleryActionableItemSchema)
});
export const adminGalleryCurrentFilterDefault: TGalleryStatus = 'submitted_best';
export const adminGalleryCurrentFilter = writableSessionAndUrlParam({
	key: 'adminGalleryCurrentView',
	paramKey: 'view',
	defaultValue: adminGalleryCurrentFilterDefault,
	schema: TGalleryStatusSchema
});
export const adminFullOutputsQueryKey = writable<string[]>(undefined);

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
