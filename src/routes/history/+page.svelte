<script lang="ts">
	import { page } from '$app/stores';
	import GenerationGrid from '$components/GenerationGrid.svelte';
	import MetaTag from '$components/MetaTag.svelte';
	import type { TDBGeneration } from '$ts/constants/indexedDb';
	import { canonicalUrl } from '$ts/constants/main';
	import { getGenerationsFromDb } from '$ts/queries/indexedDb';
	import { onMount } from 'svelte';

	let generations: TDBGeneration[] | undefined = undefined;

	onMount(async () => {
		try {
			const generationHistory = await getGenerationsFromDb();
			generations = generationHistory;
		} catch (error) {
			console.log(error);
		}
	});
</script>

<MetaTag
	title="History | Stablecog"
	description="Create AI generated images using Stable Diffusion cogs. Connect your own instance or use one of the default servers."
	canonical="{canonicalUrl}{$page.url.pathname}"
/>

<div class="w-full flex flex-col items-center px-2 pt-2 md:px-8 md:pt-4 pb-16">
	<div class="w-full max-w-7xl flex flex-col">
		<GenerationGrid {generations} />
	</div>
</div>
