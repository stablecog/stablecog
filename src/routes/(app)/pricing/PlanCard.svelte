<script lang="ts">
	import IconTickOnly from '$components/icons/IconTickOnly.svelte';
	import LL, { locale } from '$i18n/i18n-svelte';
	import type { TFeature } from '$routes/(app)/pricing/types';
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
	export let discountRate: number | undefined = undefined;
</script>

<div {id} class="w-full sm:max-w-sm md:w-1/2 xl:w-1/4 px-3 py-4 flex items-stretch">
	<div
		class="w-full flex flex-col bg-c-bg shadow-xl shadow-c-shadow/[var(--o-shadow-strong)]
		p-4 md:p-5 rounded-2xl md:rounded-3xl ring-2 {isSelected ? 'ring-c-success' : ringClass} relative"
	>
		{#if badgeText && badgeClasses}
			<div
				class="absolute -right-2.5 -top-3 rounded-full px-3.5 py-1.5 text-xs text-right
				font-bold {isSelected ? 'bg-c-success text-c-on-primary' : badgeClasses}"
			>
				{badgeText}
			</div>
		{/if}
		<h3 class="w-full text-c-on-bg text-center font-semibold text-xl md:-mt-1.5 py-0.5 gap-2">
			{planTitle}
		</h3>
		<div
			class="w-[100%+2rem] md:w-[100%+2.5rem] -mx-4 md:-mx-5 text-center bg-c-bg-secondary
			text-c-on-bg mt-4 {discountBadgeText ? 'py-4' : 'py-3'} flex flex-col items-center"
		>
			<h4 class="max-w-full flex flex-wrap justify-center items-start px-2 font-semibold">
				{#if discountBadgeText}
					{#if discountRate !== undefined}<span class="text-xl font-medium text-c-on-bg/50"
							>{currencySymbol}</span
						><span class="text-3xl text-c-on-bg/50 line-through pr-0.4ch">
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
				<span class="self-end mb-0.75 text-c-on-bg/60 font-medium">{$LL.Pricing.SlashMonth()}</span>
			</h4>
			{#if discountBadgeText}
				<div class="max-w-full px-2 mt-2 pb-1">
					<p
						class="max-w-full rounded-full {discountBadgeType === 'on-bg'
							? 'bg-c-on-bg/10 ring-c-on-bg/20 text-c-on-bg'
							: 'bg-c-primary/15 ring-c-primary/25 text-c-primary'} ring-1 text-sm font-medium px-2.5 py-0.5"
					>
						{discountBadgeText}
					</p>
				</div>
			{/if}
		</div>
		<ul class="w-full py-6 flex flex-col gap-2.5 px-1 flex-1">
			{#each features as feature}
				<li class="flex items-start gap-3">
					{#if feature.icon}
						<svelte:component
							this={feature.icon}
							class="w-5 h-5 text-c-on-bg/80 mt-1.5px flex-shrink-0"
						/>
					{:else}
						<IconTickOnly class="w-5 h-5 text-c-success mt-1.5px flex-shrink-0" />
					{/if}
					<span class="flex-shrink min-w-0">{feature.paragraph}</span>
				</li>
			{/each}
		</ul>
		<slot name="button" />
	</div>
</div>
