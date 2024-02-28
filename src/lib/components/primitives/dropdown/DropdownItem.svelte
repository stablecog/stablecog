<script lang="ts">
	import IconAnimatedSpinner from '$components/icons/IconAnimatedSpinner.svelte';
	import type { THrefTarget } from '$ts/types/main';

	export let onClick: () => void = () => null;
	export let padding: 'xl' | 'lg' | 'md' | 'sm' | 'sm+' = 'lg';
	export let disabled = false;
	export let href: string | undefined = undefined;
	export let target: THrefTarget = undefined;
	export let prefetch = true;
	export let withSpinner = false;
	export let loading = false;
	export let isSelected = false;
	export let noHoverEffectPadding = false;
	export { classes as class };
	let classes = 'w-full';
</script>

{#if href}
	<a
		{href}
		{target}
		data-sveltekit-preload-data={prefetch && target === undefined ? 'hover' : 'off'}
		on:click={onClick}
		class="flex items-center justify-center px-5 font-semibold {padding === 'sm'
			? 'py-3'
			: padding === 'sm+'
				? 'py-3.5'
				: padding === 'md'
					? 'py-4'
					: padding === 'lg'
						? 'py-4.5'
						: 'py-5'} group relative z-0 overflow-hidden {classes}"
	>
		<div
			class="pointer-events-none absolute left-0 top-0 flex h-full w-full items-center justify-center {noHoverEffectPadding
				? ''
				: 'px-1 py-0.5 group-first-of-type:pt-1 group-last-of-type:pb-1'}"
		>
			<div class="relative h-full w-full">
				<div
					class="absolute left-0 top-0 h-full w-full bg-c-primary/10 transition {isSelected
						? 'opacity-100'
						: 'opacity-0'} {noHoverEffectPadding ? '' : 'rounded-lg'}"
				/>
				<div class="h-full w-full overflow-hidden {noHoverEffectPadding ? '' : 'rounded-lg'}">
					<div
						class="aspect-square h-full w-full origin-left -translate-x-full transform opacity-0 {noHoverEffectPadding
							? ''
							: 'rounded-lg'} {isSelected ? 'bg-c-primary/6' : 'bg-c-primary/10'}
						transition not-touch:group-hover:translate-x-0 not-touch:group-hover:opacity-100"
					/>
				</div>
			</div>
		</div>
		<slot />
	</a>
{:else}
	<button
		disabled={disabled || loading}
		on:click={onClick}
		class="px-5 font-semibold {padding === 'sm'
			? 'py-3'
			: padding === 'sm+'
				? 'py-3.5'
				: padding === 'md'
					? 'py-4'
					: padding === 'lg'
						? 'py-4.5'
						: 'py-5'} group relative z-0 overflow-hidden {classes}"
	>
		{#if !withSpinner || !loading}
			<div
				class="pointer-events-none absolute left-0 top-0 flex h-full w-full items-center justify-center {noHoverEffectPadding
					? ''
					: 'px-1 py-0.5 group-first-of-type:pt-1 group-last-of-type:pb-1'}"
			>
				<div class="relative h-full w-full">
					<div
						class="absolute left-0 top-0 h-full w-full bg-c-primary/10 transition {isSelected
							? 'opacity-100'
							: 'opacity-0'} {noHoverEffectPadding ? '' : 'rounded-lg'}"
					/>
					<div class="h-full w-full overflow-hidden {noHoverEffectPadding ? '' : 'rounded-lg'}">
						<div
							class="aspect-square h-full w-full origin-left -translate-x-full transform opacity-0 {noHoverEffectPadding
								? ''
								: 'rounded-lg'} {isSelected ? 'bg-c-primary/6' : 'bg-c-primary/10'}
							transition not-touch:group-hover:translate-x-0 not-touch:group-hover:opacity-100"
						/>
					</div>
				</div>
			</div>
		{/if}
		{#if !withSpinner}
			<slot />
		{:else}
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
				<div class="h-7 w-7 transform transition {loading ? 'scale-100' : 'scale-0'}">
					<IconAnimatedSpinner class="h-full w-full" {loading} />
				</div>
			</div>
		{/if}
	</button>
{/if}
