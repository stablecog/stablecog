<script lang="ts">
	import { page } from '$app/stores';
	import GenerationFullScreen from '$components/GenerationFullScreen.svelte';
	import GenerationGrid from '$components/GenerationGrid.svelte';
	import MetaTag from '$components/MetaTag.svelte';
	import { canonicalUrl } from '$ts/constants/main';
	import { getGenerationsFromDb } from '$ts/queries/indexedDb';
	import { activeGeneration } from '$ts/stores/activeGeneration';
	import type { TIndexedDBGeneration } from '$ts/types/db';
	import { onMount } from 'svelte';

	let generations: TIndexedDBGeneration[];

	onMount(async () => {
		generations = await getGenerationsFromDb();
	});
</script>

<MetaTag
	title="History | Stablecog"
	description="Free & easy to use AI image generator using Stable Diffusion cogs. Use one of the default servers or connect to your own."
	imageUrl="{canonicalUrl}/previews{$page.url.pathname}.png"
	canonical="{canonicalUrl}{$page.url.pathname}"
/>

<div class="w-full flex-1 flex flex-col items-center px-2 gap-2 pt-4 md:pt-8 pb-8 md:px-8">
	{#if generations === undefined || generations.length !== 0}
		<div class="w-full max-w-7xl flex justify-center px-1.5">
			<div
				class="w-full flex flex-wrap gap-3 items-end bg-c-bg-secondary shadow-lg shadow-c-[var(--o-shadow-normal)] px-5 py-3.5 md:px-6 md:py-4.5 rounded-xl"
			>
				<p class="font-bold text-xl">
					Generations{#if generations?.length}
						<span class="text-sm text-c-on-bg/50 font-semibold">&nbsp;({generations?.length})</span>
					{/if}
				</p>
				<p class="text-xs text-c-primary/75 font-semibold bg-c-primary/15 px-2 py-1 rounded-md">
					Last 250 only
				</p>
			</div>
		</div>
	{/if}
	<div class="w-full flex-1 max-w-7xl flex flex-col">
		<GenerationGrid {generations} />
	</div>
</div>

{#if $activeGeneration}
	<GenerationFullScreen generation={$activeGeneration} />
{/if}
