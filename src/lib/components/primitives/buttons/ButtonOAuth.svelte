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
		class="touch-manipulation relative flex items-center justify-center text-center
			shadow-lg shadow-c-shadow/[var(--o-shadow-strong)] font-bold gap-2
			overflow-hidden z-0 group {noPadding
			? 'p-0'
			: size === 'xs'
			? 'px-3.5 py-3'
			: size === 'sm'
			? 'px-3.5 py-3'
			: 'px-3.5 py-4.5'} {size === 'xs'
			? 'text-sm rounded-lg2'
			: size === 'sm'
			? 'text-sm rounded-lg2'
			: 'text-base rounded-xl'} {provider === 'google'
			? 'text-black'
			: provider === 'discord'
			? 'text-white'
			: 'text-c-on-primary'} {loading
			? provider === 'google'
				? 'bg-indigo-200'
				: provider === 'discord'
				? 'bg-[#4854d7]'
				: 'bg-c-secondary'
			: provider === 'google'
			? 'bg-white'
			: provider === 'discord'
			? 'bg-[#5865F2]'
			: 'bg-c-primary'} {classes}"
	>
		<div
			style="width: {buttonSize}px; height: {buttonSize}px;"
			class="absolute left-1/2 top-1/2 transform -translate-y-1/2 -translate-x-1/2 items-center justify-center
			hidden not-touch:flex"
		>
			<div
				class="absolute w-full h-full rounded-full transition transform left-0 -translate-x-full
				{provider === 'google'
					? 'bg-indigo-200'
					: provider === 'discord'
					? 'bg-[#4854d7]'
					: 'bg-c-secondary'} not-touch:group-enabled:group-hover:translate-x-0"
			/>
		</div>
		<div class="w-full relative">
			{#if withSpinner}
				<div class="max-w-full flex items-center justify-between gap-2">
					<IconOAuthProvider {provider} class="w-7 h-7 flex-shrink-0" />
					<div class="flex-1 min-w-0 px-1">
						<slot />
					</div>
					<div class="w-7 h-7 flex-shrink-0" />
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
				<div class="max-w-full flex items-center justify-between gap-2">
					<IconOAuthProvider {provider} class="w-7 h-7 flex-shrink-0" />
					<div class="flex-1 min-w-0 px-1">
						<slot />
					</div>
					<div class="w-7 h-7 flex-shrink-0" />
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
		class="touch-manipulation relative flex items-center justify-center text-center
			shadow-lg shadow-c-shadow/[var(--o-shadow-strong)] font-bold gap-2
			overflow-hidden z-0 group {noPadding
			? 'p-0'
			: size === 'xs'
			? 'px-3.5 py-3'
			: size === 'sm'
			? 'px-3.5 py-3'
			: 'px-3.5 py-4.5'} {size === 'xs'
			? 'text-sm rounded-lg2'
			: size === 'sm'
			? 'text-sm rounded-lg2'
			: 'text-base rounded-xl'} {provider === 'google'
			? 'text-black'
			: provider === 'discord'
			? 'text-white'
			: 'text-c-on-primary'} {loading
			? provider === 'google'
				? 'bg-indigo-200'
				: provider === 'discord'
				? 'bg-[#4854d7]'
				: 'bg-c-secondary'
			: provider === 'google'
			? 'bg-white'
			: provider === 'discord'
			? 'bg-[#5865F2]'
			: 'bg-c-primary'} {classes}"
	>
		<div
			style="width: {buttonSize}px; height: {buttonSize}px;"
			class="absolute left-1/2 top-1/2 transform -translate-y-1/2 -translate-x-1/2 items-center justify-center
			hidden not-touch:flex"
		>
			<div
				class="absolute w-full h-full rounded-full transition transform left-0 -translate-x-full
				{provider === 'google'
					? 'bg-indigo-200'
					: provider === 'discord'
					? 'bg-[#4854d7]'
					: 'bg-c-secondary'} not-touch:group-enabled:group-hover:translate-x-0"
			/>
		</div>
		<div class="w-full relative">
			{#if withSpinner}
				<div
					class="transform relative transition {loading
						? 'scale-0 opacity-0'
						: 'scale-100 opacity-100'}"
				>
					<div class="max-w-full flex items-center justify-between gap-2">
						<IconOAuthProvider {provider} class="w-7 h-7 flex-shrink-0" />
						<div class="flex-1 min-w-0 px-1">
							<slot />
						</div>
						<div class="w-7 h-7 flex-shrink-0" />
					</div>
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
				<div class="max-w-full flex items-center justify-between gap-2">
					<IconOAuthProvider {provider} class="w-7 h-7 flex-shrink-0" />
					<div class="flex-1 min-w-0 px-1">
						<slot />
					</div>
					<div class="w-7 h-7 flex-shrink-0" />
				</div>
			{/if}
		</div>
	</button>
{/if}
