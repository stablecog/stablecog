<script lang="ts">
	import IconFire from '$components/icons/IconFire.svelte';
	import IconGraph from '$components/icons/IconGraph.svelte';
	import IconNewAlt from '$components/icons/IconNewAlt.svelte';

	export let type = 'new';
	export { classes as class };
	let classes = 'w-6 h-6';
</script>

{#if type === 'trending'}
	<IconFire class={classes} />
{:else if type === 'top'}
	<IconGraph class={classes} />
{:else}
	<IconNewAlt class={classes} />
{/if}
