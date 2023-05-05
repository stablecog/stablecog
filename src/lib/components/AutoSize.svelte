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
		class="overflow-hidden relative z-0 flex flex-col flex-1"
		style="width: {clientWidth}px; height: {clientHeight}px;"
	>
		<div bind:this={element} class="w-full flex flex-col flex-1 overflow-auto">
			<slot />
		</div>
	</div>
</div>
