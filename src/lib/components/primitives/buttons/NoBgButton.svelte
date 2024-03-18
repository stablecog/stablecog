<script lang="ts">
	import ButtonHoverEffect from '$components/primitives/buttons/ButtonHoverEffect.svelte';
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
	export let paddingClassForHoverEffect: string | undefined = undefined;
	export let paddingForHover = false;
	export let withSpinner = false;
	export let loading = false;
	export let trigger: any | undefined = undefined;
</script>

{#if href}
	<a
		{href}
		{target}
		aria-label={name}
		data-sveltekit-preload-data={prefetch && (target === '_self' || target === undefined)
			? 'hover'
			: 'off'}
		class="relative z-0 max-w-full touch-manipulation overflow-hidden {noPadding
			? ''
			: 'px-4 py-4'} group pointer-events-auto flex
		items-center gap-1.5 font-semibold transition {size === 'sm'
			? 'rounded-md'
			: size === 'md'
				? 'rounded-lg'
				: 'rounded-xl'} {size === 'sm' ? 'text-sm' : 'text-base'} {classes}"
	>
		{#if !loading}
			<ButtonHoverEffect
				noPadding={!paddingForHover}
				paddingClass={paddingClassForHoverEffect}
				{hoverFrom}
				{size}
			/>
		{/if}
		{#if withSpinner}
			<div
				class="relative transform transition {loading
					? 'scale-0 opacity-0'
					: 'scale-100 opacity-100'}"
			>
				<slot />
			</div>
			<div
				class="pointer-events-none absolute left-0 top-0 flex h-full w-full items-center justify-center"
			>
				<div
					class="{size === 'sm' ? 'h-6 w-6' : 'h-7 w-7'} transform transition {loading
						? 'scale-100'
						: 'scale-0'}"
				>
					<IconAnimatedSpinner class="h-full w-full" {loading} />
				</div>
			</div>
		{:else}
			<slot />
		{/if}
	</a>
{:else if trigger}
	<button
		type="button"
		use:trigger
		{...$trigger}
		on:click={onClick}
		aria-label={name}
		disabled={disabled || loading}
		class="relative z-0 max-w-full touch-manipulation overflow-hidden {noPadding
			? ''
			: 'px-4 py-4'} group pointer-events-auto flex
			items-center gap-1.5 font-semibold transition {size === 'sm'
			? 'rounded-md'
			: size === 'md'
				? 'rounded-lg'
				: 'rounded-xl'} {size === 'sm' ? 'text-sm' : 'text-base'} {classes}"
	>
		{#if !loading}
			<ButtonHoverEffect paddingClass={paddingClassForHoverEffect} {noPadding} {hoverFrom} {size} />
		{/if}
		{#if withSpinner}
			<div
				class="relative transform transition {loading
					? 'scale-0 opacity-0'
					: 'scale-100 opacity-100'}"
			>
				<slot />
			</div>
			<div
				class="pointer-events-none absolute left-0 top-0 flex h-full w-full items-center justify-center"
			>
				<div
					class="{size === 'sm' ? 'h-6 w-6' : 'h-7 w-7'} transform transition {loading
						? 'scale-100'
						: 'scale-0'}"
				>
					<IconAnimatedSpinner class="h-full w-full" {loading} />
				</div>
			</div>
		{:else}
			<slot />
		{/if}
	</button>
{:else}
	<button
		type="button"
		on:click={onClick}
		aria-label={name}
		disabled={disabled || loading}
		class="relative z-0 max-w-full touch-manipulation overflow-hidden {noPadding
			? ''
			: 'px-4 py-4'} group pointer-events-auto flex
		items-center gap-1.5 font-semibold transition {size === 'sm'
			? 'rounded-md'
			: size === 'md'
				? 'rounded-lg'
				: 'rounded-xl'} {size === 'sm' ? 'text-sm' : 'text-base'} {classes}"
	>
		{#if !loading}
			<ButtonHoverEffect paddingClass={paddingClassForHoverEffect} {noPadding} {hoverFrom} {size} />
		{/if}
		{#if withSpinner}
			<div
				class="relative transform transition {loading
					? 'scale-0 opacity-0'
					: 'scale-100 opacity-100'}"
			>
				<slot />
			</div>
			<div
				class="pointer-events-none absolute left-0 top-0 flex h-full w-full items-center justify-center"
			>
				<div
					class="{size === 'sm' ? 'h-6 w-6' : 'h-7 w-7'} transform transition {loading
						? 'scale-100'
						: 'scale-0'}"
				>
					<IconAnimatedSpinner class="h-full w-full" {loading} />
				</div>
			</div>
		{:else}
			<slot />
		{/if}
	</button>
{/if}
