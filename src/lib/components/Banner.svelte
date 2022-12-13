<script lang="ts">
	import IconButton from '$components/buttons/IconButton.svelte';
	import IconCancel from '$components/icons/IconCancel.svelte';
	import { expandCollapse } from '$ts/animation/transitions';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';

	export let onClick: (() => void) | undefined = undefined;
	export let href: string | undefined = undefined;
	export let onClose: () => void;
	export let blank = true;
</script>

<div
	transition:expandCollapse={{ duration: 200 }}
	class="w-full relative text-c-on-primary font-bold"
>
	{#if href}
		<a
			on:click={onClose}
			target={blank ? '_blank' : ''}
			{href}
			data-sveltekit-prefetch
			class="w-full flex flex-row justify-center items-center px-10 py-2.5 z-10 relative bg-c-primary transition {!$isTouchscreen
				? 'hover:bg-c-secondary'
				: ''}"
		>
			<slot />
		</a>
	{:else}
		<button
			on:click={() => {
				if (onClick) onClick();
				onClose();
			}}
			class="w-full flex flex-row justify-center items-center px-10 py-2.5 z-10 relative bg-c-primary transition {!$isTouchscreen
				? 'hover:bg-c-secondary'
				: ''}"
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
