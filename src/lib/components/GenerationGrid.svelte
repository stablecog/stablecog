<script lang="ts">
	import Button from '$components/buttons/Button.svelte';
	import GenerationImage from '$components/GenerationImage.svelte';
	import ImagePlaceholder from '$components/ImagePlaceholder.svelte';
	import { elementreceive, elementsend } from '$ts/animation/transitions';
	import { activeGeneration } from '$ts/stores/activeGeneration';
	import type { TIndexedDBGeneration } from '$ts/types/db';
	import { MasonryInfiniteGrid } from '@egjs/svelte-infinitegrid';
	import { quadOut } from 'svelte/easing';
	import { fade } from 'svelte/transition';

	export let generations: TIndexedDBGeneration[] | undefined = undefined;
	export let loading = true;
	export let startAnimation = false;

	const batchSize = 20;
	$: items =
		generations?.slice(0, batchSize).map((_, i) => ({
			groupKey: 0,
			key: i
		})) || Array.from({ length: batchSize }, (_, i) => ({ groupKey: 0, key: i }));

	function getItems(nextGroupKey: number) {
		const nextItems = [];
		for (let i = 0; i < batchSize; ++i) {
			const nextKey = nextGroupKey * batchSize + i;
			nextItems.push({ groupKey: nextGroupKey, key: nextKey });
		}
		return nextItems;
	}
</script>

{#if loading || (generations && generations.length > 0)}
	<MasonryInfiniteGrid
		on:requestAppend={({ detail: e }) => {
			if (!generations) return;
			const nextGroupKey = (+e.groupKey || 0) + 1;
			if (items.length === generations.length) {
				return;
			}
			items = [...items, ...getItems(nextGroupKey)].slice(0, generations.length);
		}}
		resizeDebounce={1}
		gap={0}
		column={0}
		threshold={1000}
		useResizeObserver={true}
		renderOnPropertyChange={true}
		observeChildren={true}
		{items}
		let:visibleItems
	>
		{#each visibleItems as item (item.key)}
			<div class="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-0.5">
				<div class="w-full relative group">
					<ImagePlaceholder
						width={generations ? generations[item.key].width : 512}
						height={generations ? generations[item.key].height : 512}
					/>
					{#if !($activeGeneration && $activeGeneration.id === generations?.[item.key].id)}
						<div
							in:elementreceive|local={{ key: generations ? generations[item.key].id : '1' }}
							out:elementsend|local={{ key: generations ? generations[item.key].id : '1' }}
							class="absolute left-0 top-0 w-full h-full rounded-xl bg-c-bg-secondary z-0 overflow-hidden border-4 
							shadow-lg shadow-c-shadow/[var(--o-shadow-normal)] border-c-bg-secondary"
						>
							{#if loading && startAnimation}
								<div
									transition:fade|local={{ delay: 200, easing: quadOut }}
									class="absolute w-full h-full left-0 top-0 bg-c-on-bg/5 animate-pulse-faster"
								/>
							{/if}
							{#if generations}
								<GenerationImage scrollPrompt={false} generation={generations[item.key]} />
							{/if}
						</div>
					{/if}
				</div>
			</div>
		{/each}
	</MasonryInfiniteGrid>
{:else}
	<div class="w-full flex-1 flex flex-col justify-center items-center py-8 px-5 gap-8">
		<p class="text-c-on-bg/50">You didn't generate any images yet.</p>
		<Button href="/">Start Generating</Button>
		<div class="h-[2vh]" />
	</div>
{/if}
