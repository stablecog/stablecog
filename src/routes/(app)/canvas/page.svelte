<script lang="ts">
	import Canvas from '$components/canvas/Canvas.svelte';

	let clientWidth: number;
	let clientHeight: number;
</script>

<div bind:clientWidth bind:clientHeight class="flex w-full flex-1 flex-col">
	<div class="absolute left-0 top-0 h-full w-full">
		<Canvas {clientWidth} {clientHeight} />
	</div>
</div>
