<script lang="ts">
	import IconButton from '$components/primitives/buttons/IconButton.svelte';
	import IconCancel from '$components/icons/IconCancel.svelte';
	import { expandCollapse } from '$ts/animation/transitions';
	import { quadOut } from 'svelte/easing';

	export let onClick: (() => void) | undefined = undefined;
	export let href: string | undefined = undefined;
	export let onClose: () => void;
	export let target: '_blank' | '_self' = '_blank';
	export let prefetch = true;
</script>

<div
	transition:expandCollapse={{ duration: 200, easing: quadOut }}
	class="w-full relative text-c-on-primary font-bold"
>
	{#if href}
		<a
			on:click={onClose}
			{target}
			{href}
			data-sveltekit-preload-data={prefetch && target === '_self' ? 'hover' : 'off'}
			class="w-full flex flex-row justify-center items-center px-10 py-2.5 z-10 relative
			bg-c-primary transition not-touch:hover:bg-c-secondary"
		>
			<slot />
		</a>
	{:else}
		<button
			on:click={() => {
				if (onClick) onClick();
				onClose();
			}}
			class="w-full flex flex-row justify-center items-center px-10 py-2.5 z-10 relative
			bg-c-primary transition not-touch:hover:bg-c-secondary"
		>
			<slot />
		</button>
	{/if}
	<div class="absolute right-0 top-0 transform h-full flex items-center justify-center z-20 px-1">
		<IconButton onClick={onClose} name="Close" type="on-primary">
			<IconCancel />
		</IconButton>
	</div>
</div>
