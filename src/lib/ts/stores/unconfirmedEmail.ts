import { writable } from 'svelte/store';

export const unconfirmedEmail = writable<string | null>(null);
