<script lang="ts">
	import IconChevronDown from '$components/icons/IconChevronDown.svelte';
	import { quadOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	export { classes as class };
	export let clientHeight: number | undefined = undefined;
	export let withFade = false;
	let classes = 'w-full relative';
	let container: HTMLDivElement;
	const showChevronPadding = 12;
	let showChevron = false;

	$: containerScrollTop = container?.scrollTop;
	$: containerScrollHeight = container?.scrollHeight;
	$: [clientHeight], setContainerValues();
	$: [containerScrollTop, containerScrollHeight, clientHeight], setShowChevron();

	const setContainerValues = () => {
		if (container) {
			containerScrollTop = container.scrollTop;
			containerScrollHeight = container.scrollHeight;
		}
	};
	const setShowChevron = () => {
		if (
			containerScrollHeight !== undefined &&
			containerScrollTop !== undefined &&
			clientHeight !== undefined
		) {
			showChevron = containerScrollHeight - containerScrollTop - clientHeight > showChevronPadding;
		}
	};
</script>

<div class="w-full flex flex-col flex-1 min-h-0 relative">
	<div
		bind:clientHeight
		on:scroll={() => {
			containerScrollTop = container?.scrollTop;
			containerScrollHeight = container?.scrollHeight;
		}}
		bind:this={container}
		class="{classes} overflow-auto flex-1 min-h-0"
	>
		<slot />
	</div>
	{#if showChevron}
		<div
			transition:fly={{ duration: 200, easing: quadOut, y: 40, opacity: 0 }}
			class=" {withFade
				? 'w-full bg-gradient-to-t from-c-bg-secondary to-c-bg-secondary/0 pt-6'
				: ''} absolute left-1/2 transform -translate-x-1/2 bottom-0 flex justify-center items-end p-2 z-50
      	pointer-events-none"
		>
			<IconChevronDown class="w-6 h-6 text-c-on-bg/60 transition" />
		</div>
	{/if}
</div>
