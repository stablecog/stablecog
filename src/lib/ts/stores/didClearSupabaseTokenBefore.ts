import { writable as writableLocal } from 'svelte-local-storage-store';

export const didClearSupabaseTokenBefore = writableLocal<boolean | null>(
	'didClearSupabaseTokenBefore2',
	null
);
