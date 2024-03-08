<script lang="ts">
	import ButtonHoverEffect from '$components/primitives/buttons/ButtonHoverEffect.svelte';

	export let href: string | undefined = undefined;
	export let target: '_blank' | undefined = undefined;
</script>

{#if href !== undefined}
	<a
		{href}
		{target}
		class="group relative mx-0.5 overflow-hidden rounded bg-c-primary/10 px-1
 	 py-0.25 font-mono text-c-primary ring-1.5 ring-c-primary/20"
	>
		<ButtonHoverEffect size="xs" noPadding hoverFrom="left" />
		<code>
			<slot />
		</code>
	</a>
{:else}
	<code
		class="group relative mx-0.5 overflow-hidden rounded bg-c-bg-secondary px-1
		py-0.25 font-mono text-c-on-bg ring-1.5 ring-c-bg-tertiary"
	>
		<slot />
	</code>
{/if}
