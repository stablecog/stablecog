import { writable as writableLocal } from 'svelte-local-storage-store';
import { writable } from 'svelte/store';

export const advancedMode = writableLocal<boolean>('advancedMode', false);
export const advancedModeApp = writable<boolean>(false);
