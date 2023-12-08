import { derived, get, writable } from 'svelte/store';

export function createHistoryStore<T>() {
	interface THistoryEntry {
		data: T;
		pointerForUndo: number | null;
		pointerForRedo: number | null;
	}
	const history = writable<THistoryEntry[]>([]);
	const { subscribe, update } = history;

	const hasUndo = derived(
		history,
		($history) => $history[$history.length - 1]?.pointerForUndo !== null
	);
	const hasRedo = derived(
		history,
		($history) => $history[$history.length - 1]?.pointerForRedo !== null
	);

	const addEntry = (entry: THistoryEntry) => update((n) => [...n, entry]);

	return {
		subscribe,
		addEntry: (entry: T) => {
			const lastIndex = get(history).length - 1;
			const pointerToBe = lastIndex + 1;
			addEntry({
				data: entry,
				pointerForUndo: pointerToBe > 0 ? pointerToBe - 1 : null,
				pointerForRedo: null
			});
		},
		undo: () => {
			const $history = get(history);
			if (!$history.length) return;

			const lastEntry = $history[$history.length - 1];
			if (lastEntry.pointerForUndo === null) return;

			const currentPointer = lastEntry.pointerForUndo;
			const data = $history[currentPointer].data;

			addEntry({
				data,
				pointerForUndo: currentPointer > 0 ? currentPointer - 1 : null,
				pointerForRedo: currentPointer + 1 < $history.length ? currentPointer + 1 : null
			});
		},
		redo: () => {
			const $history = get(history);
			if (!$history.length) return;

			const lastEntry = $history[$history.length - 1];
			if (lastEntry.pointerForRedo === null) return;

			const currentPointer = lastEntry.pointerForRedo;
			const data = $history[currentPointer].data;
			const pointerForUndo = currentPointer > 0 ? currentPointer - 1 : null;

			const redos = $history.map((h) => h.pointerForRedo);
			const filteredRedos = redos.filter((p) => p !== null) as number[];
			const maxPointerForRedo = Math.max(...filteredRedos);

			const pointerForRedoToBe = currentPointer + 1;
			const pointerForRedo = pointerForRedoToBe <= maxPointerForRedo ? pointerForRedoToBe : null;
			addEntry({
				data,
				pointerForUndo,
				pointerForRedo
			});
		},
		get currentState() {
			const $history = get(history);
			return $history[$history.length - 1].data;
		},
		hasUndo,
		hasRedo
	};
}
