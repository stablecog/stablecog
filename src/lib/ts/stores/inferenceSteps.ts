import type { TAvailableInferenceSteps } from '$ts/constants/main';
import { writable as writableLocal } from 'svelte-local-storage-store';

export let inferenceSteps = writableLocal<TAvailableInferenceSteps>('inferenceSteps', '50');
