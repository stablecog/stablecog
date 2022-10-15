import { writable as writableLocal } from 'svelte-local-storage-store';

export const advancedMode = writableLocal<boolean>('advancedMode', false);
