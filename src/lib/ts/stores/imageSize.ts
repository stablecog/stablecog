import {
	heightDefault,
	widthDefault,
	type TAvailableHeights,
	type TAvailableWidths
} from '$ts/constants/main';
import { writable as writableLocal } from 'svelte-local-storage-store';

export let imageSize = writableLocal<TImageSize>('imageSize', {
	width: widthDefault,
	height: heightDefault
});

export interface TImageSize {
	width: TAvailableWidths;
	height: TAvailableHeights;
}
