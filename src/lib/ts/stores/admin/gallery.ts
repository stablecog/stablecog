import { writable as writableLocal } from 'svelte-local-storage-store';
import { writable } from 'svelte/store';

export const adminGalleryActionableItems = writableLocal<string[]>('gallery_actionable_items', []);

export const currentAdminGalleryAction = writable<TAdminGalleryAction | undefined>(undefined);
export const isAdminGalleryEditActive = writable<boolean>(false);

export type TAdminGalleryAction = 'approve' | 'reject';
