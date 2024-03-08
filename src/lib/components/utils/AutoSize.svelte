<script lang="ts">
	export let element: HTMLDivElement | undefined = undefined;
	export let hideScroll = false;
	let clientWidth: number;
	let clientHeight: number;
</script>

<div bind:clientWidth bind:clientHeight class="relative z-0 min-h-0 w-full flex-1 overflow-hidden">
	<div
		bind:this={element}
		style="width: {clientWidth ? `${clientWidth}px` : '100%'}; height: {clientHeight
			? `${clientHeight}px`
			: '100%'}"
		class="overflow-auto {hideScroll ? 'hide-scrollbar' : ''}"
	>
		<slot {clientWidth} {clientHeight} />
	</div>
</div>
