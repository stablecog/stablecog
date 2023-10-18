<script lang="ts">
	export { classes as class };
	export let as: 'div' | 'li' = 'div';
	let classes = '';
</script>

{#if as === 'li'}
	<li class={classes}><slot /></li>
{:else}
	<div class={classes}><slot /></div>
{/if}
