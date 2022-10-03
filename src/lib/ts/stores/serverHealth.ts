import { writable as writableLocal } from 'svelte-local-storage-store';

export let serverHealth = writableLocal<TServerHealth>('serverHealth', 'loading');

export type TServerHealth = 'healthy' | 'unhealthy' | 'unknown' | 'loading';
