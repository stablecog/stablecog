import { writable as writableLocal } from 'svelte-local-storage-store';

export const theme = writableLocal<TAvailableThemes>('theme', 'dark');

type TAvailableThemes = 'light' | 'dark';
