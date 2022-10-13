<script lang="ts">
	import { page } from '$app/stores';
	import GenerationGrid from '$components/GenerationGrid.svelte';
	import MetaTag from '$components/MetaTag.svelte';
	import { canonicalUrl } from '$ts/constants/main';
	import { getGenerationsFromDb } from '$ts/queries/indexedDb';
	// @ts-ignore
	import { liveQuery } from 'dexie';

	let generations = liveQuery(getGenerationsFromDb);
</script>

<MetaTag
	title="History | Stablecog"
	description="Free & easy to use AI image generator using Stable Diffusion cogs. Use one of the default servers or connect to your own."
	imageUrl="{canonicalUrl}/previews{$page.url.pathname}.png"
	canonical="{canonicalUrl}{$page.url.pathname}"
/>

<div class="w-full flex-1 flex flex-col items-center px-2 gap-2 pt-2 md:px-8 md:pt-4 pb-8">
	{#if $generations === undefined || $generations.length !== 0}
		<div class="w-full max-w-7xl flex justify-center px-1.5">
			<div
				class="w-full flex bg-c-bg-secondary shadow-lg shadow-c-[var(--o-shadow-normal)] justify-start px-5 py-3.5 md:px-6 md:py-4.5 rounded-xl"
			>
				<p class="font-bold text-xl">
					Generations{#if $generations?.length}
						<span class="text-sm text-c-on-bg/50 font-medium">&nbsp;({$generations?.length})</span>
					{/if}
				</p>
			</div>
		</div>
	{/if}
	<div class="w-full flex-1 max-w-7xl flex flex-col">
		<GenerationGrid generations={$generations} />
	</div>
</div>
