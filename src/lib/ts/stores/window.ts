import { writable } from 'svelte/store';

export const windowHeight = writable<number | undefined>(undefined);
export const windowWidth = writable<number | undefined>(undefined);
