<script lang="ts">
	import ButtonHoverEffect from '$components/buttons/ButtonHoverEffect.svelte';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import type { THrefTarget } from '$ts/types/main';
	export let href: string | undefined = undefined;
	export let target: THrefTarget = undefined;
	export let size: 'sm' | 'md' | 'lg' = 'lg';
	export let prefetch: boolean = false;
	export let onClick: (() => void) | undefined = undefined;
	export { classes as class };
	let classes = 'text-c-on-bg/50 -mt-1';
	export let disabled = false;
	export let hoverFrom: 'bottom' | 'top' | 'left' | 'right' = 'bottom';
	export let name: string | undefined = undefined;
	export let noPadding = false;
</script>

{#if href}
	<a
		{href}
		{target}
		aria-label={name}
		data-sveltekit-preload-data={prefetch && (target === '_self' || target === undefined)
			? 'hover'
			: 'off'}
		class="touch-manipulation max-w-full relative overflow-hidden z-0 {noPadding
			? ''
			: 'px-4 py-3.5'} font-semibold transition pointer-events-auto 
		flex items-center gap-1.5 group {size === 'sm'
			? 'rounded-md'
			: size === 'md'
			? 'rounded-lg'
			: 'rounded-xl'} {size === 'sm' ? 'text-sm' : 'text-base'} {classes}"
	>
		<ButtonHoverEffect {hoverFrom} {size} />
		<slot />
	</a>
{:else}
	<button
		type="button"
		on:click={onClick}
		aria-label={name}
		{disabled}
		class="touch-manipulation max-w-full relative overflow-hidden z-0 {noPadding
			? 'px-4 py-3.5'
			: ''} font-semibold transition pointer-events-auto 
		flex items-center gap-1.5 group {size === 'sm'
			? 'rounded-md'
			: size === 'md'
			? 'rounded-lg'
			: 'rounded-xl'} {size === 'sm' ? 'text-sm' : 'text-base'} {classes}"
	>
		<ButtonHoverEffect {hoverFrom} {size} />
		<slot />
	</button>
{/if}
