import { writable } from 'svelte/store';

export const historyFullOutputsQueryKey = writable<string[]>([]);
export const generatePageHistoryFullOutputsQueryKey = writable<string[]>([]);
export const galleryFullOutputsQueryKey = writable<string[]>([]);
export const userProfileFullOutputsQueryKey = writable<string[]>([]);
