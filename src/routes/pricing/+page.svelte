<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$components/buttons/Button.svelte';
	import MetaTag from '$components/MetaTag.svelte';
	import LL, { locale } from '$i18n/i18n-svelte';
	import { apiUrl, canonicalUrl } from '$ts/constants/main';
	import PageWrapper from '$components/PageWrapper.svelte';
	import SignInCard from '$components/SignInCard.svelte';
	import { clickoutside } from '$ts/actions/clickoutside';
	import { fade, fly } from 'svelte/transition';
	import { quadOut } from 'svelte/easing';
	import { portal } from 'svelte-portal';
	import type { PageData } from './$types';
	import {
		PUBLIC_STRIPE_PRICE_ID_STARTER_SUBSCRIPTION_MO,
		PUBLIC_STRIPE_PRICE_ID_PRO_SUBSCRIPTION_MO,
		PUBLIC_STRIPE_PRICE_ID_ULTIMATE_SUBSCRIPTION_MO,
		PUBLIC_STRIPE_PRODUCT_ID_STARTER_SUBSCRIPTION,
		PUBLIC_STRIPE_PRODUCT_ID_PRO_SUBSCRIPTION,
		PUBLIC_STRIPE_PRODUCT_ID_ULTIMATE_SUBSCRIPTION,
		PUBLIC_STRIPE_PRICE_ID_MEDIUM_PACK,
		PUBLIC_STRIPE_PRODUCT_ID_MEDIUM_PACK,
		PUBLIC_STRIPE_PRODUCT_ID_LARGE_PACK,
		PUBLIC_STRIPE_PRICE_ID_LARGE_PACK
	} from '$env/static/public';
	import {
		STRIPE_CURRENCY_TO_SYMBOL,
		STRIPE_PRODUCT_ID_OBJECTS_SUBSCRIPTIONS_MO,
		STRIPE_PRODUCT_ID_OBJECTS_CREDIT_PACKS
	} from '$ts/constants/stripePublic';
	import { userSummary } from '$ts/stores/user/summary';
	import { downgradeSubscription } from '$ts/helpers/user/user';

	export let data: PageData;

	$: subscriptionCards = [
		{
			title: $LL.Pricing.Plans.StarterTitle(),
			priceIdMo: PUBLIC_STRIPE_PRICE_ID_STARTER_SUBSCRIPTION_MO,
			productId: PUBLIC_STRIPE_PRODUCT_ID_STARTER_SUBSCRIPTION,
			currency: data.currency,
			currencySymbol: STRIPE_CURRENCY_TO_SYMBOL[data.currency],
			amount:
				data.currency === 'eur'
					? STRIPE_PRODUCT_ID_OBJECTS_SUBSCRIPTIONS_MO[
							PUBLIC_STRIPE_PRODUCT_ID_STARTER_SUBSCRIPTION
					  ].prices[PUBLIC_STRIPE_PRICE_ID_STARTER_SUBSCRIPTION_MO].currencies.eur.amount
					: STRIPE_PRODUCT_ID_OBJECTS_SUBSCRIPTIONS_MO[
							PUBLIC_STRIPE_PRODUCT_ID_STARTER_SUBSCRIPTION
					  ].prices[PUBLIC_STRIPE_PRICE_ID_STARTER_SUBSCRIPTION_MO].currencies.usd.amount,
			features: [
				`${$LL.Pricing.Features.MonthlyImages({
					count:
						STRIPE_PRODUCT_ID_OBJECTS_SUBSCRIPTIONS_MO[
							PUBLIC_STRIPE_PRODUCT_ID_STARTER_SUBSCRIPTION
						].monthly_images.toLocaleString($locale)
				})}`,
				$LL.Pricing.Features.CommercialUse(),
				$LL.Pricing.Features.ImagesArePublic()
			],
			ringClass: 'ring-c-bg-secondary'
		},
		{
			title: $LL.Pricing.Plans.ProTitle(),
			priceIdMo: PUBLIC_STRIPE_PRICE_ID_PRO_SUBSCRIPTION_MO,
			productId: PUBLIC_STRIPE_PRODUCT_ID_PRO_SUBSCRIPTION,
			currency: data.currency,
			currencySymbol: STRIPE_CURRENCY_TO_SYMBOL[data.currency],
			amount:
				data.currency === 'eur'
					? STRIPE_PRODUCT_ID_OBJECTS_SUBSCRIPTIONS_MO[PUBLIC_STRIPE_PRODUCT_ID_PRO_SUBSCRIPTION]
							.prices[PUBLIC_STRIPE_PRICE_ID_PRO_SUBSCRIPTION_MO].currencies.eur.amount
					: STRIPE_PRODUCT_ID_OBJECTS_SUBSCRIPTIONS_MO[PUBLIC_STRIPE_PRODUCT_ID_PRO_SUBSCRIPTION]
							.prices[PUBLIC_STRIPE_PRICE_ID_PRO_SUBSCRIPTION_MO].currencies.usd.amount,
			features: [
				`${$LL.Pricing.Features.MonthlyImages({
					count:
						STRIPE_PRODUCT_ID_OBJECTS_SUBSCRIPTIONS_MO[
							PUBLIC_STRIPE_PRODUCT_ID_PRO_SUBSCRIPTION
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
			priceIdMo: PUBLIC_STRIPE_PRICE_ID_ULTIMATE_SUBSCRIPTION_MO,
			productId: PUBLIC_STRIPE_PRODUCT_ID_ULTIMATE_SUBSCRIPTION,
			currency: data.currency,
			currencySymbol: STRIPE_CURRENCY_TO_SYMBOL[data.currency],
			amount:
				data.currency === 'eur'
					? STRIPE_PRODUCT_ID_OBJECTS_SUBSCRIPTIONS_MO[
							PUBLIC_STRIPE_PRODUCT_ID_ULTIMATE_SUBSCRIPTION
					  ].prices[PUBLIC_STRIPE_PRICE_ID_ULTIMATE_SUBSCRIPTION_MO].currencies.eur.amount
					: STRIPE_PRODUCT_ID_OBJECTS_SUBSCRIPTIONS_MO[
							PUBLIC_STRIPE_PRODUCT_ID_ULTIMATE_SUBSCRIPTION
					  ].prices[PUBLIC_STRIPE_PRICE_ID_ULTIMATE_SUBSCRIPTION_MO].currencies.usd.amount,
			features: [
				`${$LL.Pricing.Features.MonthlyImages({
					count:
						STRIPE_PRODUCT_ID_OBJECTS_SUBSCRIPTIONS_MO[
							PUBLIC_STRIPE_PRODUCT_ID_ULTIMATE_SUBSCRIPTION
						].monthly_images.toLocaleString($locale)
				})}`,
				$LL.Pricing.Features.CommercialUse(),
				$LL.Pricing.Features.ImagesArePrivate()
			],
			ringClass: 'ring-c-bg-secondary'
		}
	];

	$: creditPackCards = [
		{
			title: $LL.Pricing.CreditPacks.MediumTitle(),
			priceId: PUBLIC_STRIPE_PRICE_ID_MEDIUM_PACK,
			productId: PUBLIC_STRIPE_PRICE_ID_MEDIUM_PACK,
			currency: data.currency,
			currencySymbol: STRIPE_CURRENCY_TO_SYMBOL[data.currency],
			amount:
				data.currency === 'eur'
					? STRIPE_PRODUCT_ID_OBJECTS_CREDIT_PACKS[PUBLIC_STRIPE_PRODUCT_ID_MEDIUM_PACK].prices[
							PUBLIC_STRIPE_PRICE_ID_MEDIUM_PACK
					  ].currencies.eur.amount
					: STRIPE_PRODUCT_ID_OBJECTS_CREDIT_PACKS[PUBLIC_STRIPE_PRODUCT_ID_MEDIUM_PACK].prices[
							PUBLIC_STRIPE_PRICE_ID_MEDIUM_PACK
					  ].currencies.usd.amount,
			features: [
				$LL.Pricing.Features.Images({
					count:
						STRIPE_PRODUCT_ID_OBJECTS_CREDIT_PACKS[
							PUBLIC_STRIPE_PRODUCT_ID_MEDIUM_PACK
						].images.toLocaleString($locale)
				}),
				$LL.Pricing.Features.NeverExpires()
			],
			ringClass: 'ring-c-bg-secondary',
			badgeText: undefined,
			badgeClasses: undefined
		},
		{
			title: $LL.Pricing.CreditPacks.LargeTitle(),
			priceId: PUBLIC_STRIPE_PRICE_ID_LARGE_PACK,
			productId: PUBLIC_STRIPE_PRICE_ID_LARGE_PACK,
			currency: data.currency,
			currencySymbol: STRIPE_CURRENCY_TO_SYMBOL[data.currency],
			amount:
				data.currency === 'eur'
					? STRIPE_PRODUCT_ID_OBJECTS_CREDIT_PACKS[PUBLIC_STRIPE_PRODUCT_ID_LARGE_PACK].prices[
							PUBLIC_STRIPE_PRICE_ID_LARGE_PACK
					  ].currencies.eur.amount
					: STRIPE_PRODUCT_ID_OBJECTS_CREDIT_PACKS[PUBLIC_STRIPE_PRODUCT_ID_LARGE_PACK].prices[
							PUBLIC_STRIPE_PRICE_ID_LARGE_PACK
					  ].currencies.usd.amount,
			features: [
				$LL.Pricing.Features.Images({
					count:
						STRIPE_PRODUCT_ID_OBJECTS_CREDIT_PACKS[
							PUBLIC_STRIPE_PRODUCT_ID_LARGE_PACK
						].images.toLocaleString($locale)
				}),
				$LL.Pricing.Features.NeverExpires()
			],
			ringClass: 'ring-c-bg-secondary',
			badgeText: undefined,
			badgeClasses: undefined
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
		<section id="plans" class="w-full flex flex-col items-center justify-start">
			<h1 class="text-center font-bold text-4xl">{$LL.Pricing.PlansTitle()}</h1>
			<p class="max-w-xl mt-3 text-center leading-relaxed text-c-on-bg/75">
				{$LL.Pricing.PlansParagraph()}
			</p>
			<div class="w-full max-w-7xl flex flex-wrap justify-center gap-7 mt-9">
				{#each subscriptionCards as card}
					{@const subscribedProductId = subscriptionCards.find(
						(c) => c.productId === $userSummary?.product_id
					)?.productId}
					{@const subscribedAmount = subscriptionCards.find(
						(c) => c.productId === $userSummary?.product_id
					)?.amount}
					{@const isSubscribed =
						subscribedProductId === card.productId && $page.data.session?.user.id !== undefined}
					{@const isUpgrade =
						subscribedAmount !== undefined &&
						subscribedAmount < card.amount &&
						$page.data.session?.user.id !== undefined}
					{@const isDowngrade =
						subscribedAmount !== undefined &&
						subscribedAmount > card.amount &&
						$page.data.session?.user.id !== undefined}
					<div
						class="w-full max-w-md md:max-w-[20rem] bg-c-bg shadow-xl shadow-c-shadow/[var(--o-shadow-strong)] 
					 	p-4 md:p-5 rounded-2xl md:rounded-3xl ring-2 {isSubscribed
							? 'ring-c-success'
							: card.ringClass} relative"
					>
						{#if card.badgeText && card.badgeClasses && !isDowngrade}
							<div
								class="absolute -right-3 -top-4 rounded-full px-3.5 py-1.5 text-sm text-right 
								font-bold {isSubscribed ? 'bg-c-success text-c-on-primary' : card.badgeClasses}"
							>
								{card.badgeText}
							</div>
						{/if}
						<h3 class="w-full text-c-on-bg text-center font-bold text-xl md:-mt-1.5 py-0.5 gap-2">
							{card.title}
						</h3>
						<h4
							class="w-[100%+2rem] md:w-[100%+2.5rem] -mx-4 md:-mx-5 text-center bg-c-bg-secondary 
							text-c-on-bg mt-4 py-3 font-bold flex justify-center items-start"
						>
							<span class="text-xl">{card.currencySymbol}</span><span class="text-3xl font-bold">
								{card.amount.toLocaleString($locale)}
							</span>
							<span class="self-end mb-0.75 text-c-on-bg/60 font-medium"
								>{$LL.Pricing.SlashMonth()}</span
							>
						</h4>
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
								href={isDowngrade
									? `/account/subscription/downgrade?price_id=${
											card.priceIdMo
									  }&from=${encodeURIComponent($page.url.pathname)}`
									: undefined}
								onClick={() =>
									!isDowngrade
										? createCheckoutSessionAndRedirect({
												priceId: card.priceIdMo,
												currency: card.currency
										  })
										: null}
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
		</section>
		{#if $userSummary?.product_id && $page.data.session?.user.id !== undefined}
			<section id="credit-packs" class="w-full flex flex-col items-center justify-start mt-12">
				<h2 class="text-center font-bold text-4xl">{$LL.Pricing.CreditPacksTitle()}</h2>
				<p class="max-w-xl mt-3 text-center leading-relaxed text-c-on-bg/75">
					{$LL.Pricing.CreditPacksParagraph()}
				</p>
				<div class="w-full max-w-7xl flex flex-wrap justify-center gap-7 mt-8">
					{#each creditPackCards as card}
						<div
							class="w-full max-w-md md:max-w-[20rem] bg-c-bg shadow-xl shadow-c-shadow/[var(--o-shadow-strong)] 
							p-4 md:p-5 rounded-2xl md:rounded-3xl ring-2 {card.ringClass} relative"
						>
							{#if card.badgeText && card.badgeClasses}
								<div
									class="absolute -right-3 -top-4 rounded-full px-3.5 py-1.5 text-sm text-right 
									font-bold {card.badgeClasses}"
								>
									{card.badgeText}
								</div>
							{/if}
							<h3 class="w-full text-c-on-bg text-center font-bold text-xl md:-mt-1.5 py-0.5 gap-2">
								{card.title}
							</h3>
							<h4
								class="w-[100%+2rem] md:w-[100%+2.5rem] -mx-4 md:-mx-5 text-center bg-c-bg-secondary 
								text-c-on-bg mt-4 py-3 font-bold flex justify-center items-start"
							>
								<span class="text-xl">{card.currencySymbol}</span><span class="text-3xl font-bold">
									{card.amount.toLocaleString($locale)}
								</span>
							</h4>
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
									type={'primary'}
									loading={card.priceId === selectedPriceId && checkoutCreationStatus === 'loading'}
									onClick={() =>
										createCheckoutSessionAndRedirect({
											priceId: card.priceId,
											currency: card.currency
										})}
									class="w-full mt-8"
								>
									{$LL.Pricing.PurchaseButton()}
								</Button>
							{:else}
								<Button onClick={() => (isSignInModalOpen = true)} class="w-full mt-8">
									{$LL.Pricing.PurchaseButton()}
								</Button>
							{/if}
						</div>
					{/each}
				</div>
				<div class="w-full h-[1vh]" />
			</section>
		{/if}
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
			class="max-w-full my-auto"
		>
			<SignInCard isModal={true} redirectTo={$page.url.pathname} />
		</div>
	</div>
{/if}
