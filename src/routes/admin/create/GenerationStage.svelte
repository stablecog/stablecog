<script lang="ts">
	import GenerationCard from '$routes/admin/create/GenerationCard.svelte';
	import { generationModelIdDefault } from '$ts/constants/generationModels';
	import { schedulerIdDefault } from '$ts/constants/schedulers';
	import { generateSSEId } from '$ts/helpers/generateSSEId';
	import {
		generationGuidanceScale,
		generationHeight,
		generationInferenceSteps,
		generationNumOutputs,
		generationWidth
	} from '$ts/stores/generationSettings';
	import type { TGeneration } from '$ts/stores/user/generation';

	export let stageWidth: number;
	export let stageHeight: number;

	export let generation: TGeneration = {
		is_placeholder: true,
		ui_id: generateSSEId(),
		submit_to_gallery: false,
		width: Number($generationWidth),
		height: Number($generationHeight),
		prompt: {
			id: '',
			text: ''
		},
		created_at: Date.now(),
		guidance_scale: $generationGuidanceScale,
		inference_steps: Number($generationInferenceSteps),
		model_id: generationModelIdDefault,
		scheduler_id: schedulerIdDefault,
		seed: 1,
		num_outputs: Number($generationNumOutputs),
		status: 'succeeded',
		outputs: Array.from({ length: Number($generationNumOutputs) }).map((i) => ({
			id: '',
			image_url: ''
		}))
	};

	let cols: number;
	let rows: number;
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

	let lastStageWidth: number;
	let lastStageHeight: number;
	let lastGenerationId: string | undefined;

	const animationDuration = 0.15;
	const animationEasing = 'cubic-bezier(0.45, 0, 0.55, 1)';

	$: [$generationWidth, $generationHeight, $generationNumOutputs], setPlaceholderGeneration();
	$: [stageWidth, stageHeight, generation], setDimensions();

	function setPlaceholderGeneration() {
		if (generation.is_placeholder) {
			generation.id = generateSSEId();
			generation.width = Number($generationWidth);
			generation.height = Number($generationHeight);
			generation.num_outputs = Number($generationNumOutputs);
			generation.outputs = Array.from({ length: Number($generationNumOutputs) }).map((i) => {
				return {
					id: '',
					image_url: ''
				};
			});
			generation = { ...generation };
		}
	}

	function setDimensions() {
		if (!generation) return;
		if (
			stageWidth === lastStageWidth &&
			stageHeight === lastStageHeight &&
			lastGenerationId === generation.id
		) {
			return;
		}
		const aspectRatio = generation.width / generation.height;
		cols = getOptimalColumnCount(
			stageWidth / stageHeight,
			generation.width / generation.height,
			generation.outputs.length
		);
		rows = Math.ceil(generation.outputs.length / cols);
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
		lastStageWidth = stageWidth;
		lastStageHeight = stageHeight;
		lastGenerationId = generation.id;
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
</script>

<div style="width: {stageWidth}px; height: {stageHeight}px" class="absolute">
	{#each generation.outputs as output, index}
		{@const generationWithSelectedOutput = { ...generation, selected_output: output }}
		{@const colIndex = index % cols}
		{@const rowIndex = Math.floor(index / cols)}
		<div
			style="
					width: {cardWidth}px;
					height: {cardHeight}px;
					left: {colIndex * (cardWidth + gap) + marginLeft}px;
					top: {rowIndex * (cardHeight + gap) + marginTop}px;
					transition:
						left {animationDuration}s {animationEasing},
						top {animationDuration}s {animationEasing},
						width {animationDuration}s {animationEasing},
						height {animationDuration}s {animationEasing};
				"
			class="absolute"
		>
			<GenerationCard generation={generationWithSelectedOutput} />
		</div>
	{/each}
</div>
