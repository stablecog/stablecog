import { writableLocal } from '$ts/stores/writableLocal';
import { writable } from 'svelte/store';
import { z } from 'zod';

export const isLeftSidebarHidden = writableLocal<boolean>({
	key: 'isLeftSidebarHidden',
	defaultValue: false,
	schema: z.boolean()
});
export const isLeftSidebarHiddenApp = writable(false);
export const isRightSidebarHidden = writableLocal<boolean>({
	key: 'isRightSidebarHidden',
	defaultValue: false,
	schema: z.boolean()
});
