import { writable } from 'svelte/store';

export const windowHeight = writable<number>(0);
export const windowWidth = writable<number>(0);
