<script lang="ts">
	import StageCard from '$components/generate/StageCard.svelte';
	import type { TIsReadyMap } from '$components/generate/types';
	import type { TGeneration } from '$ts/stores/user/generation';
	import { onMount } from 'svelte';

	export let stageWidth: number;
	export let stageHeight: number;
	export let isReadyMap: TIsReadyMap;
	export let generation: TGeneration;

	let cols: number;
	let rows: number;
	let amountOfColsNeededToBeFull: number;
	let totalColGapWidth: number;
	let totalRowGapHeight: number;
	let stageWorkableWidth: number;
	let stageWorkableHeight: number;
	let isBoundByHeight: boolean;
	let gap = 4;

	let cardWidth: number;
	let cardHeight: number;
	let marginLeft: number;
	let marginTop: number;

	let showStage = false;

	const animationDuration = 0.15;
	const animationEasing = 'cubic-bezier(0.45, 0, 0.55, 1)';

	$: [stageWidth, stageHeight, generation, isReadyMap], setDimensions();

	function setDimensions() {
		let hasNonReady = false;
		for (const key in isReadyMap) {
			// @ts-ignore
			if (!isReadyMap[key]) {
				hasNonReady = true;
				break;
			}
		}
		if (!generation || hasNonReady) return;
		const aspectRatio = generation.width / generation.height;
		cols = getOptimalColumnCount(
			stageWidth / stageHeight,
			generation.width / generation.height,
			generation.outputs.length
		);
		rows = Math.ceil(generation.outputs.length / cols);
		amountOfColsNeededToBeFull = cols * rows - generation.outputs.length;
		totalColGapWidth = (cols - 1) * gap;
		totalRowGapHeight = (rows - 1) * gap;
		stageWorkableWidth = stageWidth - totalColGapWidth;
		stageWorkableHeight = stageHeight - totalRowGapHeight;
		isBoundByHeight =
			stageWorkableHeight / (generation.height * rows) <
			stageWorkableWidth / (generation.width * cols);
		if (isBoundByHeight) {
			cardHeight = stageWorkableHeight / rows;
			cardWidth = cardHeight * aspectRatio;
		} else {
			cardWidth = stageWorkableWidth / cols;
			cardHeight = cardWidth / aspectRatio;
		}
		marginLeft = (stageWorkableWidth - cardWidth * cols) / 2;
		marginTop = (stageWorkableHeight - cardHeight * rows) / 2;
		showStage = true;
	}

	function getOptimalColumnCount(
		areaAspectRatio: number,
		cardAspectRatio: number,
		numCards: number
	): number {
		let optimalColumns = 1;
		let maxCardArea = 0;

		for (let columns = 1; columns <= numCards; columns++) {
			const rows = Math.ceil(numCards / columns);
			const columnWidth = areaAspectRatio / columns;
			const rowHeight = 1 / rows;
			const cardWidth = Math.min(columnWidth, rowHeight * cardAspectRatio);
			const cardHeight = cardWidth / cardAspectRatio;
			const cardArea = cardWidth * cardHeight;
			if (cardArea > maxCardArea) {
				maxCardArea = cardArea;
				optimalColumns = columns;
			}
		}
		return optimalColumns;
	}

	onMount(() => {
		isReadyMap.generationStage = true;
	});
</script>

<div style="width: {stageWidth}px; height: {stageHeight}px" class="absolute">
	{#if generation && showStage}
		{#each generation.outputs as output, index}
			{@const generationWithSelectedOutput = {
				...generation,
				selected_output: output
			}}
			{@const colIndex = index % cols}
			{@const rowIndex = Math.floor(index / cols)}
			<div
				style="
					width: {cardWidth}px;
					height: {cardHeight}px;
					left: {(colIndex + (rowIndex === rows - 1 ? amountOfColsNeededToBeFull / 2 : 0)) *
					(cardWidth + gap) +
					marginLeft}px;
					top: {rowIndex * (cardHeight + gap) + marginTop}px;
					transition:
						left {animationDuration}s {animationEasing},
						top {animationDuration}s {animationEasing},
						width {animationDuration}s {animationEasing},
						height {animationDuration}s {animationEasing};
				"
				class="absolute"
			>
				<StageCard generation={generationWithSelectedOutput} />
			</div>
		{/each}
	{/if}
</div>
