<script lang="ts">
	import ButtonHoverEffect from '$components/buttons/ButtonHoverEffect.svelte';
	import IconAnimatedSpinner from '$components/icons/IconAnimatedSpinner.svelte';
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
	export let withSpinner = false;
	export let loading = false;
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
		{#if !loading}
			<ButtonHoverEffect {hoverFrom} {size} />
		{/if}
		{#if withSpinner}
			<div
				class="transform relative transition {loading
					? 'scale-0 opacity-0'
					: 'scale-100 opacity-100'}"
			>
				<slot />
			</div>
			<div
				class="w-full h-full absolute left-0 top-0 pointer-events-none flex justify-center items-center"
			>
				<div
					class="{size === 'sm' ? 'w-6 h-6' : 'w-7 h-7'} transition transform {loading
						? 'scale-100'
						: 'scale-0'}"
				>
					<IconAnimatedSpinner class="w-full h-full" {loading} />
				</div>
			</div>
		{:else}
			<slot />
		{/if}
	</a>
{:else}
	<button
		type="button"
		on:click={onClick}
		aria-label={name}
		disabled={disabled || loading}
		class="touch-manipulation max-w-full relative overflow-hidden z-0 {noPadding
			? ''
			: 'px-4 py-3.5'} font-semibold transition pointer-events-auto
		flex items-center gap-1.5 group {size === 'sm'
			? 'rounded-md'
			: size === 'md'
			? 'rounded-lg'
			: 'rounded-xl'} {size === 'sm' ? 'text-sm' : 'text-base'} {classes}"
	>
		{#if !loading}
			<ButtonHoverEffect {hoverFrom} {size} />
		{/if}
		{#if withSpinner}
			<div
				class="transform relative transition {loading
					? 'scale-0 opacity-0'
					: 'scale-100 opacity-100'}"
			>
				<slot />
			</div>
			<div
				class="w-full h-full absolute left-0 top-0 pointer-events-none flex justify-center items-center"
			>
				<div
					class="{size === 'sm' ? 'w-6 h-6' : 'w-7 h-7'} transition transform {loading
						? 'scale-100'
						: 'scale-0'}"
				>
					<IconAnimatedSpinner class="w-full h-full" {loading} />
				</div>
			</div>
		{:else}
			<slot />
		{/if}
	</button>
{/if}
