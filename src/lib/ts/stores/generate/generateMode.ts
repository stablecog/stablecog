import { writable } from 'svelte/store';

export const generateMode = writable<TGenerateMode>('normal');

type TGenerateMode = 'normal' | 'inpainting';
