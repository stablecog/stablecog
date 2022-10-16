<script lang="ts">
	import IconPulsing from '$components/icons/IconPulsing.svelte';
	import { serverHealth } from '$ts/stores/serverHealth';

	export { classes as class };
	let classes = '';
</script>

<IconPulsing
	class={classes}
	size="xs"
	status={$serverHealth.status === 'loading'
		? 'loading'
		: $serverHealth.status === 'healthy'
		? 'success'
		: $serverHealth.status === 'unhealthy'
		? 'error'
		: 'unknown'}
/>
