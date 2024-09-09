import { writable } from 'svelte/store';

export const loadedImages = writable<Record<string, boolean>>({});
