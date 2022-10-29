import { estimatedDurationUpscaleDefault } from '$ts/constants/main';
import { writable as writableLocal } from 'svelte-local-storage-store';

export const lastUpscaleDurationSec = writableLocal<number>(
	'lastUpscaleDurationSec',
	estimatedDurationUpscaleDefault
);
