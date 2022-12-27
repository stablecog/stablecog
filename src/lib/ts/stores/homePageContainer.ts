import { writable } from 'svelte/store';

export const homePageContainer = writable<HTMLDivElement | undefined>(undefined);
