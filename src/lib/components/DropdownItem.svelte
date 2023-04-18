<script lang="ts">
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import type { THrefTarget } from '$ts/types/main';

	export let onClick: () => void = () => null;
	export let padding: 'xl' | 'lg' | 'md' | 'sm' = 'xl';
	export let disabled = false;
	export let href: string | undefined = undefined;
	export let target: THrefTarget = undefined;
	export let prefetch = true;
	export { classes as class };
	let classes = 'w-full';
</script>

{#if href}
	<a
		{href}
		{target}
		data-sveltekit-preload-data={prefetch && target === undefined ? 'hover' : 'off'}
		on:click={onClick}
		class="flex items-center justify-center font-bold px-5 {padding === 'sm'
			? 'py-3'
			: padding === 'md'
			? 'py-4'
			: padding === 'lg'
			? 'py-4.5'
			: 'py-5'} relative z-0 overflow-hidden group {classes}"
	>
		<div class="w-[200%] h-full absolute left-0 top-0 flex items-center justify-center">
			<div
				class="w-full aspect-square origin-left rounded-full transition transform -translate-x-full opacity-0
				bg-c-primary/10 {!$isTouchscreen ? 'group-hover:translate-x-[-45%] group-hover:opacity-100' : ''}"
			/>
		</div>
		<slot />
	</a>
{:else}
	<button
		{disabled}
		on:click={onClick}
		class="font-bold px-5 {padding === 'sm'
			? 'py-3'
			: padding === 'md'
			? 'py-4'
			: padding === 'lg'
			? 'py-4.5'
			: 'py-5'} relative z-0 overflow-hidden group {classes}"
	>
		<div class="w-[200%] h-full absolute left-0 top-0 flex items-center justify-center">
			<div
				class="w-full aspect-square origin-left rounded-full transition transform -translate-x-full opacity-0
				bg-c-primary/10 {!$isTouchscreen ? 'group-hover:translate-x-[-45%] group-hover:opacity-100' : ''}"
			/>
		</div>
		<slot />
	</button>
{/if}
