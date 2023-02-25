<script lang="ts">
	import IconButton from '$components/buttons/IconButton.svelte';
	import { lgBreakpoint } from '$components/generationFullScreen/constants';
	import IconChevronDown from '$components/icons/IconChevronDown.svelte';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import { windowWidth } from '$ts/stores/window';
	import { quadOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	export let sidebarInnerContainerHeight: number;
	export let sidebarWrapperScrollTop: number;
	export let sidebarWrapperScrollHeight: number;
	export let sidebarWrapperHeight: number;
	export let sidebarWrapper: HTMLDivElement;

	$: showSidebarChevron =
		sidebarInnerContainerHeight !== undefined &&
		sidebarWrapperScrollTop !== undefined &&
		sidebarWrapperScrollHeight !== undefined &&
		sidebarWrapperHeight !== undefined &&
		sidebarWrapperScrollTop + 16 < sidebarWrapperScrollHeight - sidebarWrapperHeight &&
		$windowWidth >= lgBreakpoint;
</script>

{#if showSidebarChevron}
	<div
		transition:fly|local={{ duration: 200, easing: quadOut, y: 50, opacity: 0 }}
		class="absolute left-1/2 transform -translate-x-1/2 bottom-0 flex justify-center items-end p-1 z-50"
	>
		<IconButton
			name="Scroll to Sidebar Bottom"
			onClick={() => {
				if (sidebarWrapper) {
					sidebarWrapper.scrollTo({
						top: sidebarWrapperScrollHeight - sidebarWrapperHeight,
						behavior: 'smooth'
					});
				}
			}}
		>
			<div class="p-0.5">
				<IconChevronDown
					class="w-7 h-7 text-c-on-bg/40 transition {!$isTouchscreen
						? 'group-hover:text-c-primary'
						: ''}"
				/>
			</div>
		</IconButton>
	</div>
{/if}
