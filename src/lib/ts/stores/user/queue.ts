import { writable } from 'svelte/store';

export const queue = writable<TQueueItem[]>([]);

export interface TQueueItem {
	created_at: string;
	id: string;
	priority: number;
	updated_at: string;
}
