import { computeRatePerSecDefault } from '$ts/constants/main';
import { writable as writableLocal } from 'svelte-local-storage-store';

export const computeRatePerSec = writableLocal<number>(
	'computeRatePerSec',
	computeRatePerSecDefault
);
