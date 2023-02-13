import { writable } from 'svelte/store';

export let sse = writable<EventSource | null>(null);
export let sseId = writable<string | null>(null);
