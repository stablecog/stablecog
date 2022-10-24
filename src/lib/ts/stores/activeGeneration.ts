import type { TGenerationUI } from '$ts/types/main';
import { writable } from 'svelte/store';

export const activeGeneration = writable<TGenerationUI | undefined>(undefined);
