<script lang="ts">
	import { isTouchscreen } from '$ts/stores/isTouchscreen';

	export let onClick: (() => void) | undefined = undefined;
	export let state: 'idle' | 'success' = 'idle';
	export let href: string | undefined = undefined;
	export let download: string | undefined = undefined;
	export let noPadding = false;
	export let prefetch = false;
	export { classes as class };
	export let disabled = false;
	let classes = '';
</script>

{#if href}
	<a
		on:click={onClick}
		{href}
		{download}
		{disabled}
		data-sveltekit-prefetch={prefetch ? '' : 'off'}
		class="{state === 'success'
			? 'bg-c-success ring-c-success text-c-on-primary'
			: 'bg-c-bg-secondary ring-c-bg-tertiary text-c-on-bg'} {noPadding
			? ''
			: 'px-3 py-2.5'} shadow-lg shadow-c-shadow/[var(--o-shadow-strong)]
    	rounded-lg font-bold transition text-xs ring-2 relative overflow-hidden z-0 group {classes}"
	>
		<div class="w-[200%] h-full absolute left-0 top-0 flex items-center justify-center">
			<div
				class="{state === 'success'
					? 'bg-c-success translate-x-[-45%]'
					: 'bg-c-bg-tertiary'} w-full aspect-square origin-left rounded-full transition transform -translate-x-full {!$isTouchscreen
					? 'group-hover:translate-x-[-45%]'
					: ''}"
			/>
		</div>
		<div class="relative flex items-center justify-center text-center">
			<slot />
		</div>
	</a>
{:else}
	<button
		on:click={onClick}
		{disabled}
		class="{state === 'success'
			? 'bg-c-success ring-c-success text-c-on-primary'
			: 'bg-c-bg-secondary ring-c-bg-tertiary text-c-on-bg'} {noPadding
			? ''
			: 'px-3 py-2.5'} shadow-lg shadow-c-shadow/[var(--o-shadow-strong)]
    	rounded-lg font-bold transition text-xs ring-2 relative overflow-hidden z-0 group {classes}"
	>
		<div class="w-[200%] h-full absolute left-0 top-0 flex items-center justify-center">
			<div
				class="{state === 'success'
					? 'bg-c-success translate-x-[-45%]'
					: 'bg-c-bg-tertiary'} w-full aspect-square origin-left rounded-full transition transform -translate-x-full {!$isTouchscreen
					? 'group-enabled:group-hover:translate-x-[-45%]'
					: ''}"
			/>
		</div>
		<div class="relative flex items-center justify-center text-center">
			<slot />
		</div>
	</button>
{/if}
