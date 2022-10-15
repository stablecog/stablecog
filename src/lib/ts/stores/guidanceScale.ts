import { guidanceScaleDefault } from '$ts/constants/main';
import { writable as writableLocal } from 'svelte-local-storage-store';

export const guidanceScale = writableLocal<number>('guidanceScale', guidanceScaleDefault);
