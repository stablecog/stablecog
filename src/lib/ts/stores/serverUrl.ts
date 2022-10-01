import { writable as writableLocal } from 'svelte-local-storage-store';

export let serverUrl = writableLocal<string | undefined>(
	'serverUrl',
	'http://peepeepoopoohootdetector3000.com:5000'
);
