import { writable } from 'svelte/store';
import { writable as writableLocal } from 'svelte-local-storage-store';
import type { TServerHealthStatus, TServerLocalStorage } from '$ts/types/main';

export const currentServer = writableLocal<TServerLocalStorage>('currentServer', {
	lastHealthStatus: 'unknown',
	features: undefined
});
export const currentServerHealthStatus = writable<TServerHealthStatus>('loading');

export const defaultServer = writable<TServerLocalStorage>({
	lastHealthStatus: 'unknown',
	features: undefined
});

export const defaultServerHealthStatus = writable<TServerHealthStatus>('loading');
