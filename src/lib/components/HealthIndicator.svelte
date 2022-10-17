<script lang="ts">
	import IconPulsing from '$components/icons/IconPulsing.svelte';
	import { currentServerHealthStatus } from '$ts/stores/serverHealth';

	export { classes as class };
	let classes = '';
</script>

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
