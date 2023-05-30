import { writable } from 'svelte-local-storage-store';

export const wantsEmail = writable<boolean | null>('wantsEmail', null);
