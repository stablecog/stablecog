<script lang="ts">
	import IconLoading from '$components/icons/IconLoading.svelte';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	export let disabled = false;
	export let loading = false;
	export let href: string | undefined = undefined;
	export let onClick: (() => void) | undefined = undefined;
	export let prefetch: boolean = true;
	export let size: 'md' | 'sm' = 'md';
	export let withSpinner = false;
	export let padding = true;
	export { classes as class };
	let classes = '';
</script>

{#if href}
	<a
		{href}
		data-sveltekit-prefetch={prefetch ? '' : 'off'}
		{disabled}
		class="{!padding ? 'p-0' : size === 'sm' ? 'px-6 md:px-8 py-4' : 'px-8 md:px-10 py-5'} {size ===
		'sm'
			? 'text-sm rounded-lg2'
			: 'text-base rounded-xl'} relative flex items-center justify-center text-center
			shadow-lg shadow-c-shadow/[var(--o-shadow-normal)]  text-c-on-primary font-bold gap-2 
			overflow-hidden z-0 group {loading ? 'bg-c-secondary' : 'bg-c-primary'} {classes}"
	>
		<div class="w-[200%] h-full absolute left-0 top-0 flex items-center justify-center">
			<div
				class="w-full aspect-square origin-left rounded-full transition transform -translate-x-full 
				bg-c-secondary {!$isTouchscreen ? 'group-hover:translate-x-[-45%]' : ''}"
			/>
		</div>
		<div class="relative">
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
					<div class="w-6 h-6 transition transform {loading ? 'scale-100' : 'scale-0'}">
						<IconLoading class="w-full h-full {loading ? 'animate-spin-faster' : ''}" />
					</div>
				</div>
			{:else}
				<slot />
			{/if}
		</div>
	</a>
{:else}
	<button
		on:click={onClick}
		disabled={disabled || loading}
		class="{!padding ? 'p-0' : size === 'sm' ? 'px-6 md:px-8 py-4' : 'px-8 md:px-10 py-5'} {size ===
		'sm'
			? 'text-sm rounded-lg2'
			: 'text-base rounded-xl'} relative flex items-center justify-center text-center
			shadow-lg shadow-c-shadow/[var(--o-shadow-normal)]  text-c-on-primary font-bold gap-2 
			overflow-hidden z-0 group {loading ? 'bg-c-secondary' : 'bg-c-primary'} {classes}"
	>
		<div class="w-[200%] h-full absolute left-0 top-0 flex items-center justify-center">
			<div
				class="w-full aspect-square origin-left rounded-full transition transform -translate-x-full 
					bg-c-secondary {!$isTouchscreen ? 'group-enabled:group-hover:translate-x-[-45%]' : ''}"
			/>
		</div>
		<div class="relative">
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
					<div class="w-6 h-6 transition transform {loading ? 'scale-100' : 'scale-0'}">
						<IconLoading class="w-full h-full {loading ? 'animate-spin-faster' : ''}" />
					</div>
				</div>
			{:else}
				<slot />
			{/if}
		</div>
	</button>
{/if}
