import { writable as writableLocal } from 'svelte-local-storage-store';
import { writable } from 'svelte/store';

export const theme = writableLocal<TAvailableThemes | null>('theme', null);
export const themeApp = writable<TAvailableThemes>('dark');

export type TAvailableThemes = 'light' | 'dark';
