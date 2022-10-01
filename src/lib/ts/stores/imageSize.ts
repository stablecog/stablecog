import { writable as writableLocal } from 'svelte-local-storage-store';

export let imageSize = writableLocal<TImageSize>('imageSize', { width: 512, height: 512 });

export interface TImageSize {
	width: number;
	height: number;
}
