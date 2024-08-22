<script lang="ts">
	import IconAnimatedSpinner from '$components/icons/IconAnimatedSpinner.svelte';
	import IconOAuthProvider from '$components/icons/IconOAuthProvider.svelte';
	import type { THrefTarget } from '$ts/types/main';
	import type { Provider } from '@supabase/supabase-js';
	export let disabled = false;
	export let loading = false;
	export let href: string | undefined = undefined;
	export let onClick: (() => void) | undefined = undefined;
	export let prefetch: boolean = true;
	export let size: 'md' | 'sm' | 'xs' = 'md';
	export let withSpinner = false;
	export let noPadding = false;
	export let target: THrefTarget = undefined;
	export { classes as class };
	export let provider: Provider = 'google';
	let classes = '';

	let width: number;
	let height: number;

	$: buttonSize = smallestSquareSide(width, height);

	function smallestSquareSide(width: number, height: number): number {
		const diagonal = Math.sqrt(width * width + height * height);
		return diagonal;
	}
</script>

{#if href}
	<a
		bind:clientWidth={width}
		bind:clientHeight={height}
		{href}
		{target}
		data-sveltekit-preload-data={prefetch && (target === '_self' || target === undefined)
			? 'hover'
			: 'off'}
		class="group relative z-0 flex touch-manipulation items-center
			justify-center gap-2 overflow-hidden text-center
			font-bold shadow-lg shadow-c-shadow/[var(--o-shadow-strong)] {noPadding
			? 'p-0'
			: size === 'xs'
				? 'px-3.5 py-3'
				: size === 'sm'
					? 'px-3.5 py-3'
					: 'px-3.5 py-4'} {size === 'xs'
			? 'rounded-lg2 text-sm'
			: size === 'sm'
				? 'rounded-lg2 text-sm'
				: 'rounded-xl text-base'} {provider === 'google'
			? 'text-black'
			: provider === 'discord'
				? 'text-white'
				: provider === 'apple'
					? 'text-white dark:text-black'
					: 'text-c-on-primary'} {loading
			? provider === 'google'
				? 'bg-indigo-200'
				: provider === 'discord'
					? 'bg-[#4854d7]'
					: provider === 'apple'
						? 'bg-[#333333] dark:bg-indigo-200'
						: 'bg-c-secondary'
			: provider === 'google'
				? 'bg-white'
				: provider === 'discord'
					? 'bg-[#5865F2]'
					: provider === 'apple'
						? 'bg-black dark:bg-white'
						: 'bg-c-primary'} {classes}"
	>
		<div
			style="width: {buttonSize}px; height: {buttonSize}px;"
			class="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 transform items-center
			justify-center not-touch:flex"
		>
			<div
				class="absolute left-0 h-full w-full -translate-x-full transform rounded-full transition
				{provider === 'google'
					? 'bg-indigo-200'
					: provider === 'discord'
						? 'bg-[#4854d7]'
						: provider === 'apple'
							? 'bg-[#333333] dark:bg-indigo-200'
							: 'bg-c-secondary'} not-touch:group-enabled:group-hover:translate-x-0"
			/>
		</div>
		<div class="relative w-full">
			{#if withSpinner}
				<div class="flex max-w-full items-center justify-between gap-2">
					<IconOAuthProvider {provider} class="-my-1 h-7 w-7 flex-shrink-0" />
					<div class="min-w-0 flex-1 px-1">
						<slot />
					</div>
					<div class="-my-1 h-7 w-7 flex-shrink-0" />
				</div>
				<div
					class="pointer-events-none absolute left-0 top-0 flex h-full w-full items-center justify-center"
				>
					<div
						class="-my-1 {size === 'sm' ? 'h-6 w-6' : 'h-7 w-7'} transform transition {loading
							? 'scale-100'
							: 'scale-0'}"
					>
						<IconAnimatedSpinner class="h-full w-full" {loading} />
					</div>
				</div>
			{:else}
				<div class="flex max-w-full items-center justify-between gap-2">
					<IconOAuthProvider {provider} class="-my-1 h-7 w-7 flex-shrink-0" />
					<div class="min-w-0 flex-1 px-1">
						<slot />
					</div>
					<div class="-my-1 h-7 w-7 flex-shrink-0" />
				</div>
			{/if}
		</div>
	</a>
{:else}
	<button
		bind:clientWidth={width}
		bind:clientHeight={height}
		on:click={onClick}
		disabled={disabled || loading}
		class="group relative z-0 flex touch-manipulation items-center
			justify-center gap-2 overflow-hidden text-center
			font-bold shadow-lg shadow-c-shadow/[var(--o-shadow-strong)] {noPadding
			? 'p-0'
			: size === 'xs'
				? 'px-3.5 py-3'
				: size === 'sm'
					? 'px-3.5 py-3'
					: 'px-3.5 py-4'} {size === 'xs'
			? 'rounded-lg2 text-sm'
			: size === 'sm'
				? 'rounded-lg2 text-sm'
				: 'rounded-xl text-base'} {provider === 'google'
			? 'text-black'
			: provider === 'discord'
				? 'text-white'
				: provider === 'apple'
					? 'text-white dark:text-black'
					: 'text-c-on-primary'} {loading
			? provider === 'google'
				? 'bg-indigo-200'
				: provider === 'discord'
					? 'bg-[#4854d7]'
					: provider === 'apple'
						? 'bg-[#333333] dark:bg-indigo-200'
						: 'bg-c-secondary'
			: provider === 'google'
				? 'bg-white'
				: provider === 'discord'
					? 'bg-[#5865F2]'
					: provider === 'apple'
						? 'bg-black dark:bg-white'
						: 'bg-c-primary'} {classes}"
	>
		<div
			style="width: {buttonSize}px; height: {buttonSize}px;"
			class="absolute left-1/2 top-1/2 hidden -translate-x-1/2 -translate-y-1/2 transform items-center
			justify-center not-touch:flex"
		>
			<div
				class="absolute left-0 h-full w-full -translate-x-full transform rounded-full transition
				{provider === 'google'
					? 'bg-indigo-200'
					: provider === 'discord'
						? 'bg-[#4854d7]'
						: provider === 'apple'
							? 'bg-[#333333] dark:bg-indigo-200'
							: 'bg-c-secondary'} not-touch:group-enabled:group-hover:translate-x-0"
			/>
		</div>
		<div class="relative w-full">
			{#if withSpinner}
				<div
					class="relative transform transition {loading
						? 'scale-0 opacity-0'
						: 'scale-100 opacity-100'}"
				>
					<div class="flex max-w-full items-center justify-between gap-2">
						<IconOAuthProvider {provider} class="-my-1 h-7 w-7 flex-shrink-0" />
						<div class="min-w-0 flex-1 px-1">
							<slot />
						</div>
						<div class="-my-1 h-7 w-7 flex-shrink-0" />
					</div>
				</div>
				<div
					class="pointer-events-none absolute left-0 top-0 flex h-full w-full items-center justify-center"
				>
					<div
						class="-my-1 {size === 'sm' ? 'h-6 w-6' : 'h-7 w-7'} transform transition {loading
							? 'scale-100'
							: 'scale-0'}"
					>
						<IconAnimatedSpinner class="h-full w-full" {loading} />
					</div>
				</div>
			{:else}
				<div class="flex max-w-full items-center justify-between gap-2">
					<IconOAuthProvider {provider} class="-my-1 h-7 w-7 flex-shrink-0" />
					<div class="min-w-0 flex-1 px-1">
						<slot />
					</div>
					<div class="-my-1 h-7 w-7 flex-shrink-0" />
				</div>
			{/if}
		</div>
	</button>
{/if}
