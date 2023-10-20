import { writable } from 'svelte/store';

export const queue = writable<TQueueItem[]>([]);

export interface TQueueItem {
	created_at: string;
	id: string;
	priority: number;
	updated_at: string;
}

export function getQueuePositionFromId(id: string | undefined, queue: TQueueItem[]) {
	if (!id) return undefined;
	const index = queue.findIndex((queueItem) => queueItem.id === id);
	if (index === -1) return undefined;
	return index + 1;
}
