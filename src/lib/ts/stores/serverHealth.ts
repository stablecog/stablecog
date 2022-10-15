import type { TLastServerHealth, TServerHealth } from '$ts/types/main';
import { writable as writableLocal } from 'svelte-local-storage-store';
import { derived } from 'svelte/store';

export const serverHealth = writableLocal<TServerHealth>('serverHealth', {
	status: 'loading',
	features: undefined
});
export const serverHealthStatus = derived(serverHealth, ($serverHealth) => $serverHealth.status);

export const lastServerHealth = writableLocal<TLastServerHealth>('lastServerHealth', {
	status: 'unknown',
	features: undefined
});
export const lastServerHealthStatus = derived(
	lastServerHealth,
	($lastServerHealth) => $lastServerHealth.status
);

export const defaultServerHealth = writableLocal<TServerHealth>('defaultServerHealth', {
	status: 'loading',
	features: undefined
});
