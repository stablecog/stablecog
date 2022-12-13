import { writable as writableLocal } from 'svelte-local-storage-store';

export const lastClosedNotification = writableLocal<string | null>('lastClosedNotification', null);
