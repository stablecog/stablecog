<script lang="ts">
	import IconChevronDown from '$components/icons/IconChevronDown.svelte';
	import { quadOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	export { classes as class };
	export let clientHeight: number | undefined = undefined;
	export let fadeColor: 'bg' | 'bg-secondary' = 'bg-secondary';
	export let onScroll: (() => void) | undefined = undefined;
	export let scrollContainer: HTMLDivElement | undefined = undefined;

	let classes = 'w-full relative';
	const hideChevronTopDistancePercent = 20;
	const hideChevronBottomPadding = 12;
	let showChevron = false;

	$: containerScrollTop = scrollContainer?.scrollTop;
	$: containerScrollHeight = scrollContainer?.scrollHeight;
	$: [clientHeight], setContainerValues();
	$: [containerScrollTop, containerScrollHeight, clientHeight], setShowChevron();

	const setContainerValues = () => {
		if (scrollContainer) {
			containerScrollTop = scrollContainer.scrollTop;
			containerScrollHeight = scrollContainer.scrollHeight;
		}
	};
	const setShowChevron = () => {
		if (
			containerScrollHeight !== undefined &&
			containerScrollTop !== undefined &&
			clientHeight !== undefined
		) {
			const progressPercent = (containerScrollTop / (containerScrollHeight - clientHeight)) * 100;
			const distanceToBottom = containerScrollHeight - containerScrollTop - clientHeight;
			showChevron =
				progressPercent < hideChevronTopDistancePercent &&
				distanceToBottom > hideChevronBottomPadding;
		}
	};
</script>

<div class="relative flex min-h-0 w-full flex-1 flex-col">
	<div
		bind:clientHeight
		on:scroll={() => {
			containerScrollTop = scrollContainer?.scrollTop;
			containerScrollHeight = scrollContainer?.scrollHeight;
			if (onScroll) onScroll();
		}}
		bind:this={scrollContainer}
		class="{classes} min-h-0 flex-1 overflow-auto"
	>
		<slot />
	</div>
	{#if showChevron}
		<div
			transition:fly|local={{ duration: 200, easing: quadOut, y: 32, opacity: 0 }}
			class="{fadeColor === 'bg-secondary'
				? 'w-full bg-gradient-to-t from-c-bg-secondary to-c-bg-secondary/0'
				: fadeColor === 'bg'
					? 'w-full bg-gradient-to-t from-c-bg to-c-bg/0'
					: ''} pointer-events-none absolute bottom-0 left-1/2 z-50 flex -translate-x-1/2 transform items-end justify-center px-2 pb-1
      	pt-6"
		>
			<IconChevronDown strokeWidth={2} class="h-6 w-6 text-c-on-bg/75 transition" />
		</div>
	{/if}
</div>
