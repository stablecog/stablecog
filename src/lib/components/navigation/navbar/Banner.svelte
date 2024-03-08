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
	class="relative w-full font-bold text-c-on-primary"
>
	{#if href}
		<a
			on:click={onClose}
			{target}
			{href}
			data-sveltekit-preload-data={prefetch && target === '_self' ? 'hover' : 'off'}
			class="relative z-10 flex w-full flex-row items-center justify-center bg-c-primary px-10
			py-2.5 transition not-touch:hover:bg-c-secondary"
		>
			<slot />
		</a>
	{:else}
		<button
			on:click={() => {
				if (onClick) onClick();
				onClose();
			}}
			class="relative z-10 flex w-full flex-row items-center justify-center bg-c-primary px-10
			py-2.5 transition not-touch:hover:bg-c-secondary"
		>
			<slot />
		</button>
	{/if}
	<div class="absolute right-0 top-0 z-20 flex h-full transform items-center justify-center px-1">
		<IconButton onClick={onClose} name="Close" type="on-primary">
			<IconCancel />
		</IconButton>
	</div>
</div>
