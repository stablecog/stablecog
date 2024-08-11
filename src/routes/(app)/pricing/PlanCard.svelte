<script lang="ts">
	import IconTickOnly from '$components/icons/IconTickOnly.svelte';
	import LL, { locale } from '$i18n/i18n-svelte';
	import type { TFeature, TMainFeature } from '$routes/(app)/pricing/types';
	import type { LocalizedString } from 'typesafe-i18n';

	export let isSelected = false;
	export let id: string;
	export let ringClass: string;
	export let badgeText: string | undefined = undefined;
	export let badgeClasses: string | undefined = undefined;
	export let planTitle: string;
	export let discountBadgeText: LocalizedString | undefined = undefined;
	export let discountBadgeType: 'primary' | 'on-bg' = 'primary';
	export let currencyAmount: number;
	export let currencySymbol: string;
	export let features: TFeature[];
	export let mainFeatures: TMainFeature[] | undefined = undefined;
	export let discountRate: number | undefined = undefined;
</script>

<div {id} class="flex w-full items-stretch py-4 sm:max-w-sm md:w-1/2 md:px-2 xl:w-1/4">
	<div
		class="flex w-full flex-col rounded-2xl bg-c-bg p-4
		shadow-xl shadow-c-shadow/[var(--o-shadow-strong)] ring-2 md:rounded-3xl md:p-5 {isSelected
			? 'ring-c-success'
			: ringClass} relative"
	>
		{#if badgeText && badgeClasses}
			<div
				class="absolute -right-2.5 top-0 -translate-y-1/2 transform rounded-full px-3 py-1 text-right text-xs
				font-bold {isSelected ? 'bg-c-success text-c-on-primary' : badgeClasses}"
			>
				{badgeText}
			</div>
		{/if}
		<h3 class="w-full gap-2 py-0.5 text-center text-xl font-semibold text-c-on-bg md:-mt-1.5">
			{planTitle}
		</h3>
		<div
			class="-mx-4 mt-4 w-[100%+2rem] bg-c-bg-secondary text-center text-c-on-bg
			md:-mx-5 md:w-[100%+2.5rem] {discountBadgeText ? 'py-4' : 'py-3'} flex flex-col items-center"
		>
			<h4 class="flex max-w-full flex-wrap items-start justify-center px-2 font-semibold">
				{#if discountBadgeText}
					{#if discountRate !== undefined}<span class="text-xl font-medium text-c-on-bg/50"
							>{currencySymbol}</span
						><span class="pr-0.4ch text-3xl text-c-on-bg/50 line-through">
							{currencyAmount.toLocaleString($locale)}
						</span>
					{/if}<span class="text-xl font-medium">{currencySymbol}</span><span class="text-3xl">
						{(discountRate !== undefined
							? currencyAmount - currencyAmount * discountRate
							: currencyAmount
						).toLocaleString($locale)}
					</span>
				{:else}
					<span class="text-xl font-medium">{currencySymbol}</span><span class="text-3xl">
						{currencyAmount.toLocaleString($locale)}
					</span>
				{/if}
				<span class="mb-0.75 self-end font-medium text-c-on-bg/60">{$LL.Pricing.SlashMonth()}</span>
			</h4>
			{#if discountBadgeText}
				<div class="mt-2 max-w-full px-2 pb-1">
					<p
						class="max-w-full rounded-full {discountBadgeType === 'on-bg'
							? 'bg-c-on-bg/10 text-c-on-bg ring-c-on-bg/20'
							: 'bg-c-primary/15 text-c-primary ring-c-primary/25'} px-2.5 py-0.5 text-sm font-medium ring-1"
					>
						{discountBadgeText}
					</p>
				</div>
			{/if}
		</div>
		<div class="flex w-full flex-1 flex-col">
			{#if mainFeatures}
				<ul class="-mb-2 flex w-full flex-col gap-5 px-1.75 pt-6">
					{#each mainFeatures as mainFeature}
						<h5 class="text-xl font-semibold leading-5">
							{mainFeature.title}<br /><span class="text-base font-normal"
								>{mainFeature.subtitle}</span
							>
						</h5>
					{/each}
				</ul>
			{/if}
			<ul class="flex w-full flex-col gap-2 px-1 pt-6">
				{#each features as feature}
					<li class="flex items-start gap-2.5">
						{#if feature.icon}
							<svelte:component
								this={feature.icon}
								class="mt-1.5px h-5 w-5 flex-shrink-0 text-c-on-bg/80"
							/>
						{:else}
							<IconTickOnly class="mt-1.5px h-5 w-5 flex-shrink-0 text-c-success" />
						{/if}
						<span class="min-w-0 flex-shrink">{feature.paragraph}</span>
					</li>
				{/each}
			</ul>
		</div>
		<div class="mt-6" />
		<slot name="button" />
	</div>
</div>
