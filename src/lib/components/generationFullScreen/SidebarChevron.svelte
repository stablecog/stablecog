<script lang="ts">
	import IconButton from '$components/primitives/buttons/IconButton.svelte';
	import { lgBreakpoint } from '$components/generationFullScreen/constants';
	import IconChevronDown from '$components/icons/IconChevronDown.svelte';
	import { windowWidth } from '$ts/stores/window';
	import { quadOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	export let sidebarInnerContainerHeight: number;
	export let sidebarWrapperScrollTop: number;
	export let sidebarWrapperScrollHeight: number;
	export let sidebarWrapperHeight: number;
	export let sidebarWrapper: HTMLDivElement;

	const hideChevronTopDistancePercent = 25;
	const hideChevronBottomPadding = 12;

	$: progressPercent =
		sidebarInnerContainerHeight !== undefined &&
		sidebarWrapperScrollTop !== undefined &&
		sidebarWrapperScrollHeight !== undefined &&
		sidebarWrapperHeight !== undefined
			? (sidebarWrapperScrollTop / (sidebarWrapperScrollHeight - sidebarWrapperHeight)) * 100
			: undefined;
	$: distanceToBottom =
		sidebarInnerContainerHeight !== undefined &&
		sidebarWrapperScrollHeight !== undefined &&
		sidebarWrapperScrollTop !== undefined &&
		sidebarWrapperHeight !== undefined
			? sidebarWrapperScrollHeight - sidebarWrapperScrollTop - sidebarWrapperHeight
			: undefined;

	$: showSidebarChevron =
		$windowWidth >= lgBreakpoint && progressPercent !== undefined && distanceToBottom !== undefined
			? progressPercent < hideChevronTopDistancePercent &&
				distanceToBottom > hideChevronBottomPadding
			: false;
</script>

{#if showSidebarChevron}
	<div
		transition:fly={{ duration: 200, easing: quadOut, y: 50, opacity: 0 }}
		class="absolute bottom-0 left-1/2 z-50 flex -translate-x-1/2 transform items-end justify-center"
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
			<IconChevronDown
				class="h-7 w-7 text-c-on-bg/75 transition not-touch:group-hover/iconbutton:text-c-primary"
			/>
		</IconButton>
	</div>
{/if}
