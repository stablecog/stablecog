<script lang="ts">
	import {
		lgBreakpoint,
		sidebarWidth,
		mainContainerMaxHeight,
		mainContainerPadding
	} from '$components/generationFullScreen/Shared';
	import { clickoutside } from '$ts/actions/clickoutside';
	import { elementreceive, elementsend } from '$ts/animation/transitions';
	import { activeGeneration } from '$ts/stores/activeGeneration';
	import { windowHeight, windowWidth } from '$ts/stores/window';
	import type { TGenerationUI } from '$ts/types/main';

	export let generation: TGenerationUI;
	export let canClose: boolean;

	let imageContainerWidth = 0;
	let imageContainerHeight = 0;

	$: generationAspectRatio = generation.width / generation.height;
	$: maxWidthConstant = generationAspectRatio >= 3 / 2 ? 1440 : 1280;

	$: mainContainerWidth = Math.min($windowWidth || 0, maxWidthConstant);
	$: mainContainerHeight = Math.min($windowHeight || 0, mainContainerMaxHeight);

	$: modalMaxWidth = mainContainerWidth - 2 * mainContainerPadding;
	$: modalMaxHeight = mainContainerHeight - 2 * mainContainerPadding;

	$: modalMinHeight = Math.min(modalMaxHeight, 575);

	$: [modalMaxWidth, modalMaxHeight, generation], setImageContainerSize();

	function setImageContainerSize() {
		if ($windowWidth && $windowWidth < lgBreakpoint) {
			imageContainerWidth = modalMaxWidth;
			imageContainerHeight = (modalMaxHeight * generation.width) / generation.height;
		} else {
			if (generation.width >= generation.height) {
				const tempWidth = modalMaxWidth - sidebarWidth;
				const tempHeight = (tempWidth * generation.height) / generation.width;
				if (tempHeight > modalMaxHeight) {
					imageContainerHeight = modalMaxHeight;
					imageContainerWidth = (imageContainerHeight / generation.height) * generation.width;
				} else {
					imageContainerWidth = tempWidth;
					imageContainerHeight = tempHeight;
				}
			} else {
				const tempHeight = modalMaxHeight;
				const tempWidth = (tempHeight * generation.width) / generation.height;
				if (tempWidth > modalMaxWidth - sidebarWidth) {
					imageContainerWidth = modalMaxWidth - sidebarWidth;
					imageContainerHeight = (imageContainerWidth / generation.width) * generation.height;
				} else {
					imageContainerWidth = tempWidth;
					imageContainerHeight = tempHeight;
				}
			}
		}
	}
</script>

<div
	style={$windowWidth >= lgBreakpoint
		? `max-width: ${mainContainerWidth}px; max-height: ${mainContainerHeight}px`
		: ''}
	class="relative w-full h-full px-3 pt-1 pb-20 md:p-20 lg:p-0 flex lg:items-center justify-center z-10 
		overflow-auto lg:my-auto lg:overflow-hidden"
>
	<div
		in:elementreceive|local={{ key: generation.id }}
		out:elementsend|local={{ key: generation.id }}
		use:clickoutside={{
			callback: () => {
				if (canClose) {
					activeGeneration.set(undefined);
				}
			}
		}}
		style={$windowWidth >= lgBreakpoint
			? `max-width: ${modalMaxWidth}px; max-height: ${modalMaxHeight}px`
			: ''}
		class="{generationAspectRatio >= 1.5
			? 'max-w-2xl'
			: generationAspectRatio >= 1
			? 'max-w-xl'
			: generationAspectRatio >= 2 / 3
			? 'max-w-md'
			: 'max-w-sm'} w-full lg:w-auto flex flex-col my-auto lg:flex-row bg-c-bg-secondary items-center shadow-generation-modal 
			shadow-c-shadow/[var(--o-shadow-stronger)] rounded-xl ring-4 ring-c-bg-tertiary overflow-hidden z-0 relative"
	>
		<slot {imageContainerWidth} {imageContainerHeight} {modalMinHeight} />
	</div>
</div>
