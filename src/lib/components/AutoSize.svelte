<script lang="ts">
	export let element: HTMLDivElement;
	let clientWidth: number;
	let clientHeight: number;
</script>

<div
	bind:clientWidth
	bind:clientHeight
	class="w-full flex-1 flex flex-col overflow-hidden z-0 relative"
>
	<div
		bind:this={element}
		style="width: {clientWidth}px; height: {clientHeight}px; overflow: auto;"
	>
		<slot />
	</div>
</div>
