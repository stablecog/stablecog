import { writable as writableLocal } from 'svelte-local-storage-store';

export let theme = writableLocal<TThemeOption>('theme', 'dark');

type TThemeOption = 'light' | 'dark';
