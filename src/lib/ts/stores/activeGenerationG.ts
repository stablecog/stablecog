import type { TGenerationGAdmin } from '$ts/types/main';
import { writable } from 'svelte/store';

export const activeGenerationG = writable<TGenerationGAdmin | undefined>(undefined);
