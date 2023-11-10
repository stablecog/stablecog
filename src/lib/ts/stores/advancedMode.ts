import { writable as writableLocal } from '@macfja/svelte-persistent-store';
import { writable } from 'svelte/store';

export const advancedMode = writableLocal<boolean | null>('advancedMode', null);
export const advancedModeApp = writable<boolean>(false);
