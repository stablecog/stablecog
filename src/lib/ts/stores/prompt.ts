import { writable as writableLocal } from 'svelte-local-storage-store';

export const prompt = writableLocal<string | undefined>('prompt', undefined);
export const negativePrompt = writableLocal<string | undefined>('negativePrompt', undefined);
