<script lang="ts">
	export let element: HTMLDivElement;
	export let hideScroll = false;
	let clientWidth: number;
	let clientHeight: number;
</script>

<div bind:clientWidth bind:clientHeight class="w-full flex-1 overflow-hidden z-0 relative">
	<div
		bind:this={element}
		style="width: {clientWidth}px; height: {clientHeight}px;"
		class="overflow-auto {hideScroll ? 'hide-scrollbar' : ''}"
	>
		<slot />
	</div>
</div>
