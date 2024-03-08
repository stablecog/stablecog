<script lang="ts">
	import {
		lgBreakpoint,
		sidebarWidth,
		mainContainerPaddingX,
		mainContainerPaddingY
	} from '$components/generationFullScreen/constants';
	import { clickoutside } from '$ts/actions/clickoutside';
	import { activeGeneration, type TGenerationWithSelectedOutput } from '$userStores/generation';
	import { windowHeight, windowWidth } from '$ts/stores/window';

	export let generation: TGenerationWithSelectedOutput;
	export let clickoutsideExceptions: HTMLElement[];
	export let ringClass: 'ring-c-bg-tertiary' | 'ring-c-primary' = 'ring-c-bg-tertiary';

	let imageContainerWidth = 0;
	let imageContainerHeight = 0;

	$: generationAspectRatio = generation.width / generation.height;

	$: mainContainerWidth = $windowWidth;
	$: mainContainerHeight = $windowHeight;

	$: modalMaxWidth = mainContainerWidth - 2 * mainContainerPaddingX;
	$: modalMaxHeight = mainContainerHeight - 2 * mainContainerPaddingY;

	$: modalMinHeight = Math.min(modalMaxHeight, 768);

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
	class="relative z-10 my-auto flex w-full justify-center px-1.5 pb-32 pt-1 md:p-20 lg:h-full lg:items-center lg:overflow-hidden lg:p-0"
>
	<div
		use:clickoutside={{
			callback: () => {
				if ($activeGeneration !== undefined) {
					activeGeneration.set(undefined);
					window.history.back();
				}
			},
			exclude: clickoutsideExceptions
		}}
		style={$windowWidth >= lgBreakpoint
			? `max-width: ${modalMaxWidth}px; max-height: ${modalMaxHeight}px`
			: ''}
		class="{generationAspectRatio >= 1.5
			? 'max-w-2xl'
			: generationAspectRatio >= 1
				? 'max-w-xl'
				: generationAspectRatio >= 2 / 3
					? 'max-w-lg'
					: 'max-w-md'} my-auto flex w-full flex-col items-center rounded-xl bg-c-bg-secondary shadow-generation-modal shadow-c-shadow/[var(--o-shadow-stronger)]
			ring-2 lg:w-auto lg:flex-row {ringClass} relative z-0 overflow-hidden"
	>
		<slot {imageContainerWidth} {imageContainerHeight} {modalMinHeight} />
	</div>
</div>
