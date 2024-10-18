import { writableLocal } from '$ts/stores/writableLocal';
import { writable } from 'svelte/store';
import { z } from 'zod';

const themeSchema = z.enum(['light', 'dark']).nullable();

export const theme = writableLocal<TAvailableTheme | null>({
	key: 'theme',
	defaultValue: null,
	schema: themeSchema
});
export const themeApp = writable<TAvailableTheme>('dark');

export type TAvailableTheme = z.infer<typeof themeSchema>;
