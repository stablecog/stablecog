import { writable as writableLocal } from '@macfja/svelte-persistent-store';

export const wantsEmail = writableLocal<boolean | null>('wantsEmail', null);
