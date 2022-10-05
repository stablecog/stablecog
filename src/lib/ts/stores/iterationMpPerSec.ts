import { iterationMpPerSecDefault } from '$ts/constants/main';
import { writable as writableLocal } from 'svelte-local-storage-store';

export let iterationMpPerSec = writableLocal<number>('iterationMpPerSec', iterationMpPerSecDefault);
