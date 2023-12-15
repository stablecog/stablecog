import { writable } from 'svelte/store';

export const generateMode = writable<TGenerateMode>('regular');

export type TGenerateMode = 'regular' | 'inpainting';
