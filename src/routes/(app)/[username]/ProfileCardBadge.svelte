<script lang="ts">
	export let type: 'primary' | 'on-bg' = 'on-bg';
	export let text: string;
	export let icon: ConstructorOfATypedSvelteComponent;
</script>

<div class="rounded-lg bg-c-bg-secondary shadow-lg shadow-c-shadow/[var(--o-shadow-strong)]">
	<div
		class="flex items-center justify-center gap-1.5 rounded-lg
    px-3 py-1 ring-2 {type === 'primary'
			? 'bg-c-primary/10 text-c-primary ring-c-primary/20'
			: 'text-c-on-bg ring-c-bg-tertiary'}"
	>
		<svelte:component this={icon} class="-ml-0.5 h-5 w-5 flex-shrink-0" />
		<p
			class="flex min-w-0 flex-shrink overflow-hidden overflow-ellipsis font-medium {type ===
			'primary'
				? 'text-c-primary'
				: 'text-c-on-bg'}"
		>
			{text}
		</p>
	</div>
</div>
