<script lang="ts">
	import { quadOut } from 'svelte/easing';
	import { scale } from 'svelte/transition';

	export { classes as class };
	let classes = '';
</script>

<div
	transition:scale|local={{ duration: 200, easing: quadOut, start: 0.75, opacity: 0 }}
	class={classes}
>
	<slot />
</div>
