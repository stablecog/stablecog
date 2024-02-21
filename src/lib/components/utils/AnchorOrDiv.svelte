<script lang="ts">
	export let href: string | undefined = undefined;
	export let onClick: ((e: any) => void) | undefined = undefined;
	export { classes as class };
	export let anchorPreventDefault = false;
	export let clientWidth: number | undefined = undefined;
	export let element: HTMLAnchorElement | HTMLDivElement | undefined = undefined;
	export let ariaLabel: string | undefined = undefined;
	export let dataSveltekitPreloadData = false;

	let classes = '';
</script>

{#if href}
	{#if anchorPreventDefault}
		<a
			bind:this={element}
			bind:clientWidth
			aria-label={ariaLabel}
			data-sveltekit-preload-data={dataSveltekitPreloadData ? 'hover' : undefined}
			on:click|preventDefault={onClick}
			{href}
			class={classes}
		>
			<slot />
		</a>
	{:else}
		<a
			bind:this={element}
			bind:clientWidth
			aria-label={ariaLabel}
			data-sveltekit-preload-data={dataSveltekitPreloadData ? 'hover' : undefined}
			on:click={onClick}
			{href}
			class={classes}
		>
			<slot />
		</a>
	{/if}
{:else}
	<div
		bind:this={element}
		bind:clientWidth
		aria-label={ariaLabel}
		role="button"
		tabindex="0"
		on:keydown={() => null}
		on:click={onClick}
		class="{classes} hover:cursor-pointer touch-manipulation"
	>
		<slot />
	</div>
{/if}
