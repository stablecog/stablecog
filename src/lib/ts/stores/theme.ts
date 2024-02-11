import { writable as writableLocal } from '@macfja/svelte-persistent-store';
import { writable } from 'svelte/store';

export const theme = writableLocal<TAvailableTheme | null>('theme', null);
export const themeApp = writable<TAvailableTheme>('dark');

export type TAvailableTheme = 'light' | 'dark';
