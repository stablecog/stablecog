import { writable } from 'svelte/store';

export const globalSeed = writable<number>(Math.round(Math.random() * Math.pow(10, 12)));
