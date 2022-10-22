<script lang="ts">
	import IconPulsing from '$components/icons/IconPulsing.svelte';
	import { currentServerHealthStatus } from '$ts/stores/serverHealth';
	import { quadOut } from 'svelte/easing';
	import { scale } from 'svelte/transition';

	export { classes as class };
	let classes = '';
</script>

<div transition:scale|local={{ easing: quadOut, duration: 200 }}>
	<IconPulsing
		class={classes}
		size="xs"
		status={$currentServerHealthStatus === 'loading'
			? 'loading'
			: $currentServerHealthStatus === 'healthy'
			? 'success'
			: $currentServerHealthStatus === 'unhealthy'
			? 'error'
			: 'unknown'}
	/>
</div>
