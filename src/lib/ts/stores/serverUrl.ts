import { PUBLIC_DEFAULT_SERVER_URL } from '$env/static/public';
import { writable as writableLocal } from 'svelte-local-storage-store';

export const serverUrl = writableLocal<string | undefined>(
	'serverUrl',
	PUBLIC_DEFAULT_SERVER_URL ?? undefined
);
