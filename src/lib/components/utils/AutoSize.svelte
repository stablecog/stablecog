<script lang="ts">
	export let element: HTMLDivElement | undefined = undefined;
	export let hideScroll = false;
	let clientWidth: number;
	let clientHeight: number;
</script>

<div bind:clientWidth bind:clientHeight class="w-full flex-1 min-h-0 overflow-hidden z-0 relative">
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
