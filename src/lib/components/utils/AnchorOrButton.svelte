<script lang="ts">
	import type { ReferenceAction } from 'svelte-floating-ui';

	export let href: string | undefined = undefined;
	export let onClick: ((e: any) => void) | undefined = undefined;
	export { classes as class };
	export let anchorPreventDefault = false;
	export let clientWidth: number | undefined = undefined;
	export let element: HTMLAnchorElement | HTMLButtonElement | undefined = undefined;
	export let ariaLabel: string | undefined = undefined;
	export let dataSveltekitPreloadData = false;
	export let floatingRef: ReferenceAction | (() => undefined) = () => undefined;

	let classes = '';
</script>

{#if href}
	{#if anchorPreventDefault}
		<a
			use:floatingRef
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
			use:floatingRef
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
	<button
		use:floatingRef
		bind:this={element}
		bind:clientWidth
		aria-label={ariaLabel}
		on:click={onClick}
		class="{classes} touch-manipulation"
	>
		<slot />
	</button>
{/if}
