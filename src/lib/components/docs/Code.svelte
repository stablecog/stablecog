<script lang="ts">
	import ButtonHoverEffect from '$components/buttons/ButtonHoverEffect.svelte';

	export let href: string | undefined = undefined;
	export let target: '_blank' | undefined = undefined;
</script>

{#if href !== undefined}
	<a
		{href}
		{target}
		class="font-mono bg-c-primary/10 px-1 py-0.25 ring-1.5 text-c-primary rounded
 	 ring-c-primary/20 mx-0.5 relative group overflow-hidden"
	>
		<ButtonHoverEffect size="xs" noPadding hoverFrom="left" />
		<code>
			<slot />
		</code>
	</a>
{:else}
	<code
		class="font-mono bg-c-bg-secondary px-1 py-0.25 ring-1.5 text-c-on-bg rounded
		ring-c-bg-tertiary mx-0.5 relative group overflow-hidden"
	>
		<slot />
	</code>
{/if}
