import { writable } from 'svelte/store';

export const maskImageDataUrl = writable<string | undefined>(undefined);
