import { writable as writableLocal } from 'svelte-local-storage-store';

export let iterationMpPerSecond = writableLocal<number | undefined>(
	'iterationMpPerSecond',
	undefined
);
