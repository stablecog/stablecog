<script lang="ts">
	import ButtonHoverEffect from '$components/primitives/buttons/ButtonHoverEffect.svelte';
	import IconCancel from '$components/icons/IconCancel.svelte';

	export let onClick: () => void;
	export let text: string;
	export let hasCancelIcon = true;
	export let icon: ConstructorOfATypedSvelteComponent | undefined = undefined;
	export let color: 'primary' | 'secondary' = 'primary';
	export let hasMaxWidth = true;
</script>

<button
	on:click|preventDefault={onClick}
	class="group relative touch-manipulation overflow-hidden rounded-md font-medium ring-1.5 {color ===
	'secondary'
		? 'ring-c-secondary/25'
		: 'ring-c-primary/25'}"
>
	<div class="absolute h-full w-full bg-c-bg" />
	<div
		class="flex flex-row items-center gap-1.5 px-2 py-1 {color === 'secondary'
			? 'bg-c-secondary/10 text-c-secondary'
			: 'bg-c-primary/10 text-c-primary'} relative text-sm transition"
	>
		<ButtonHoverEffect size="xs" noPadding {color} hoverFrom="left" />
		{#if icon}
			<svelte:component
				this={icon}
				class="h-4 w-4 flex-shrink-0 md:-ml-0.5 {color === 'secondary'
					? 'text-c-secondary'
					: 'text-c-primary'}"
			/>
		{/if}
		<p
			class="min-w-0 flex-1 {hasMaxWidth
				? 'max-w-[9rem]'
				: 'max-w-full'} overflow-hidden overflow-ellipsis whitespace-nowrap md:max-w-full"
		>
			{text}
		</p>
		{#if hasCancelIcon}
			<IconCancel
				class="-ml-0.5 -mr-1 h-4 w-4 flex-shrink-0 {color === 'secondary'
					? 'text-c-secondary'
					: 'text-c-primary'}"
			/>
		{/if}
	</div>
</button>
