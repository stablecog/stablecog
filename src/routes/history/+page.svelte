<script lang="ts">
	import GenerationGrid from '$components/GenerationGrid.svelte';
	import type { TDBGeneration } from '$ts/constants/indexedDb';
	import { getGenerationsFromDb } from '$ts/queries/indexedDb';
	import { onMount } from 'svelte';

	let generations: TDBGeneration[] = [];

	onMount(async () => {
		try {
			const generationHistory = await getGenerationsFromDb();
			generations = generationHistory;
		} catch (error) {
			console.log(error);
		}
	});
</script>

<div class="w-full flex flex-col items-center px-4 pb-16">
	<div class="w-full max-w-7xl flex flex-col">
		<GenerationGrid {generations} />
	</div>
</div>
