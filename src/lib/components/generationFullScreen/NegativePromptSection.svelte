<script lang="ts">
	import WithTooltip from '$components/WithTooltip.svelte';
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

<div class="w-full flex items-start text-c-danger gap-1">
	<WithTooltip
		title={$LL.Home.NegativePromptInput.Title()}
		paragraph={$LL.Home.NegativePromptInput.Paragraph()}
		let:trigger
		let:triggerStoreValue
		color="bg-tertiary"
	>
		<div tabindex="-1" use:trigger {...triggerStoreValue} class="cursor-default">
			<IconChatBubbleCancel class="w-5 h-5" />
		</div>
	</WithTooltip>
	<div
		class="flex flex-1 min-w-0 justify-start
		relative overflow-hidden -mt-0.75"
	>
		<p
			bind:this={element}
			class="w-full flex-shrink leading-normal overflow-hidden opacity-0 pointer-events-none
			overflow-ellipsis absolute whitespace-nowrap left-0 top-0 px-1"
		>
			{negativePrompt}
		</p>
		{#if isOverflowing && !isOpen}
			<button
				on:click={() => (isOpen = true)}
				class="px-1 flex-1 min-w-0 flex items-start justify-start relative rounded group/button overflow-hidden"
			>
				<div
					class="w-full h-full absolute left-0 top-0 bg-c-danger/15 rounded
					-translate-y-full transition opacity-0
					not-touch:group-hover/button:translate-y-0 not-touch:group-hover/button:opacity-100
					group-focus-visible/button:translate-y-0 group-focus-visible/button:opacity-100"
				/>
				<p
					class="flex-shrink min-w-0 leading-normal overflow-hidden overflow-ellipsis whitespace-nowrap"
				>
					{negativePrompt}
				</p>
				<div class="flex-shrink-0 flex items-center justify-center w-6 h-6">
					<IconChevronDown class=" w-5 h-5" />
				</div>
			</button>
		{:else}
			<p class="px-1 flex-shrink min-w-0 leading-normal">
				{negativePrompt}
			</p>
		{/if}
	</div>
</div>
