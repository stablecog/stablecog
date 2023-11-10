import { writable as writableLocal } from '@macfja/svelte-persistent-store';

export const lastClosedNotification = writableLocal<string | null>('lastClosedNotification', null);
