import { writable } from 'svelte/store';

export const userGenerationFullOutputsQueryKey = writable<string[]>([]);
