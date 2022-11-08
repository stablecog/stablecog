import type { TGenerationGAdmin, TGenerationGWithLoaded } from '$ts/types/main';
import { writable } from 'svelte/store';

export const activeGenerationG = writable<TGenerationGWithLoaded | TGenerationGAdmin | undefined>(
	undefined
);
