import type { Locales } from '$i18n/i18n-types';
import { writable as writableLocal } from 'svelte-local-storage-store';

export const language = writableLocal<Locales | undefined>('language', undefined);
