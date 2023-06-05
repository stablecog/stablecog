import { writable } from 'svelte/store';

export const allAudioPlayers = writable<Set<HTMLAudioElement>>(new Set());
