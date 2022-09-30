import { writable as writableLocal } from 'svelte-local-storage-store';

export let serverUrl = writableLocal<string | undefined>(
	'serverUrl',
	'https://ofkaa665bspjcx-64410ab9-5000.proxy.runpod.io'
);
