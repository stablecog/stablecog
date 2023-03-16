import { writable } from 'svelte/store';

export const lastClickedOutputId = writable<string | undefined>(undefined);
