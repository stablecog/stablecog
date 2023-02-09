import type { TGeneration, TGenerationOutput } from '$ts/stores/generation';
import { writable } from 'svelte/store';

export const activeGeneration = writable<TGeneration | null>(null);
export const activeOutput = writable<TGenerationOutput | null>(null);
