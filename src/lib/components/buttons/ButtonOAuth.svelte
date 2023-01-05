<script lang="ts">
	import IconLoading from '$components/icons/IconLoading.svelte';
	import IconOAuthProvider from '$components/icons/IconOAuthProvider.svelte';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
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
	export let target: THrefTarget = '_self';
	export { classes as class };
	export let provider: Provider = 'google';
	let classes = '';
</script>

{#if href}
	<a
		{href}
		{target}
		data-sveltekit-prefetch={prefetch && target === '_self' ? '' : 'off'}
		class="{noPadding
			? 'p-0'
			: size === 'xs'
			? 'px-4 py-3'
			: size === 'sm'
			? 'px-4 md:px-6 py-4'
			: 'px-4 md:px-6 py-5'} {size === 'xs'
			? 'text-sm rounded-lg2'
			: size === 'sm'
			? 'text-sm rounded-lg2'
			: 'text-base rounded-xl'} relative flex items-center justify-center text-center
			shadow-lg shadow-c-shadow/[var(--o-shadow-strong)] text-c-on-primary font-bold gap-2 
			overflow-hidden z-0 group {loading
			? provider === 'google'
				? 'bg-indigo-200'
				: 'bg-c-secondary'
			: provider === 'google'
			? 'bg-white'
			: 'bg-c-primary'} {classes}"
	>
		<div class="w-[200%] h-full absolute left-0 top-0 flex items-center justify-center">
			<div
				class="w-full aspect-square origin-left rounded-full transition transform -translate-x-full 
				{provider === 'google' ? 'bg-indigo-200' : 'bg-c-secondary'} {!$isTouchscreen
					? 'group-hover:translate-x-[-45%]'
					: ''}"
			/>
		</div>
		<div class="relative">
			{#if withSpinner}
				<div
					class="transform relative transition {loading
						? 'scale-0 opacity-0'
						: 'scale-100 opacity-100'}"
				>
					<div class="max-w-full flex items-center justify-center gap-2">
						<IconOAuthProvider {provider} class="w-6 h-6 flex-shrink-0" />
						<slot />
					</div>
				</div>
				<div
					class="w-full h-full absolute left-0 top-0 pointer-events-none flex justify-center items-center"
				>
					<div
						class="{size === 'sm' ? 'w-5 h-5' : 'w-6 h-6'} transition transform {loading
							? 'scale-100'
							: 'scale-0'}"
					>
						<IconLoading class="w-full h-full {loading ? 'animate-spin-faster' : ''}" />
					</div>
				</div>
			{:else}
				<div class="max-w-full flex items-center justify-center gap-2">
					<IconOAuthProvider {provider} class="w-6 h-6 flex-shrink-0" />
					<slot />
				</div>
			{/if}
		</div>
	</a>
{:else}
	<button
		on:click={onClick}
		disabled={disabled || loading}
		class="{noPadding
			? 'p-0'
			: size === 'xs'
			? 'px-4 py-3'
			: size === 'sm'
			? 'px-4 md:px-6 py-4'
			: 'px-4 md:px-6 py-5'} {size === 'xs'
			? 'text-sm rounded-lg2'
			: size === 'sm'
			? 'text-sm rounded-lg2'
			: 'text-base rounded-xl'} relative flex items-center justify-center text-center
			shadow-lg shadow-c-shadow/[var(--o-shadow-strong)] font-bold gap-2 
			overflow-hidden z-0 group {provider === 'google' ? 'text-black' : 'text-c-on-primary'} {loading
			? provider === 'google'
				? 'bg-indigo-200'
				: 'bg-c-secondary'
			: provider === 'google'
			? 'bg-white'
			: 'bg-c-primary'} {classes}"
	>
		<div class="w-[200%] h-full absolute left-0 top-0 flex items-center justify-center">
			<div
				class="w-full aspect-square origin-left rounded-full transition transform -translate-x-full 
				{provider === 'google' ? 'bg-indigo-200' : 'bg-c-secondary'} {!$isTouchscreen
					? 'group-hover:translate-x-[-45%]'
					: ''}"
			/>
		</div>
		<div class="relative">
			{#if withSpinner}
				<div
					class="transform relative transition {loading
						? 'scale-0 opacity-0'
						: 'scale-100 opacity-100'}"
				>
					<div class="max-w-full flex items-center justify-center gap-2">
						<IconOAuthProvider {provider} class="w-6 h-6 flex-shrink-0" />
						<slot />
					</div>
				</div>
				<div
					class="w-full h-full absolute left-0 top-0 pointer-events-none flex justify-center items-center"
				>
					<div
						class="{size === 'sm' ? 'w-5 h-5' : 'w-6 h-6'} transition transform {loading
							? 'scale-100'
							: 'scale-0'}"
					>
						<IconLoading class="w-full h-full {loading ? 'animate-spin-faster' : ''}" />
					</div>
				</div>
			{:else}
				<div class="max-w-full flex items-center justify-center gap-2">
					<IconOAuthProvider {provider} class="w-6 h-6 flex-shrink-0" />
					<slot />
				</div>
			{/if}
		</div>
	</button>
{/if}
