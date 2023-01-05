import { writable as writableLocal } from 'svelte-local-storage-store';

export const computeRatePerSec = writableLocal<number | null>('computeRatePerSec', null);
