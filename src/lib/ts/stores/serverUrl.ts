import { writable as writableLocal } from 'svelte-local-storage-store';

export let serverUrl = writableLocal<string | undefined>(
	'serverUrl',
	'https://9jnibrk3rdxdrt-64410a65-5000.proxy.runpod.io'
);
