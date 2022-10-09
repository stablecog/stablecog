import { writable as writableLocal } from 'svelte-local-storage-store';

export let prompt = writableLocal<string | undefined>('prompt', undefined);
export let negativePrompt = writableLocal<string | undefined>('negativePrompt', undefined);
