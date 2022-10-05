import { writable as writableLocal } from 'svelte-local-storage-store';

export let seed = writableLocal<number | undefined>('seed', undefined);
