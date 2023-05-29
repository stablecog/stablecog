<script lang="ts">
	import IconAnimatedSpinner from '$components/icons/IconAnimatedSpinner.svelte';
	import Morpher from '$components/Morpher.svelte';
	import type { THrefTarget } from '$ts/types/main';

	export let onClick: (() => void) | undefined = undefined;
	export let state: 'idle' | 'success' | 'danger' = 'idle';
	export let href: string | undefined = undefined;
	export let download: string | undefined = undefined;
	export let noPadding = false;
	export let prefetch = false;
	export { classes as class };
	export let disabled = false;
	export let loading = false;
	export let withSpinner = false;
	export let target: THrefTarget = undefined;
	export let size: 'sm' | 'md' = 'sm';
	export let textColor: 'on-bg' | 'secondary' | 'danger' | 'success' = 'on-bg';
	export let icon: ConstructorOfATypedSvelteComponent | undefined = undefined;
	export let hasRing = true;
	export let shadow: 'normal' | 'strongest' = 'normal';
	export let label: string | undefined = undefined;

	let classes = '';
</script>

{#if href}
	<a
		on:click={onClick}
		{href}
		{download}
		{target}
		data-sveltekit-preload-data={prefetch && (target === '_self' || target === undefined)
			? 'hover'
			: 'off'}
		class="touch-manipulation {state === 'success'
			? 'bg-c-success ring-c-success text-c-on-primary'
			: 'bg-c-bg-secondary ring-c-bg-tertiary text-c-on-bg'} {noPadding
			? ''
			: 'px-3 py-2.5'} shadow-lg {shadow === 'strongest'
			? 'shadow-c-shadow/[var(--o-shadow-strongest)]'
			: 'shadow-c-shadow/[var(--o-shadow-strong)]'}
    	rounded-lg font-bold transition {size === 'md' ? 'text-sm' : 'text-xs'} {!hasRing
			? ''
			: 'ring-2'} relative overflow-hidden z-0 group {classes}"
		aria-label={label}
	>
		<div class="w-[200%] h-full absolute left-0 top-0 flex items-center justify-center">
			<div
				class="{state === 'success'
					? 'bg-c-success translate-x-[-43%]'
					: 'bg-c-bg-tertiary'} w-full aspect-square origin-left rounded-full transition transform -translate-x-full
					not-touch:group-hover:translate-x-[-43%] {loading ? 'translate-x-[-43%]' : ''}"
			/>
		</div>
		<div
			class="relative flex items-center justify-center text-center transition-none gap-1.5 {state ===
			'success'
				? 'text-c-on-primary'
				: state === 'danger'
				? 'text-c-on-primary'
				: textColor === 'danger'
				? 'text-c-danger'
				: textColor === 'success'
				? 'text-c-success'
				: textColor === 'secondary'
				? 'text-c-secondary'
				: 'text-c-on-bg'}"
		>
			{#if withSpinner}
				<Morpher morphed={loading}>
					<div slot="0" class="w-full flex gap-1.5">
						{#if icon}
							<svelte:component
								this={icon}
								class="{size === 'md' ? 'w-5 h-5 -ml-0.5' : 'w-4 h-4 -ml-0.25'} flex-shrink-0"
							/>
						{/if}
						<slot />
					</div>
					<div slot="1">
						<IconAnimatedSpinner {loading} class={size === 'md' ? 'w-5 h-5' : 'w-4 h-4'} />
					</div>
				</Morpher>
			{:else}
				{#if icon}
					<svelte:component
						this={icon}
						class="{size === 'md' ? 'w-5 h-5 -ml-0.5' : 'w-4 h-4 -ml-0.25'} flex-shrink-0"
					/>
				{/if}
				<slot />
			{/if}
		</div>
	</a>
{:else}
	<button
		type="button"
		on:click={onClick}
		disabled={disabled || loading}
		class="touch-manipulation {state === 'success'
			? 'bg-c-success ring-c-success'
			: state === 'danger'
			? 'bg-c-danger ring-c-danger'
			: 'bg-c-bg-secondary ring-c-bg-tertiary'} {noPadding
			? ''
			: 'px-3 py-2.5'} shadow-lg {shadow === 'strongest'
			? 'shadow-c-shadow/[var(--o-shadow-strongest)]'
			: 'shadow-c-shadow/[var(--o-shadow-strong)]'}
    	rounded-lg font-bold transition {size === 'md' ? 'text-sm' : 'text-xs'} {!hasRing
			? ''
			: 'ring-2'} relative overflow-hidden z-0 group {classes}"
		aria-label={label}
	>
		<div class="w-[200%] h-full absolute left-0 top-0 flex items-center justify-center">
			<div
				class="{state === 'success'
					? 'bg-c-success translate-x-[-43%]'
					: state === 'danger'
					? 'bg-c-danger translate-x-[-43%]'
					: 'bg-c-bg-tertiary'} w-full aspect-square origin-left rounded-full transition transform -translate-x-full
					not-touch:group-enabled:group-hover:translate-x-[-43%] {loading ? 'translate-x-[-43%]' : ''}"
			/>
		</div>
		<div
			class="relative flex items-center justify-center text-center transition-none gap-1.5 {state ===
			'success'
				? 'text-c-on-primary'
				: state === 'danger'
				? 'text-c-on-primary'
				: textColor === 'danger'
				? 'text-c-danger'
				: textColor === 'success'
				? 'text-c-success'
				: textColor === 'secondary'
				? 'text-c-secondary'
				: 'text-c-on-bg'}"
		>
			{#if withSpinner}
				<Morpher morphed={loading}>
					<div slot="0" class="w-full flex gap-1.5">
						{#if icon}
							<svelte:component
								this={icon}
								class="{size === 'md' ? 'w-5 h-5 -ml-0.5' : 'w-4 h-4 -ml-0.25'} flex-shrink-0"
							/>
						{/if}
						<slot />
					</div>
					<div slot="1">
						<IconAnimatedSpinner {loading} class={size === 'md' ? 'w-5 h-5' : 'w-4 h-4'} />
					</div>
				</Morpher>
			{:else}
				{#if icon}
					<svelte:component
						this={icon}
						class="{size === 'md' ? 'w-5 h-5 -ml-0.5' : 'w-4 h-4 -ml-0.25'} flex-shrink-0"
					/>
				{/if}
				<slot />
			{/if}
		</div>
	</button>
{/if}
