import type { TDBGenerationG } from '$ts/types/db';
import { writable } from 'svelte/store';

export const activeGenerationG = writable<TDBGenerationG | undefined>(undefined);
