<script>
	import { onMount } from 'svelte';
	let classes = 'flex w-full flex-1 flex-col pb-3 pt-5';
	export { classes as class };

	let canShowLoader = false;

	onMount(() => {
		setTimeout(() => {
			canShowLoader = true;
		}, 600);
	});
</script>

<div class={classes}>
	<slot {canShowLoader} />
</div>
