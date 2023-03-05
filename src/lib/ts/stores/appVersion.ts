import { writable } from 'svelte/store';

export const appVersion = writable<string>('unknown');

export const serverVersion = writable<string>('unknown');
