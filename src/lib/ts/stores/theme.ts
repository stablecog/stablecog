import { writable as writableLocal } from 'svelte-local-storage-store';

export let theme = writableLocal<TAvailableThemes>('theme', 'dark');

type TAvailableThemes = 'light' | 'dark';
