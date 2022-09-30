import { writable as writableLocal } from 'svelte-local-storage-store';

export let serverUrl = writableLocal<string | undefined>(
	'serverUrl',
	'https://9zdofw5wxo2mpt-64410a4f-5000.proxy.runpod.io'
);
