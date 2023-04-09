<script lang="ts">
	import GenerationCard from '$routes/admin/create/GenerationCard.svelte';
	import type { TGeneration } from '$ts/stores/user/generation';

	export let stageWidth: number;
	export let stageHeight: number;
	export let generation: TGeneration;

	$: stageIsHorizontal = stageWidth >= stageHeight;
	$: generationIsHorizontal = generation.width >= generation.height;

	$: isBoundByHeight = stageHeight / generation.height < stageWidth / generation.width;

	let cardWidth: number;
	let cardHeight: number;
	$: [stageWidth, stageHeight, generation], setCardSize();

	function setCardSize() {
		const aspectRatio = generation.width / generation.height;
		if (isBoundByHeight) {
			cardHeight = stageHeight / 2;
			cardWidth = cardHeight * aspectRatio;
		} else {
			cardWidth = stageWidth / 2;
			cardHeight = cardWidth / aspectRatio;
		}
	}
</script>

<div style="width: {stageWidth}px; height: {stageHeight}px" class="absolute">
	{#each generation.outputs as output}
		{@const generationWithSelectedOutput = { ...generation, selected_output: output }}
		<div style="width: {cardWidth}px; height: {cardHeight}px" class="absolute">
			<GenerationCard generation={generationWithSelectedOutput} />
		</div>
	{/each}
</div>
