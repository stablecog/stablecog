import type { TGenerationFullOutput } from '$ts/stores/user/generation';
import { writable } from 'svelte/store';

export const generationOutputForInpainting = writable<TGenerationFullOutput | null>(null);
