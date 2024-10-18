import { writableLocal } from '$ts/stores/writableLocal';
import { writable } from 'svelte/store';
import { z } from 'zod';

export const advancedMode = writableLocal({
	key: 'advancedMode',
	defaultValue: null,
	schema: z.boolean()
});
export const advancedModeApp = writable(false);
