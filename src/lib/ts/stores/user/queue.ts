import { get, writable } from 'svelte/store';

export const queue = createQueueStore([]);

export interface TQueueItem {
	created_at: string;
	id: string;
	priority: number;
	updated_at: string;
}

export function createQueueStore(initial: TQueueItem[]) {
	const queue = writable<TQueueItem[]>(initial);

	function getItemPosition(id: string | undefined) {
		if (!id) return undefined;
		const index = get(queue).findIndex((queueItem) => queueItem.id === id);
		if (index === -1) return undefined;
		return index + 1;
	}

	return {
		...queue,
		getItemPosition
	};
}
