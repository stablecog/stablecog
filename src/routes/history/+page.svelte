<script lang="ts">
	import { page } from '$app/stores';
	import GenerationFullScreen from '$components/generationFullScreen/GenerationFullScreen.svelte';
	import GenerationGrid from '$components/GenerationGrid.svelte';
	import MetaTag from '$components/MetaTag.svelte';
	import { maxImages } from '$ts/constants/indexedDb';
	import { canonicalUrl } from '$ts/constants/main';
	import { getGenerationsFromDb, updateGenerationInDb } from '$ts/queries/indexedDb';
	import { activeGeneration } from '$ts/stores/activeGeneration';
	import type { TIndexedDBGeneration } from '$ts/types/db';
	import type { TGenerationUI, TUpscaleStatus } from '$ts/types/main';
	import { onMount } from 'svelte';

	let generations: TIndexedDBGeneration[];
	let upscaleStatus: TUpscaleStatus;

	function onKeyDown({ key }: KeyboardEvent) {
		if ($activeGeneration !== undefined && upscaleStatus !== 'loading') {
			if (key === 'Escape') {
				activeGeneration.set(undefined);
			} else if (key === 'ArrowLeft') {
				const index = generations.findIndex(({ id }) => id === $activeGeneration?.id);
				if (index > 0) {
					activeGeneration.set(generations[index - 1]);
				}
			} else if (key === 'ArrowRight') {
				const index = generations.findIndex(({ id }) => id === $activeGeneration?.id);
				if (index < generations.length - 1) {
					activeGeneration.set(generations[index + 1]);
				}
			}
		}
	}

	async function onUpscale(event: CustomEvent<{ generation: TGenerationUI }>) {
		const { generation } = event.detail;
		const { imageUrl, upscaledImageUrl, computeRatePerSec, ...rest } = generation;
		try {
			await updateGenerationInDb(rest);
		} catch (error) {
			console.log('IndexDB error', error);
		}
		const index = generations.findIndex(({ id }) => id === generation.id);
		generations[index].upscaledImageDataB64 = rest.upscaledImageDataB64;
		activeGeneration.set(generation);
	}

	let startAnimation = false;

	onMount(async () => {
		setTimeout(() => {
			startAnimation = true;
		}, 500);
		generations = await getGenerationsFromDb();
	});
</script>

<MetaTag
	title="History | Stablecog"
	description="Free & easy to use AI image generator using Stable Diffusion cogs. Use one of the default servers or connect to your own."
	imageUrl="{canonicalUrl}/previews{$page.url.pathname}.png"
	canonical="{canonicalUrl}{$page.url.pathname}"
/>

<svelte:window on:keydown={onKeyDown} />

<div class="w-full flex-1 flex flex-col items-center px-2 gap-2 pt-4 md:pt-8 pb-8 md:px-8">
	{#if generations === undefined || generations.length !== 0}
		<div class="w-full max-w-7xl flex justify-center px-1.5">
			<div
				class="w-full flex flex-wrap gap-3 items-end bg-c-bg-secondary shadow-lg shadow-c-[var(--o-shadow-normal)] px-5 py-3.5 md:px-6 md:py-4.5 rounded-xl"
			>
				<p class="font-bold text-xl">
					Generations
					<span class="text-sm text-c-on-bg/50 font-semibold">({generations?.length ?? '..'})</span>
				</p>
				<p class="text-xs text-c-primary/75 font-semibold bg-c-primary/15 px-2 py-1 rounded-md">
					Last {maxImages} only
				</p>
			</div>
		</div>
	{/if}
	<div class="w-full flex-1 max-w-7xl flex flex-col">
		<GenerationGrid {generations} {startAnimation} />
	</div>
</div>

{#if $activeGeneration}
	<GenerationFullScreen bind:upscaleStatus on:upscale={onUpscale} generation={$activeGeneration} />
{/if}
