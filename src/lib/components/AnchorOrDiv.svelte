<script lang="ts">
	export let href: string | undefined = undefined;
	export let onClick: ((e: any) => void) | undefined = undefined;
	export { classes as class };
	export let anchorPreventDefault = false;

	let classes = '';
</script>

{#if href}
	{#if anchorPreventDefault}
		<a on:click|preventDefault={onClick} {href} class={classes}>
			<slot />
		</a>
	{:else}
		<a on:click={onClick} {href} class={classes}>
			<slot />
		</a>
	{/if}
{:else}
	<div on:keydown={() => null} on:click={onClick} class="{classes} hover:cursor-pointer">
		<slot />
	</div>
{/if}
