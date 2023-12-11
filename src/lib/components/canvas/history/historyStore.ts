import { derived, get, writable } from 'svelte/store';

export function createHistoryStore<T>() {
	interface THistoryEntry {
		data: T;
		undoPointer: number | null;
		redoPointer: number | null;
	}
	const history = writable<THistoryEntry[]>([]);
	const { subscribe, update } = history;

	const hasUndo = derived(
		history,
		($history) => $history[$history.length - 1]?.undoPointer !== null
	);
	const hasRedo = derived(
		history,
		($history) => $history[$history.length - 1]?.redoPointer !== null
	);
	const currentState = derived(history, ($history) =>
		$history.length ? $history[$history.length - 1]?.data : null
	);

	const addEntry = (entry: THistoryEntry) => update((n) => [...n, entry]);

	return {
		history: {
			subscribe,
			addEntry: (entry: T) => {
				const lastIndex = get(history).length - 1;
				const pointerToBe = lastIndex + 1;
				addEntry({
					data: entry,
					undoPointer: pointerToBe > 0 ? pointerToBe - 1 : null,
					redoPointer: null
				});
			},
			undo: () => {
				const $history = get(history);
				if (!$history.length) return;

				const lastEntry = $history[$history.length - 1];
				if (lastEntry.undoPointer === null) return;

				const currentPointer = lastEntry.undoPointer;

				addEntry({
					data: $history[currentPointer].data,
					undoPointer: currentPointer > 0 ? currentPointer - 1 : null,
					redoPointer: currentPointer + 1 < $history.length ? currentPointer + 1 : null
				});
			},
			redo: () => {
				const $history = get(history);
				if (!$history.length) return;

				const currentEntry = $history[$history.length - 1];
				if (currentEntry.redoPointer === null) return;

				const currentPointer = currentEntry.redoPointer;
				const currentData = $history[currentPointer].data;
				const undoPointer = currentPointer > 0 ? currentPointer - 1 : null;

				const redoPointers = $history
					.map((h) => h.redoPointer)
					.filter((p) => p !== null) as number[];
				const maxredoPointer = Math.max(...redoPointers);

				const redoPointerToBe = currentPointer + 1;
				const redoPointer = redoPointerToBe <= maxredoPointer ? redoPointerToBe : null;

				addEntry({
					data: currentData,
					undoPointer,
					redoPointer
				});
			},
			reset: () => {
				history.set([]);
			}
		},
		hasUndo,
		hasRedo,
		currentState
	};
}
