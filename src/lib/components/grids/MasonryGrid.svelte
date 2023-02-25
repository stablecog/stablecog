<script lang="ts">
	import { onMount, tick } from 'svelte';

	type T = $$Generic;
	type TWithId = T & { id: string };

	export let items: TWithId[];
	export let cols = 6;

	interface TItemExtended {
		item: TWithId;
		colIndex: number;
		rowIndex: number;
		leftPercent: number;
		top: number;
		element?: HTMLDivElement;
	}
	let itemsExtended: TItemExtended[] = [];
	let height: number;
	let columnHeights = new Array(cols).fill(0);

	$: [items, cols], render();

	async function render() {
		if (!mounted) return;
		const batchSize = 10;
		for (let i = 0; i < items.length; i += batchSize) {
			const _batchSize = Math.min(batchSize, items.length - i);
			const promise = new Promise((resolve) => {
				return setTimeout(async () => {
					await renderBatch(i, _batchSize);
					resolve(true);
				}, 1);
			});
			await promise;
		}
	}

	async function renderBatch(start: number, batchSize: number) {
		for (let i = start; i < start + batchSize; i++) {
			if (itemsExtended[i]?.item?.id === items[i]?.id) {
				continue;
			}
			const shortestColumnIndex = columnHeights.indexOf(Math.min(...columnHeights));
			const itemExtended: TItemExtended = {
				item: items[i],
				colIndex: shortestColumnIndex,
				rowIndex: i % cols,
				leftPercent: (shortestColumnIndex / cols) * 100,
				top: columnHeights[shortestColumnIndex],
				element: undefined
			};
			itemsExtended = [...itemsExtended, itemExtended];
			while (!itemExtended.element) {
				await tick();
			}
			columnHeights[shortestColumnIndex] += itemsExtended[i].element?.offsetHeight;
			height = Math.max(...columnHeights);
		}
	}

	let mounted = false;
	onMount(() => {
		mounted = true;
	});
</script>

<div style="height: {height}px;" class="w-full relative">
	{#each itemsExtended as itemExtended, index (itemExtended.item.id)}
		<div
			bind:this={itemsExtended[index].element}
			class="absolute"
			style="
        width: {(1 / cols) * 100}%;
        left: {itemExtended.leftPercent}%;
        top: {itemExtended.top}px
      "
		>
			<slot item={itemExtended.item} />
		</div>
	{/each}
</div>
