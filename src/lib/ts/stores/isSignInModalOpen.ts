import { writable } from 'svelte/store';

export const isSignInModalOpen = writable<boolean>(false);
