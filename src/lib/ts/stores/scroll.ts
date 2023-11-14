import { writable } from 'svelte/store';

export const scrollDirection = writable<'up' | 'down'>('down');
export const notAtTheVeryTop = writable(false);
