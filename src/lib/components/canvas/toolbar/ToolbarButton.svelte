<script lang="ts">
	import ButtonHoverEffect from '$components/buttons/ButtonHoverEffect.svelte';

	export let label: string;
	export let icon: ConstructorOfATypedSvelteComponent;
	export let sizeClass = 'w-11 h-11';
	export let paddingClass = 'p-0.75';
	export let disabled = false;

	export let onClick: () => void;
</script>

<button
	on:click={onClick}
	class="{sizeClass} p-2 flex items-center justify-center group relative"
	aria-label={label}
	{disabled}
>
	<ButtonHoverEffect {disabled} color="on-bg" noPadding {paddingClass} size="sm" />
	<svelte:component this={icon} class="w-full h-full transition group-disabled:opacity-50" />
</button>
