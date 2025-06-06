<script lang="ts">
	import { page } from '$app/stores';
	import IconTick from '$components/icons/IconTick.svelte';
	import Button from '$components/primitives/buttons/Button.svelte';
	import MetaTag from '$components/utils/MetaTag.svelte';
	import PageWrapper from '$components/wrappers/PageWrapper.svelte';
	import LL from '$i18n/i18n-svelte';
	import { staticAssetBaseUrl } from '$ts/constants/main';
	import { previewImageVersion } from '$ts/constants/previewImageVersion';
	import {
		STRIPE_CURRENCY_TO_SYMBOL,
		STRIPE_PRODUCT_ID_OBJECTS_SUBSCRIPTIONS
	} from '$ts/constants/stripePublic';
	import { getInfoFromPriceId } from '$ts/helpers/stripe/plan';
	import { userSummary } from '$ts/stores/user/summary';

	export let data;

	const currency = data.currency;

	$: billingInfo =
		$userSummary?.product_id !== undefined && $userSummary?.price_id !== undefined
			? getInfoFromPriceId($LL, $userSummary.price_id)
			: undefined;
	$: currentPlan =
		billingInfo && $userSummary?.product_id !== undefined && $userSummary?.price_id !== undefined
			? {
					title: billingInfo.title,
					amount:
						currency === 'eur'
							? billingInfo.billingType === 'yearly'
								? STRIPE_PRODUCT_ID_OBJECTS_SUBSCRIPTIONS[$userSummary.product_id].prices.yearly[
										$userSummary.price_id
									].currencies.eur.amount
								: STRIPE_PRODUCT_ID_OBJECTS_SUBSCRIPTIONS[$userSummary.product_id].prices.monthly[
										$userSummary.price_id
									].currencies.eur.amount
							: billingInfo.billingType === 'yearly'
								? STRIPE_PRODUCT_ID_OBJECTS_SUBSCRIPTIONS[$userSummary.product_id].prices.yearly[
										$userSummary.price_id
									].currencies.usd.amount
								: STRIPE_PRODUCT_ID_OBJECTS_SUBSCRIPTIONS[$userSummary.product_id].prices.monthly[
										$userSummary.price_id
									].currencies.usd.amount
				}
			: undefined;
</script>

<MetaTag
	title="Change Plan | Stablecog"
	description="Change your Stablecog subscription plan. Free, multilingual and open-source AI image generator using Stable Diffusion, FLUX, and Kandinsky."
	image_url="{staticAssetBaseUrl}/previews/home-{previewImageVersion}.png"
/>

<PageWrapper>
	<div class="my-auto flex w-full flex-col items-center justify-start">
		<IconTick class="h-24 w-24 text-c-primary" />
		<h1 class="mt-4 text-center text-4xl font-bold text-c-primary">
			{$LL.Account.Subscription.Succeeded.PageTitle()}
		</h1>
		<p class="mt-4 max-w-xl text-center leading-relaxed text-c-on-bg/75">
			{$LL.Account.Subscription.Succeeded.PageParagraph()}
		</p>
		{#if currentPlan}
			<div
				class="mt-5 flex w-full max-w-sm flex-col items-start rounded-2xl bg-c-bg p-4 shadow-xl shadow-c-shadow/[var(--o-shadow-normal)]
				ring-2 ring-c-bg-secondary"
			>
				<p class="px-1 text-sm text-c-on-bg/60">{$LL.Account.Subscription.NewPlanTitle()}</p>
				<p class="mt-1 w-full px-1 text-left text-2xl font-bold text-c-on-bg">
					{currentPlan.title}<span
						class="ml-2 rounded-md bg-c-primary/15 px-1.5 py-0.75 text-base font-medium text-c-primary"
						>{STRIPE_CURRENCY_TO_SYMBOL[currency]}{currentPlan.amount}{billingInfo?.billingType ===
						'yearly'
							? $LL.Pricing.SlashYear()
							: $LL.Pricing.SlashMonth()}</span
					>
				</p>
			</div>
		{/if}
		<Button href="/generate" withSpinner class="mt-6">{$LL.Shared.StartGeneratingButton()}</Button>
	</div>
</PageWrapper>
