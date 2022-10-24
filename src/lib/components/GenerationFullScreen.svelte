<script lang="ts">
	import ModalWrapper from '$components/ModalWrapper.svelte';
	import { clickoutside } from '$ts/actions/clickoutside';
	import { elementreceive, elementsend } from '$ts/animation/transitions';
	import { containImage } from '$ts/helpers/containImage';
	import { activeGeneration } from '$ts/stores/activeGeneration';
	import { windowHeight, windowWidth } from '$ts/stores/window';
	import type { TGenerationUI } from '$ts/types/main';

	export let generation: TGenerationUI;

	const padding = 48;

	$: imageContainerDimensions = containImage(
		generation.width || 0,
		generation.height || 1,
		$windowWidth || 0,
		$windowHeight || 1,
		padding
	);

	$: id = `${generation.prompt}-${generation.seed}-${generation.duration_ms}`;
</script>

<ModalWrapper hasPadding={false}>
	<div
		style="width: {imageContainerDimensions.width}px; height: {imageContainerDimensions.height}px;"
		class="relative flex items-center z-10 my-auto"
	>
		<img
			use:clickoutside={{ callback: () => activeGeneration.set(undefined) }}
			in:elementreceive|local={{ key: id }}
			out:elementsend|local={{ key: id }}
			class="w-full h-full absolute left-0 top-0 rounded-xl"
			src={generation.imageUrl}
			alt={generation.prompt}
			width={generation.width}
			height={generation.height}
		/>
	</div>
</ModalWrapper>
