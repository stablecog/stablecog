import { writable as writableLocal } from 'svelte-local-storage-store';

export const appVersion = writableLocal<string>('appVersion', 'not-set');
