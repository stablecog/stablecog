import { writable as writableLocal } from 'svelte-local-storage-store';

export let advancedMode = writableLocal<boolean>('advancedMode', false);
