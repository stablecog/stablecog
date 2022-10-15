import { writable as writableLocal } from 'svelte-local-storage-store';

export const seed = writableLocal<number | undefined>('seed', undefined);
