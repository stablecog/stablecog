<script lang="ts">
	export let element: HTMLDivElement;
	let clientWidth: number;
	let clientHeight: number;
</script>

<div
	bind:clientWidth
	bind:clientHeight
	class="w-full flex-1 flex flex-col overflow-hidden z-0 relative bg-c-primary"
>
	<div
		bind:this={element}
		class="overflow-auto"
		style="width: {clientWidth}px; height: {clientHeight}px;"
	>
		<slot />
	</div>
</div>
