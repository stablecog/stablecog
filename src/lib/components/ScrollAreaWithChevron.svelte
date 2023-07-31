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

<div class="w-full flex flex-col flex-1 min-h-0 relative">
	<div
		bind:clientHeight
		on:scroll={() => {
			containerScrollTop = scrollContainer?.scrollTop;
			containerScrollHeight = scrollContainer?.scrollHeight;
			if (onScroll) onScroll();
		}}
		bind:this={scrollContainer}
		class="{classes} overflow-auto flex-1 min-h-0"
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
				: ''} absolute left-1/2 transform -translate-x-1/2 bottom-0 flex justify-center items-end px-2 pb-1 pt-6 z-50
      	pointer-events-none"
		>
			<IconChevronDown strokeWidth={2} class="w-6 h-6 text-c-on-bg/75 transition" />
		</div>
	{/if}
</div>
