<script lang="ts">
	import { page } from '$app/stores';
	import Button from '$components/buttons/Button.svelte';
	import IconTick from '$components/icons/IconTick.svelte';
	import MetaTag from '$components/MetaTag.svelte';
	import PageWrapper from '$components/PageWrapper.svelte';
	import LL from '$i18n/i18n-svelte';
	import { canonicalUrl } from '$ts/constants/main';
	import { previewImageVersion } from '$ts/constants/previewImageVersion';
	import {
		STRIPE_CURRENCY_TO_SYMBOL,
		STRIPE_PRODUCT_ID_OBJECTS_SUBSCRIPTIONS_MO
	} from '$ts/constants/stripePublic';
	import { getTitleFromProductId } from '$ts/helpers/stripe/plan';
	import { userSummary } from '$ts/stores/user/summary';
	import type { PageServerData } from './$types';

	export let data: PageServerData;

	const currency = data.currency;

	$: currentPlan =
		$userSummary?.product_id !== undefined && $userSummary?.price_id !== undefined
			? {
					title: getTitleFromProductId($LL, $userSummary.product_id),
					amount:
						currency === 'eur'
							? STRIPE_PRODUCT_ID_OBJECTS_SUBSCRIPTIONS_MO[$userSummary.product_id].prices[
									$userSummary.price_id
							  ].currencies.eur.amount
							: STRIPE_PRODUCT_ID_OBJECTS_SUBSCRIPTIONS_MO[$userSummary.product_id].prices[
									$userSummary.price_id
							  ].currencies.usd.amount
			  }
			: undefined;
</script>

<MetaTag
	title="Change Plan | Stablecog"
	description="Change your Stablecog subscription plan. Free, multilingual and open-source AI image generator using Stable Diffusion and Kandinsky."
	image_url="{canonicalUrl}/previews{$page.url.pathname}-{previewImageVersion}.png"
/>

<PageWrapper>
	<div class="w-full flex flex-col items-center justify-start my-auto">
		<IconTick class="w-24 h-24 text-c-primary" />
		<h1 class="text-center font-bold text-4xl mt-4 text-c-primary">
			{$LL.Account.Subscription.Succeeded.PageTitle()}
		</h1>
		<p class="max-w-xl mt-4 leading-relaxed text-center text-c-on-bg/75">
			{$LL.Account.Subscription.Succeeded.PageParagraph()}
		</p>
		{#if currentPlan}
			<div
				class="w-full max-w-sm flex flex-col items-start p-4 rounded-2xl bg-c-bg ring-2 ring-c-bg-secondary mt-5
				shadow-xl shadow-c-shadow/[var(--o-shadow-normal)]"
			>
				<p class="text-sm text-c-on-bg/60 px-1">{$LL.Account.Subscription.NewPlanTitle()}</p>
				<p class="w-full text-left font-bold text-2xl mt-1 text-c-on-bg px-1">
					{currentPlan.title}<span
						class="text-base bg-c-primary/15 font-medium text-c-primary px-1.5 py-0.75 rounded-md ml-2"
						>{STRIPE_CURRENCY_TO_SYMBOL[
							currency
						]}{currentPlan.amount}{$LL.Pricing.SlashMonth()}</span
					>
				</p>
			</div>
		{/if}
		<Button href="/generate" withSpinner class="mt-6">{$LL.Shared.StartGeneratingButton()}</Button>
	</div>
</PageWrapper>
