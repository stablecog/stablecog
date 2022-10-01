import { writable as writableLocal } from 'svelte-local-storage-store';

export let iterationMpPerSec = writableLocal<number | undefined>('iterationMpPerSec', undefined);
