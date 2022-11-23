<script lang="ts">
	import IconChevronDown from '$components/icons/IconChevronDown.svelte';
	import { quadOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	export { classes as class };
	export let clientHeight: number | undefined = undefined;
	let classes = 'w-full relative';
	let container: HTMLDivElement;
	const showChevronPadding = 12;

	$: containerScrollTop = container?.scrollTop;
	$: containerScrollHeight = container?.scrollHeight;
	$: showChevron =
		containerScrollTop !== undefined &&
		containerScrollHeight !== undefined &&
		clientHeight !== undefined &&
		containerScrollHeight - containerScrollTop > clientHeight + showChevronPadding;
</script>

<div class="w-full relative">
	<div
		bind:clientHeight
		on:scroll={() => {
			containerScrollTop = container?.scrollTop;
			containerScrollHeight = container?.scrollHeight;
		}}
		bind:this={container}
		class={classes}
	>
		<slot />
	</div>
	{#if showChevron}
		<div
			transition:fly|local={{ duration: 200, easing: quadOut, y: 40, opacity: 0 }}
			class="absolute left-1/2 transform -translate-x-1/2 bottom-0 flex justify-center items-end p-2 z-50
      pointer-events-none"
		>
			<IconChevronDown class="w-6 h-6 text-c-on-bg/25 transition" />
		</div>
	{/if}
</div>
