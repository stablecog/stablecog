import type { TAvailableGuidanceScales } from '$ts/constants/main';
import { writable as writableLocal } from 'svelte-local-storage-store';

export let guidanceScale = writableLocal<TAvailableGuidanceScales>('guidanceScale', '7');
