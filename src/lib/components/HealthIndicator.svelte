<script lang="ts">
	import { serverHealth } from '$ts/stores/serverHealth';
	export let size: TSize = 'md';
	export { classes as class };
	let classes = '';

	type TSize = 'sm' | 'md';
</script>

<div
	class="{size === 'sm' ? 'w-2 h-2' : 'w-2.5 h-2.5'} rounded-full {$serverHealth === 'loading'
		? 'bg-c-primary animate-pulse-scale'
		: $serverHealth === 'healthy'
		? 'bg-c-success'
		: $serverHealth === 'unhealthy'
		? 'bg-c-danger'
		: 'bg-c-on-bg/50'} {classes}"
/>
