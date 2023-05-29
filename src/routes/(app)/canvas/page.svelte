<script lang="ts">
	import Canvas from '$components/canvas/Canvas.svelte';

	let clientWidth: number;
	let clientHeight: number;
</script>

<div bind:clientWidth bind:clientHeight class="w-full flex flex-col flex-1">
	<div class="w-full h-full absolute left-0 top-0">
		<Canvas {clientWidth} {clientHeight} />
	</div>
</div>
