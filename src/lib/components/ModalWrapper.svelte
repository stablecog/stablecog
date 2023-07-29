<script lang="ts">
	import IconButton from '$components/buttons/IconButton.svelte';
	import IconCancel from '$components/icons/IconCancel.svelte';
	import { windowHeight, windowWidth } from '$ts/stores/window';
	import { onDestroy, onMount } from 'svelte';
	import { portal } from 'svelte-portal';

	export let hasPadding = true;
	export let onClose: (() => void) | undefined = undefined;
	export let scrollContainer: HTMLDivElement;
	let scrollY: number;

	function onScroll(e: any) {
		scrollY = e.currentTarget.scrollTop;
	}

	onMount(() => {
		document.body.classList.add('overflow-hidden-for-modal');
	});
	onDestroy(() => {
		document.body.classList.remove('overflow-hidden-for-modal');
	});
</script>

<div
	use:portal={'body'}
	style="width: {$windowWidth}px; height: {$windowHeight}px;"
	class="flex flex-col items-center fixed left-0
    top-0 bg-c-barrier/90 z-[1000] overflow-hidden"
/>
<div
	use:portal={'body'}
	style="width: {$windowWidth}px; height: {$windowHeight}px;"
	class="fixed left-0 top-0 overflow-hidden flex flex-col z-[1001]"
>
	<div
		bind:this={scrollContainer}
		on:scroll={onScroll}
		class="w-full min-h-full my-auto flex flex-col items-center overflow-auto {onClose
			? 'pt-15'
			: ''} {hasPadding ? 'px-4 py-16' : ''}"
	>
		<slot {scrollY} />
	</div>
	{#if onClose}
		<div
			class="absolute left-1 top-1 flex items-center justify-center transition duration-150 z-[102] rounded-full {scrollY &&
			scrollY > 0
				? 'bg-c-bg-secondary/75'
				: 'bg-c-bg-secondary/0'}"
		>
			<IconButton name="Close" onClick={onClose}>
				<IconCancel class="w-9 h-9 transition not-touch:group-hover/iconbutton:text-c-primary" />
			</IconButton>
		</div>
	{/if}
</div>
