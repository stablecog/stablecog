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

	let imageContainerWidth = 0;
	let imageContainerHeight = 0;

	$: generationAspectRatio = generation.width / generation.height;

	$: mainContainerWidth = $windowWidth;
	$: mainContainerHeight = $windowHeight;

	$: modalMaxWidth = mainContainerWidth - 2 * mainContainerPaddingX;
	$: modalMaxHeight = mainContainerHeight - 2 * mainContainerPaddingY;

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
	class="relative w-full lg:h-full px-2.5 pt-1 pb-24 md:p-20 lg:p-0 flex lg:items-center justify-center z-10 my-auto lg:overflow-hidden"
>
	<div
		use:clickoutside={{
			callback: () => {
				if ($activeGeneration !== undefined) {
					activeGeneration.set(undefined);
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
			: 'max-w-md'} w-full lg:w-auto flex flex-col my-auto lg:flex-row bg-c-bg-secondary items-center shadow-generation-modal 
			shadow-c-shadow/[var(--o-shadow-stronger)] rounded-xl ring-2 ring-c-bg-tertiary overflow-hidden z-0 relative"
	>
		<slot {imageContainerWidth} {imageContainerHeight} {modalMinHeight} />
	</div>
</div>
