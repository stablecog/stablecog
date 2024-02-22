<script lang="ts">
	import IconAnimatedSpinner from '$components/icons/IconAnimatedSpinner.svelte';
	import type { THrefTarget } from '$ts/types/main';

	export let onClick: () => void = () => null;
	export let padding: 'xl' | 'lg' | 'md' | 'sm' | 'sm+' = 'xl';
	export let disabled = false;
	export let href: string | undefined = undefined;
	export let target: THrefTarget = undefined;
	export let prefetch = true;
	export let withSpinner = false;
	export let loading = false;
	export { classes as class };
	let classes = 'w-full';
</script>

{#if href}
	<a
		{href}
		{target}
		data-sveltekit-preload-data={prefetch && target === undefined ? 'hover' : 'off'}
		on:click={onClick}
		class="flex items-center justify-center font-semibold px-5 {padding === 'sm'
			? 'py-3'
			: padding === 'sm+'
				? 'py-3.5'
				: padding === 'md'
					? 'py-4'
					: padding === 'lg'
						? 'py-4.5'
						: 'py-5'} relative z-0 overflow-hidden group {classes}"
	>
		<div class="w-full h-full absolute left-0 top-0 flex items-center justify-center p-1">
			<div class="w-full h-full overflow-hidden rounded-lg">
				<div
					class="w-full h-full aspect-square origin-left rounded-lg transition transform -translate-x-full opacity-0
						bg-c-primary/10 not-touch:group-hover:translate-x-0 not-touch:group-hover:opacity-100"
				/>
			</div>
		</div>
		<slot />
	</a>
{:else}
	<button
		disabled={disabled || loading}
		on:click={onClick}
		class="font-semibold px-5 {padding === 'sm'
			? 'py-3'
			: padding === 'sm+'
				? 'py-3.5'
				: padding === 'md'
					? 'py-4'
					: padding === 'lg'
						? 'py-4.5'
						: 'py-5'} relative z-0 overflow-hidden group {classes}"
	>
		{#if !withSpinner || !loading}
			<div class="w-full h-full absolute left-0 top-0 flex items-center justify-center p-1">
				<div class="w-full h-full overflow-hidden rounded-lg">
					<div
						class="w-full h-full aspect-square origin-left rounded-lg transition transform -translate-x-full opacity-0
						bg-c-primary/10 not-touch:group-hover:translate-x-0 not-touch:group-hover:opacity-100"
					/>
				</div>
			</div>
		{/if}
		{#if !withSpinner}
			<slot />
		{:else}
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
				<div class="w-7 h-7 transition transform {loading ? 'scale-100' : 'scale-0'}">
					<IconAnimatedSpinner class="w-full h-full" {loading} />
				</div>
			</div>
		{/if}
	</button>
{/if}
