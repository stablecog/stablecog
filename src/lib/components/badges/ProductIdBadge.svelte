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
		class="bg-c-bg border-2 overflow-hidden z-10 shadow-lg flex-shrink-0
  	shadow-c-shadow/[var(--o-shadow-normal)] group relative border-c-primary/30 {size === 'sm'
			? 'rounded-lg'
			: size === 'md'
			? 'rounded-lg2'
			: 'rounded-lg2'} {classes}"
	>
		<div
			class="w-[200%] h-full absolute left-0 top-0 items-center justify-center hidden not-touch:flex"
		>
			<div
				class="w-full aspect-square origin-left rounded-full transition transform -translate-x-full
				bg-c-primary/15 not-touch:group-hover:translate-x-[-45%]"
			/>
		</div>
		<div
			class="flex items-center justify-center z-10 text-c-primary bg-c-primary/15
    	{size === 'sm'
				? 'gap-1.5 px-2.5 py-1'
				: size === 'md'
				? 'gap-1.5 px-3 py-1.25'
				: 'gap-1.5 px-4 py-1.25'}"
		>
			{#if productId === undefined || productId === 'free'}
				<IconFreePlan
					class="{size === 'sm'
						? 'w-4 h-4 -ml-0.75'
						: size === 'md'
						? 'w-5 h-5 -ml-0.75'
						: 'w-6 h-6 -ml-1'} flex-shrink-0 text-c-primary"
				/>
			{:else}
				<IconStar
					class="{size === 'sm'
						? 'w-4 h-4 -ml-0.75'
						: size === 'md'
						? 'w-5 h-5 -ml-0.75'
						: 'w-6 h-6 -ml-1'} flex-shrink-0 text-c-primary"
				/>
			{/if}
			<p
				class="{size === 'sm'
					? 'text-sm font-semibold'
					: size === 'md'
					? 'text-base font-semibold'
					: 'text-lg font-semibold'} flex-shrink min-w-0 overflow-hidden overflow-ellipsis whitespace-nowrap"
			>
				{loading ? '----' : planTitle}
			</p>
		</div>
	</a>
{:else}
	<div
		class="bg-c-bg border-2 overflow-hidden z-10 shadow-lg flex-shrink-0
  	shadow-c-shadow/[var(--o-shadow-normal)] border-c-primary/30 {size === 'sm'
			? 'rounded-lg'
			: size === 'md'
			? 'rounded-lg2'
			: 'rounded-lg2'} {classes}"
	>
		<div
			class="flex items-center justify-center z-10 text-c-primary bg-c-primary/15
    	{size === 'sm'
				? 'gap-1.5 px-2.5 py-1'
				: size === 'md'
				? 'gap-1.5 px-3 py-1.25'
				: 'gap-1.5 px-4 py-1.25'}"
		>
			{#if productId === undefined || productId === 'free'}
				<IconFreePlan
					class="{size === 'sm'
						? 'w-4 h-4 -ml-0.75'
						: size === 'md'
						? 'w-5 h-5 -ml-0.75'
						: 'w-6 h-6 -ml-1'} flex-shrink-0 text-c-primary"
				/>
			{:else}
				<IconStar
					class="{size === 'sm'
						? 'w-4 h-4 -ml-0.75'
						: size === 'md'
						? 'w-5 h-5 -ml-0.75'
						: 'w-6 h-6 -ml-1'} flex-shrink-0 text-c-primary"
				/>
			{/if}
			<p
				class="{size === 'sm'
					? 'text-sm font-semibold'
					: size === 'md'
					? 'text-base font-semibold'
					: 'text-lg font-semibold'} flex-shrink min-w-0 overflow-hidden overflow-ellipsis whitespace-nowrap"
			>
				{loading ? '----' : planTitle}
			</p>
		</div>
	</div>
{/if}
