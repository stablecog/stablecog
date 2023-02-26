<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$components/buttons/Button.svelte';
	import MetaTag from '$components/MetaTag.svelte';
	import LL, { locale } from '$i18n/i18n-svelte';
	import { apiUrl, canonicalUrl } from '$ts/constants/main';
	import type Stripe from 'stripe';
	import PageWrapper from '$components/PageWrapper.svelte';
	import SignInCard from '$components/SignInCard.svelte';
	import { clickoutside } from '$ts/actions/clickoutside';
	import { fade, fly } from 'svelte/transition';
	import { quadOut } from 'svelte/easing';
	import { portal } from 'svelte-portal';
	import type { PageData } from './$types';
	import {
		PUBLIC_STRIPE_PRICE_ID_STARTER_MO_TEST,
		PUBLIC_STRIPE_PRICE_ID_PRO_MO_TEST,
		PUBLIC_STRIPE_PRICE_ID_ULTIMATE_MO_TEST,
		PUBLIC_STRIPE_PRODUCT_ID_STARTER_TEST,
		PUBLIC_STRIPE_PRODUCT_ID_PRO_TEST,
		PUBLIC_STRIPE_PRODUCT_ID_ULTIMATE_TEST
	} from '$env/static/public';
	import { STRIPE_CURRENCY_TO_SYMBOL, STRIPE_PRODUCT_ID_OBJECTS } from '$ts/constants/stripePublic';
	import { userSummary } from '$ts/stores/user/summary';

	export let data: PageData;

	$: cards = [
		{
			title: $LL.Pricing.Plans.StarterTitle(),
			priceIdMo: PUBLIC_STRIPE_PRICE_ID_STARTER_MO_TEST,
			productId: PUBLIC_STRIPE_PRODUCT_ID_STARTER_TEST,
			currency: data.currency,
			currencySymbol: STRIPE_CURRENCY_TO_SYMBOL[data.currency],
			amount:
				data.currency === 'eur'
					? STRIPE_PRODUCT_ID_OBJECTS[PUBLIC_STRIPE_PRODUCT_ID_STARTER_TEST].prices[
							PUBLIC_STRIPE_PRICE_ID_STARTER_MO_TEST
					  ].currencies.eur.amount
					: STRIPE_PRODUCT_ID_OBJECTS[PUBLIC_STRIPE_PRODUCT_ID_STARTER_TEST].prices[
							PUBLIC_STRIPE_PRICE_ID_STARTER_MO_TEST
					  ].currencies.usd.amount,
			features: [
				`${$LL.Pricing.Features.MonthlyImages({
					count:
						STRIPE_PRODUCT_ID_OBJECTS[
							PUBLIC_STRIPE_PRODUCT_ID_STARTER_TEST
						].monthly_images.toLocaleString($locale)
				})}`,
				$LL.Pricing.Features.CommercialUse(),
				$LL.Pricing.Features.ImagesArePublic()
			],
			ringClass: 'ring-c-bg-secondary'
		},
		{
			title: $LL.Pricing.Plans.ProTitle(),
			priceIdMo: PUBLIC_STRIPE_PRICE_ID_PRO_MO_TEST,
			productId: PUBLIC_STRIPE_PRODUCT_ID_PRO_TEST,
			currency: data.currency,
			currencySymbol: STRIPE_CURRENCY_TO_SYMBOL[data.currency],
			amount:
				data.currency === 'eur'
					? STRIPE_PRODUCT_ID_OBJECTS[PUBLIC_STRIPE_PRODUCT_ID_PRO_TEST].prices[
							PUBLIC_STRIPE_PRICE_ID_PRO_MO_TEST
					  ].currencies.eur.amount
					: STRIPE_PRODUCT_ID_OBJECTS[PUBLIC_STRIPE_PRODUCT_ID_PRO_TEST].prices[
							PUBLIC_STRIPE_PRICE_ID_PRO_MO_TEST
					  ].currencies.usd.amount,
			features: [
				`${$LL.Pricing.Features.MonthlyImages({
					count:
						STRIPE_PRODUCT_ID_OBJECTS[
							PUBLIC_STRIPE_PRODUCT_ID_PRO_TEST
						].monthly_images.toLocaleString($locale)
				})}`,
				$LL.Pricing.Features.CommercialUse(),
				$LL.Pricing.Features.ImagesArePrivate()
			],
			ringClass: 'ring-c-bg-secondary',
			badgeText: $LL.Pricing.Badges.Recommended(),
			badgeClasses: 'bg-c-primary text-c-on-primary'
		},
		{
			title: $LL.Pricing.Plans.UltimateTitle(),
			priceIdMo: PUBLIC_STRIPE_PRICE_ID_ULTIMATE_MO_TEST,
			productId: PUBLIC_STRIPE_PRODUCT_ID_ULTIMATE_TEST,
			currency: data.currency,
			currencySymbol: STRIPE_CURRENCY_TO_SYMBOL[data.currency],
			amount:
				data.currency === 'eur'
					? STRIPE_PRODUCT_ID_OBJECTS[PUBLIC_STRIPE_PRODUCT_ID_ULTIMATE_TEST].prices[
							PUBLIC_STRIPE_PRICE_ID_ULTIMATE_MO_TEST
					  ].currencies.eur.amount
					: STRIPE_PRODUCT_ID_OBJECTS[PUBLIC_STRIPE_PRODUCT_ID_ULTIMATE_TEST].prices[
							PUBLIC_STRIPE_PRICE_ID_ULTIMATE_MO_TEST
					  ].currencies.usd.amount,
			features: [
				`${$LL.Pricing.Features.MonthlyImages({
					count:
						STRIPE_PRODUCT_ID_OBJECTS[
							PUBLIC_STRIPE_PRODUCT_ID_ULTIMATE_TEST
						].monthly_images.toLocaleString($locale)
				})}`,
				$LL.Pricing.Features.CommercialUse(),
				$LL.Pricing.Features.ImagesArePrivate()
			],
			ringClass: 'ring-c-bg-secondary'
		}
	];

	let checkoutCreationStatus: 'idle' | 'loading' | 'success' | 'error' = 'idle';
	let isSignInModalOpen = false;
	let selectedPriceId: string | undefined = undefined;

	async function createCheckoutSessionAndRedirect({
		priceId,
		currency
	}: {
		priceId: string;
		currency: string;
	}) {
		selectedPriceId = priceId;
		try {
			checkoutCreationStatus = 'loading';
			const res = await fetch(`${apiUrl.origin}/v1/user/subscription/checkout`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${$page.data.session?.access_token}`
				},
				body: JSON.stringify({
					target_price_id: priceId,
					success_url: `${window.location.origin}/pricing/purchase/succeeded`,
					cancel_url: `${window.location.origin}/pricing/purchase/cancelled`,
					currency
				})
			});
			const resJson: TCheckoutSessionRes = await res.json();
			if (resJson.error) {
				throw new Error(resJson.error);
			}
			const { checkout_url } = resJson;
			if (!checkout_url) {
				throw new Error('No checkout session url returned');
			}
			await goto(checkout_url);
			checkoutCreationStatus = 'success';
		} catch (error) {
			checkoutCreationStatus = 'error';
			selectedPriceId = undefined;
			console.log(error);
		}
	}

	interface TCheckoutSessionRes {
		checkout_url?: string;
		error?: string;
	}
</script>

<MetaTag
	title="Pricing | Stablecog"
	description="Choose a plan that works for you and start using Stablecog."
	imageUrl="{canonicalUrl}/previews{$page.url.pathname}.png"
	canonical="{canonicalUrl}{$page.url.pathname}"
/>

<PageWrapper>
	<div class="w-full flex flex-col items-center justify-start my-auto">
		<h1 class="text-center font-bold text-4xl">{$LL.Pricing.PageTitle()}</h1>
		<p class="max-w-xl mt-3 text-center leading-relaxed text-c-on-bg/75">
			{$LL.Pricing.PageParagraph()}
		</p>
		<div class="w-full max-w-7xl flex flex-wrap justify-center gap-6 mt-10">
			{#each cards as card}
				{@const subscribedProductId = cards.find(
					(c) => c.productId === $userSummary?.product_id
				)?.productId}
				{@const subscribedAmount = cards.find(
					(c) => c.productId === $userSummary?.product_id
				)?.amount}
				{@const isSubscribed = subscribedProductId === card.productId}
				{@const isUpgrade = subscribedAmount !== undefined && subscribedAmount < card.amount}
				{@const isDowngrade = subscribedAmount !== undefined && subscribedAmount > card.amount}
				<div
					class="w-full max-w-[22rem] bg-c-bg shadow-xl shadow-c-shadow/[var(--o-shadow-strong)] 
					 p-4 md:p-5 rounded-2xl md:rounded-3xl ring-2 {isSubscribed
						? 'ring-c-success'
						: card.ringClass} relative"
				>
					{#if card.badgeText && card.badgeClasses && !isDowngrade}
						<div
							class="absolute -right-3 -top-3 rounded-full px-4 py-2 text-sm text-right 
							font-bold {isSubscribed ? 'bg-c-success text-c-on-primary' : card.badgeClasses}"
						>
							{card.badgeText}
						</div>
					{/if}
					<h2 class="w-full text-c-on-bg text-center font-bold text-xl md:-mt-1.5 py-0.5 gap-2">
						{card.title}
					</h2>
					<h3
						class="w-[100%+2rem] md:w-[100%+2.5rem] -mx-4 md:-mx-5 text-center bg-c-bg-secondary 
						text-c-on-bg mt-4 py-3 font-bold flex justify-center items-start"
					>
						<span class="text-xl">{card.currencySymbol}</span><span class="text-3xl font-bold">
							{card.amount.toLocaleString($locale)}
						</span>
						<span class="self-end mb-0.75 text-c-on-bg/60 font-medium"
							>{$LL.Pricing.SlashMonth()}</span
						>
					</h3>
					<ul class="w-full mt-6 flex flex-col gap-3 px-1">
						{#each card.features as feature}
							<li class="flex items-center gap-3">
								<span class="text-c-on-bg/60">-</span>
								{feature}
							</li>
						{/each}
					</ul>
					{#if $page.data.session?.user.email}
						<Button
							withSpinner
							type={isSubscribed ? 'success' : 'primary'}
							disabled={isSubscribed}
							loading={card.priceIdMo === selectedPriceId && checkoutCreationStatus === 'loading'}
							onClick={() =>
								createCheckoutSessionAndRedirect({
									priceId: card.priceIdMo,
									currency: card.currency
								})}
							class="w-full mt-8"
						>
							{#if isSubscribed}
								{$LL.Pricing.SubscribedButton()}
							{:else if isUpgrade}
								{$LL.Pricing.UpgradeButton()}
							{:else if isDowngrade}
								{$LL.Pricing.DowngradeButton()}
							{:else}
								{$LL.Pricing.SubscribeButton()}
							{/if}
						</Button>
					{:else}
						<Button onClick={() => (isSignInModalOpen = true)} class="w-full mt-8">
							{$LL.Pricing.SubscribeButton()}
						</Button>
					{/if}
				</div>
			{/each}
		</div>
		<div class="w-full h-[1vh]" />
	</div>
</PageWrapper>

{#if isSignInModalOpen && !$page.data.session?.user.id}
	<div
		use:portal={'body'}
		transition:fade|local={{ duration: 300, easing: quadOut }}
		class="w-full h-full bg-c-barrier/80 fixed left-0 top-0 px-3 z-[10000]"
	/>
	<div
		use:portal={'body'}
		transition:fly|local={{ duration: 200, y: 50, easing: quadOut }}
		class="w-full h-full flex flex-col items-center fixed left-0 top-0 px-3 py-20 z-[10001] overflow-auto"
	>
		<div
			use:clickoutside={{ callback: () => (isSignInModalOpen = false) }}
			class="w-full max-w-2xl flex justify-center my-auto"
		>
			<SignInCard isModal={true} redirectTo={$page.url.pathname} />
		</div>
	</div>
{/if}
