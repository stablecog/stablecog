import { writable } from 'svelte/store';

export const isDrawerOpen = writable<boolean>(false);

export const closeDrawer = () => isDrawerOpen.set(false);
