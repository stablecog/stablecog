import { writable } from 'svelte/store';

export const generateMode = writable<TGenerateMode>('regular');

type TGenerateMode = 'regular' | 'inpainting';
