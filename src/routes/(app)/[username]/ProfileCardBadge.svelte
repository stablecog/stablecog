<script lang="ts">
	export let type: 'primary' | 'on-bg' = 'on-bg';
	export let text: string;
	export let icon: ConstructorOfATypedSvelteComponent;
</script>

<div class="bg-c-bg-secondary rounded-lg shadow-lg shadow-c-shadow/[var(--o-shadow-strong)]">
	<div
		class="flex items-center justify-center gap-1.5 ring-2
    px-3 py-1 rounded-lg {type === 'primary'
			? 'bg-c-primary/10 ring-c-primary/20 text-c-primary'
			: 'text-c-on-bg ring-c-bg-tertiary'}"
	>
		<svelte:component this={icon} class="w-5 h-5 -ml-0.5 flex-shrink-0" />
		<p
			class="font-medium flex flex-shrink min-w-0 overflow-ellipsis overflow-hidden {type ===
			'primary'
				? 'text-c-primary'
				: 'text-c-on-bg'}"
		>
			{text}
		</p>
	</div>
</div>
