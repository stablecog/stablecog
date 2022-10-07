import { computeRatePerSecDefault } from '$ts/constants/main';
import { writable as writableLocal } from 'svelte-local-storage-store';

export let computeRatePerSec = writableLocal<number>('computeRatePerSec', computeRatePerSecDefault);
