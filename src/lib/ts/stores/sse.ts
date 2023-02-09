import { writable } from 'svelte/store';

export const streamId = writable<string | null>(null);
