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
	class="touch-manipulation group rounded-md font-medium relative overflow-hidden ring-1.5 {color ===
	'secondary'
		? 'ring-c-secondary/25'
		: 'ring-c-primary/25'}"
>
	<div class="w-full h-full absolute bg-c-bg" />
	<div
		class="px-2 py-1 gap-1.5 flex items-center flex-row {color === 'secondary'
			? 'text-c-secondary bg-c-secondary/10'
			: 'text-c-primary bg-c-primary/10'} text-sm transition relative"
	>
		<ButtonHoverEffect size="xs" noPadding {color} hoverFrom="left" />
		{#if icon}
			<svelte:component
				this={icon}
				class="w-4 h-4 flex-shrink-0 md:-ml-0.5 {color === 'secondary'
					? 'text-c-secondary'
					: 'text-c-primary'}"
			/>
		{/if}
		<p
			class="flex-1 min-w-0 {hasMaxWidth
				? 'max-w-[9rem]'
				: 'max-w-full'} md:max-w-full whitespace-nowrap overflow-hidden overflow-ellipsis"
		>
			{text}
		</p>
		{#if hasCancelIcon}
			<IconCancel
				class="w-4 h-4 flex-shrink-0 -ml-0.5 -mr-1 {color === 'secondary'
					? 'text-c-secondary'
					: 'text-c-primary'}"
			/>
		{/if}
	</div>
</button>
