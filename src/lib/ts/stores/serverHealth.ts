import type { TServerHealth } from '$ts/types/main';
import { writable as writableLocal } from 'svelte-local-storage-store';

export let serverHealth = writableLocal<TServerHealth>('serverHealth', 'loading');
