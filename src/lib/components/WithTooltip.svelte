<script lang="ts">
	import Button from '$components/buttons/Button.svelte';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import { createTooltip } from '@melt-ui/svelte';
	import { quadOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	export let delay = 250;
	export let closeDelay = 0;
	export let color: 'bg-secondary' | 'bg-tertiary' = 'bg-secondary';
	export let title: string | undefined = undefined;
	export let titleIcon: ConstructorOfATypedSvelteComponent | undefined = undefined;
	export let paragraph: string | undefined = undefined;
	export let noArrow = false;
	export let size: 'sm' | 'md' = 'md';
	export let gutter = -4;
	export let isActive = true;
	export let onOpened: (() => void) | undefined = undefined;
	export let onOpenChanged: ((open: boolean) => void) | undefined = undefined;
	export let buttonHref: string | undefined = undefined;
	export let buttonText: string | undefined = undefined;

	const {
		elements: { trigger, arrow, content },
		states: { open },
		options
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
		arrowSize: 20,
		openDelay: delay,
		closeDelay: closeDelay,
		closeOnPointerDown: false,
		forceVisible: true
	});

	$: [$isTouchscreen], setOptions();
	$: [$open], _onOpenChanged();

	function setOptions() {
		options.openDelay.set($isTouchscreen ? 0 : delay);
	}

	function _onOpenChanged() {
		if (onOpenChanged) {
			onOpenChanged($open);
		}
		if ($open && onOpened) {
			onOpened();
		}
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
			: 'bg-c-bg-tertiary'} {size === 'sm' ? 'text-xs' : 'text-sm'}"
		{...$content}
		use:content
	>
		{#if !noArrow}
			<div class="rounded -my-0.75" {...$arrow} use:arrow />
		{/if}
		{#if title || paragraph}
			<div class="w-full flex flex-col gap-1">
				{#if title}
					<div class="w-full flex items-center gap-1">
						{#if titleIcon}
							<svelte:component
								this={titleIcon}
								class="w-4 h-4 -mt-0.5 text-c-on-bg flex-shrink-0"
							/>
						{/if}
						<p class="flex-1 flex-shrink font-semibold text-c-on-bg">{title}</p>
					</div>
				{/if}
				{#if paragraph}
					<p class="w-full text-c-on-bg/75">{paragraph}</p>
				{/if}
				{#if buttonHref && buttonText}
					<div class="pt-1.5 pb-1">
						<Button size="sm" href={buttonHref}>{buttonText}</Button>
					</div>
				{/if}
			</div>
		{:else}
			<slot name="tooltip" />
		{/if}
	</div>
{/if}
