<script lang="ts">
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import { createPopover, createTooltip } from '@melt-ui/svelte';
	import { quadOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	export let delay = 250;
	export let closeDelay = 50;
	export let color: 'bg-secondary' | 'bg-tertiary' = 'bg-secondary';
	export let title: string | undefined = undefined;
	export let paragraph: string | undefined = undefined;
	export let noArrow = false;
	export let size: 'sm' | 'md' = 'md';
	export let gutter = -1;
	export let isActive = true;
	export let hasPointerEvents = false;

	const {
		trigger: tooltipTrigger,
		content: tooltipContent,
		open: tooltipOpen,
		arrow: tooltipArrow
	} = createTooltip({
		positioning: {
			placement: 'bottom',
			gutter: gutter,
			overlap: true,
			offset: {
				mainAxis: 4,
				crossAxis: 4
			}
		},
		openDelay: delay,
		closeDelay: closeDelay
	});

	const {
		trigger: popoverTrigger,
		content: popoverContent,
		open: popoverOpen,
		arrow: popoverArrow
	} = createPopover({
		positioning: {
			placement: 'bottom',
			gutter: gutter,
			overlap: true,
			offset: {
				mainAxis: 4,
				crossAxis: 4
			}
		}
	});

	let trigger: typeof tooltipTrigger | typeof popoverTrigger = tooltipTrigger;
	let content: typeof tooltipContent | typeof popoverContent = tooltipContent;
	let open: typeof tooltipOpen | typeof popoverOpen = tooltipOpen;
	let arrow: typeof tooltipArrow | typeof popoverArrow = tooltipArrow;

	$: [$isTouchscreen], setTooltip();

	function setTooltip() {
		trigger = $isTouchscreen ? popoverTrigger : tooltipTrigger;
		content = $isTouchscreen ? popoverContent : tooltipContent;
		open = $isTouchscreen ? popoverOpen : tooltipOpen;
		arrow = $isTouchscreen ? popoverArrow : tooltipArrow;
	}
</script>

<slot triggerStoreValue={$trigger} {trigger} />

{#if isActive && $open}
	<div
		transition:fly={{ duration: 200, easing: quadOut, opacity: 0, y: size === 'sm' ? 8 : 16 }}
		class="max-w-[17rem] shadow-lg shadow-c-shadow/[var(--o-shadow-strong)] z-[9999] {size === 'sm'
			? 'px-2.5 py-1.25 rounded-md'
			: 'px-4 py-3 rounded-xl'} {color == 'bg-secondary'
			? 'bg-c-bg-secondary'
			: 'bg-c-bg-tertiary'} {size === 'sm' ? 'text-xs' : 'text-sm'} {hasPointerEvents
			? ''
			: 'pointer-events-none'} outline-none"
		{...$content}
		use:content
	>
		{#if !noArrow}
			<div {...$arrow} use:arrow />
		{/if}
		{#if title || paragraph}
			<div class="w-full flex flex-col gap-1">
				{#if title}
					<p class="w-full font-semibold text-c-on-bg">{title}</p>
				{/if}
				{#if paragraph}
					<p class="w-full text-c-on-bg/75">{paragraph}</p>
				{/if}
			</div>
		{:else}
			<slot name="tooltip" />
		{/if}
	</div>
{/if}
