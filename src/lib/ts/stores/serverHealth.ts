import type { TLastServerHealth, TServerHealth } from '$ts/types/main';
import { writable as writableLocal } from 'svelte-local-storage-store';

export let serverHealth = writableLocal<TServerHealth>('serverHealth', {
	status: 'loading',
	features: undefined
});

export let lastServerHealth = writableLocal<TLastServerHealth>('lastServerHealth', {
	status: 'unknown',
	features: undefined
});

export let defaultServerHealth = writableLocal<TServerHealth>('defaultServerHealth', {
	status: 'loading',
	features: undefined
});
