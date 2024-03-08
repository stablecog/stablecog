<script lang="ts">
	import WithTooltip from '$components/utils/WithTooltip.svelte';
	import IconChatBubbleCancel from '$components/icons/IconChatBubbleCancel.svelte';
	import IconChevronDown from '$components/icons/IconChevronDown.svelte';
	import LL from '$i18n/i18n-svelte';
	import { windowWidth } from '$ts/stores/window';
	import { onMount } from 'svelte';

	export let negativePrompt: string;

	let width: number;
	let element: HTMLParagraphElement;
	let scrollWidth: number;
	let isOverflowing = false;
	let isOpen = false;

	$: [$windowWidth, element, negativePrompt], setWidths();

	function setWidths() {
		if (!element) return;
		width = element.clientWidth;
		scrollWidth = element.scrollWidth;
		isOverflowing = scrollWidth > width;
	}

	onMount(() => {
		setWidths();
	});
</script>

<div class="flex w-full items-start gap-1 text-c-danger">
	<WithTooltip
		title={$LL.Home.NegativePromptInput.Title()}
		paragraph={$LL.Home.NegativePromptInput.Paragraph()}
		let:trigger
		let:triggerStoreValue
		color="bg-tertiary"
	>
		<div tabindex="-1" use:trigger {...triggerStoreValue} class="cursor-default">
			<IconChatBubbleCancel class="h-5 w-5" />
		</div>
	</WithTooltip>
	<div
		class="relative -mt-0.75 flex min-w-0
		flex-1 justify-start overflow-hidden"
	>
		<p
			bind:this={element}
			class="pointer-events-none absolute left-0 top-0 w-full flex-shrink
			overflow-hidden overflow-ellipsis whitespace-nowrap px-1 leading-normal opacity-0"
		>
			{negativePrompt}
		</p>
		{#if isOverflowing && !isOpen}
			<button
				on:click={() => (isOpen = true)}
				class="group/button relative flex min-w-0 flex-1 items-start justify-start overflow-hidden rounded px-1"
			>
				<div
					class="absolute left-0 top-0 h-full w-full -translate-y-full rounded
					bg-c-danger/15 opacity-0 transition
					group-focus-visible/button:translate-y-0 group-focus-visible/button:opacity-100
					not-touch:group-hover/button:translate-y-0 not-touch:group-hover/button:opacity-100"
				/>
				<p
					class="min-w-0 flex-shrink overflow-hidden overflow-ellipsis whitespace-nowrap leading-normal"
				>
					{negativePrompt}
				</p>
				<div class="flex h-6 w-6 flex-shrink-0 items-center justify-center">
					<IconChevronDown class="h-5 w-5" />
				</div>
			</button>
		{:else}
			<p class="min-w-0 flex-shrink px-1 leading-normal">
				{negativePrompt}
			</p>
		{/if}
	</div>
</div>
