<script lang="ts">
	import IconFreePlan from '$components/icons/IconFreePlan.svelte';
	import IconStar from '$components/icons/IconStar.svelte';
	import LL from '$i18n/i18n-svelte';
	import type { TStripeSupportedProductIdSubscriptions } from '$ts/constants/stripePublic';
	import { getTitleFromProductId } from '$ts/helpers/stripe/plan';

	export let productId: TStripeSupportedProductIdSubscriptions | undefined;
	export let size: 'sm' | 'md' | 'lg' = 'md';
	export { classes as class };
	export let loading = false;
	export let href: string | undefined = undefined;
	export let onClick: (() => void) | undefined = undefined;
	let classes = '';

	$: planTitle = getTitleFromProductId($LL, productId);
</script>

{#if href}
	<a
		{href}
		on:click={onClick}
		data-sveltekit-preload-data="hover"
		class="group relative z-10 flex-shrink-0 overflow-hidden border-2
  	border-c-primary/30 bg-c-bg shadow-lg shadow-c-shadow/[var(--o-shadow-normal)] {size === 'sm'
			? 'rounded-lg'
			: size === 'md'
				? 'rounded-lg2'
				: 'rounded-lg2'} {classes}"
	>
		<div
			class="absolute left-0 top-0 hidden h-full w-[200%] items-center justify-center not-touch:flex"
		>
			<div
				class="aspect-square w-full origin-left -translate-x-full transform rounded-full bg-c-primary/15
				transition not-touch:group-hover:translate-x-[-45%]"
			/>
		</div>
		<div
			class="z-10 flex items-center justify-center bg-c-primary/15 text-c-primary
    	{size === 'sm'
				? 'gap-1.5 px-2.5 py-1'
				: size === 'md'
					? 'gap-1.5 px-3 py-1.25'
					: 'gap-1.5 px-4 py-1.25'}"
		>
			{#if productId === undefined || productId === 'free'}
				<IconFreePlan
					class="{size === 'sm'
						? '-ml-0.75 h-4 w-4'
						: size === 'md'
							? '-ml-0.75 h-5 w-5'
							: '-ml-1 h-6 w-6'} flex-shrink-0 text-c-primary"
				/>
			{:else}
				<IconStar
					class="{size === 'sm'
						? '-ml-0.75 h-4 w-4'
						: size === 'md'
							? '-ml-0.75 h-5 w-5'
							: '-ml-1 h-6 w-6'} flex-shrink-0 text-c-primary"
				/>
			{/if}
			<p
				class="{size === 'sm'
					? 'text-sm font-semibold'
					: size === 'md'
						? 'text-base font-semibold'
						: 'text-lg font-semibold'} min-w-0 flex-shrink overflow-hidden overflow-ellipsis whitespace-nowrap"
			>
				{loading ? '----' : planTitle}
			</p>
		</div>
	</a>
{:else}
	<div
		class="z-10 flex-shrink-0 overflow-hidden border-2 border-c-primary/30 bg-c-bg
  	shadow-lg shadow-c-shadow/[var(--o-shadow-normal)] {size === 'sm'
			? 'rounded-lg'
			: size === 'md'
				? 'rounded-lg2'
				: 'rounded-lg2'} {classes}"
	>
		<div
			class="z-10 flex items-center justify-center bg-c-primary/15 text-c-primary
    	{size === 'sm'
				? 'gap-1.5 px-2.5 py-1'
				: size === 'md'
					? 'gap-1.5 px-3 py-1.25'
					: 'gap-1.5 px-4 py-1.25'}"
		>
			{#if productId === undefined || productId === 'free'}
				<IconFreePlan
					class="{size === 'sm'
						? '-ml-0.75 h-4 w-4'
						: size === 'md'
							? '-ml-0.75 h-5 w-5'
							: '-ml-1 h-6 w-6'} flex-shrink-0 text-c-primary"
				/>
			{:else}
				<IconStar
					class="{size === 'sm'
						? '-ml-0.75 h-4 w-4'
						: size === 'md'
							? '-ml-0.75 h-5 w-5'
							: '-ml-1 h-6 w-6'} flex-shrink-0 text-c-primary"
				/>
			{/if}
			<p
				class="{size === 'sm'
					? 'text-sm font-semibold'
					: size === 'md'
						? 'text-base font-semibold'
						: 'text-lg font-semibold'} min-w-0 flex-shrink overflow-hidden overflow-ellipsis whitespace-nowrap"
			>
				{loading ? '----' : planTitle}
			</p>
		</div>
	</div>
{/if}
