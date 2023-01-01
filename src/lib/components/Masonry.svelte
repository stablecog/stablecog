<script lang="ts">
	import { tick } from 'svelte';
	import IntersectionObserver from 'svelte-intersection-observer';

	type T = $$Generic;
	type TItem = T & { id: string };
	export let items: TItem[];
	export let cols = 6;
	export let hasMore = true;
	export let loadMore: () => Promise<void>;

	let itemsExtended: IItemsExtended[] = [];
	let bottomElement: HTMLDivElement;
	let containerWidth: number;
	let colHeights = Array.from({ length: cols }, () => 0);
	let intersecting = false;

	$: tallestColumnHeight = Math.max(...colHeights);

	interface IItemsExtended {
		item: TItem;
		element: HTMLElement | undefined;
		width: number;
		marginTop: number;
		marginLeft: number;
	}

	let counter = 0;

	$: [containerWidth, items], render();
	async function render() {
		if (!containerWidth || !items) return;
		counter++;
		console.log(`called render() #${counter}`);
		const itemWidth = containerWidth / cols;
		for (let i = 0; i < items.length; i++) {
			if (itemsExtended[i] && itemsExtended[i].item.id === items[i].id) continue;
			const item = { ...items[i] };
			const shortestCol = colHeights.indexOf(Math.min(...colHeights));
			const colHeight = colHeights[shortestCol];
			const itemExtended: IItemsExtended = {
				item,
				element: undefined,
				width: itemWidth,
				marginTop: colHeight,
				marginLeft: shortestCol * itemWidth
			};
			itemsExtended = [...itemsExtended, itemExtended];
			await tick();
			while (!itemExtended.element) {
				await new Promise((resolve) => setTimeout(resolve, 100));
			}
			if (!itemExtended.element) return;
			colHeights[shortestCol] += itemExtended.element.clientHeight;
			await new Promise((resolve) => setTimeout(resolve, 25));
		}
	}

	$: [intersecting], _loadMore();

	let isLoading = false;
	async function _loadMore() {
		if (isLoading || !hasMore) return;
		isLoading = true;
		try {
			await loadMore();
		} catch (error) {
			console.log(error);
		} finally {
			isLoading = false;
		}
	}
</script>

<div class="w-full flex flex-col">
	<div style="height: {tallestColumnHeight}px" bind:clientWidth={containerWidth} class="w-full">
		{#each itemsExtended as itemExtended, index}
			<div
				bind:this={itemExtended.element}
				style="width: {itemExtended.width}px; position: absolute; margin-top: {itemExtended.marginTop}px; margin-left: {itemExtended.marginLeft}px;"
			>
				<slot item={itemExtended.item} {index} />
			</div>
		{/each}
	</div>
	<IntersectionObserver bind:intersecting element={bottomElement}>
		<div bind:this={bottomElement} class="w-full" />
	</IntersectionObserver>
</div>
