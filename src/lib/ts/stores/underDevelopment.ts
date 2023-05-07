import { writable } from 'svelte/store';

export const underDevelopment = writable<boolean>(false);
