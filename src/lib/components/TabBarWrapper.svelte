<script lang="ts">
	import { quadOut } from 'svelte/easing';
	import { scale } from 'svelte/transition';

	export { classes as class };
	let classes = '';
</script>

<div
	in:scale|local={{ duration: 250, easing: quadOut, start: 0.75, opacity: 0 }}
	out:scale|local={{ duration: 150, easing: quadOut, start: 0.75, opacity: 0 }}
	class={classes}
>
	<slot />
</div>
