import { writable } from 'svelte/store';

export const userGenerationFullOutputsQueryKey = writable<string[]>([]);
export const createPageUserGenerationFullOutputsQueryKey = writable<string[]>([]);
