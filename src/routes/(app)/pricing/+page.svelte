<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$components/buttons/Button.svelte';
	import MetaTag from '$components/MetaTag.svelte';
	import LL, { locale } from '$i18n/i18n-svelte';
	import { apiUrl, canonicalUrl } from '$ts/constants/main';
	import PageWrapper from '$components/PageWrapper.svelte';
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
		PUBLIC_STRIPE_PRICE_ID_LARGE_PACK,
		PUBLIC_STRIPE_PRICE_ID_MEGA_PACK,
		PUBLIC_STRIPE_PRODUCT_ID_MEGA_PACK,
		PUBLIC_STRIPE_PROMOTION_CODE_ID_FIRST_PURCHASE_50_OFF
	} from '$env/static/public';
	import {
		STRIPE_CURRENCY_TO_SYMBOL,
		STRIPE_PRODUCT_ID_OBJECTS_SUBSCRIPTIONS_MO,
		STRIPE_PRODUCT_ID_OBJECTS_CREDIT_PACKS
	} from '$ts/constants/stripePublic';
	import { userSummary } from '$ts/stores/user/summary';
	import { previewImageVersion } from '$ts/constants/previewImageVersion';
	import { socialAppUrls } from '$ts/constants/social';
	import { searchParamsString } from '$ts/stores/searchParamsString';
	import SignInModal from '$components/SignInModal.svelte';

	export let data;

	$: isFirstPurchase50Off = $userSummary && $userSummary.purchase_count > 0 ? false : true;
	$: promotionCodeId = isFirstPurchase50Off
		? PUBLIC_STRIPE_PROMOTION_CODE_ID_FIRST_PURCHASE_50_OFF
		: undefined;

	$: subscriptionCards = [
		{
			id: 'plan-starter',
			title: $LL.Pricing.Plans.StarterTitle(),
			priceIdMo: PUBLIC_STRIPE_PRICE_ID_STARTER_SUBSCRIPTION_MO,
			productId: PUBLIC_STRIPE_PRODUCT_ID_STARTER_SUBSCRIPTION,
			currency: data.currency,
			currencySymbol: STRIPE_CURRENCY_TO_SYMBOL[data.currency],
			promotionCodeId,
			amount:
				data.currency === 'eur'
					? STRIPE_PRODUCT_ID_OBJECTS_SUBSCRIPTIONS_MO[
							PUBLIC_STRIPE_PRODUCT_ID_STARTER_SUBSCRIPTION
					  ].prices[PUBLIC_STRIPE_PRICE_ID_STARTER_SUBSCRIPTION_MO].currencies.eur.amount
					: STRIPE_PRODUCT_ID_OBJECTS_SUBSCRIPTIONS_MO[
							PUBLIC_STRIPE_PRODUCT_ID_STARTER_SUBSCRIPTION
					  ].prices[PUBLIC_STRIPE_PRICE_ID_STARTER_SUBSCRIPTION_MO].currencies.usd.amount,
			features: [
				$LL.Pricing.Features.MonthlyImages({
					count:
						STRIPE_PRODUCT_ID_OBJECTS_SUBSCRIPTIONS_MO[
							PUBLIC_STRIPE_PRODUCT_ID_STARTER_SUBSCRIPTION
						].monthly_images.toLocaleString($locale)
				}),
				$LL.Pricing.Features.ParallelGenerations({
					count:
						STRIPE_PRODUCT_ID_OBJECTS_SUBSCRIPTIONS_MO[
							PUBLIC_STRIPE_PRODUCT_ID_STARTER_SUBSCRIPTION
						].parallel_generations.toLocaleString($locale)
				}),
				$LL.Pricing.Features.CommercialUse(),
				$LL.Pricing.Features.ImagesArePrivate()
			],
			ringClass: 'ring-c-bg-secondary'
		},
		{
			id: 'plan-pro',
			title: $LL.Pricing.Plans.ProTitle(),
			priceIdMo: PUBLIC_STRIPE_PRICE_ID_PRO_SUBSCRIPTION_MO,
			productId: PUBLIC_STRIPE_PRODUCT_ID_PRO_SUBSCRIPTION,
			currency: data.currency,
			currencySymbol: STRIPE_CURRENCY_TO_SYMBOL[data.currency],
			promotionCodeId,
			amount:
				data.currency === 'eur'
					? STRIPE_PRODUCT_ID_OBJECTS_SUBSCRIPTIONS_MO[PUBLIC_STRIPE_PRODUCT_ID_PRO_SUBSCRIPTION]
							.prices[PUBLIC_STRIPE_PRICE_ID_PRO_SUBSCRIPTION_MO].currencies.eur.amount
					: STRIPE_PRODUCT_ID_OBJECTS_SUBSCRIPTIONS_MO[PUBLIC_STRIPE_PRODUCT_ID_PRO_SUBSCRIPTION]
							.prices[PUBLIC_STRIPE_PRICE_ID_PRO_SUBSCRIPTION_MO].currencies.usd.amount,
			features: [
				$LL.Pricing.Features.MonthlyImages({
					count:
						STRIPE_PRODUCT_ID_OBJECTS_SUBSCRIPTIONS_MO[
							PUBLIC_STRIPE_PRODUCT_ID_PRO_SUBSCRIPTION
						].monthly_images.toLocaleString($locale)
				}),
				$LL.Pricing.Features.ParallelGenerations({
					count:
						STRIPE_PRODUCT_ID_OBJECTS_SUBSCRIPTIONS_MO[
							PUBLIC_STRIPE_PRODUCT_ID_PRO_SUBSCRIPTION
						].parallel_generations.toLocaleString($locale)
				}),
				$LL.Pricing.Features.CommercialUse(),
				$LL.Pricing.Features.ImagesArePrivate()
			],
			ringClass: 'ring-c-bg-secondary',
			badgeText: $LL.Pricing.Badges.Recommended(),
			badgeClasses: 'bg-c-primary text-c-on-primary'
		},
		{
			id: 'plan-ultimate',
			title: $LL.Pricing.Plans.UltimateTitle(),
			priceIdMo: PUBLIC_STRIPE_PRICE_ID_ULTIMATE_SUBSCRIPTION_MO,
			productId: PUBLIC_STRIPE_PRODUCT_ID_ULTIMATE_SUBSCRIPTION,
			currency: data.currency,
			currencySymbol: STRIPE_CURRENCY_TO_SYMBOL[data.currency],
			promotionCodeId,
			amount:
				data.currency === 'eur'
					? STRIPE_PRODUCT_ID_OBJECTS_SUBSCRIPTIONS_MO[
							PUBLIC_STRIPE_PRODUCT_ID_ULTIMATE_SUBSCRIPTION
					  ].prices[PUBLIC_STRIPE_PRICE_ID_ULTIMATE_SUBSCRIPTION_MO].currencies.eur.amount
					: STRIPE_PRODUCT_ID_OBJECTS_SUBSCRIPTIONS_MO[
							PUBLIC_STRIPE_PRODUCT_ID_ULTIMATE_SUBSCRIPTION
					  ].prices[PUBLIC_STRIPE_PRICE_ID_ULTIMATE_SUBSCRIPTION_MO].currencies.usd.amount,
			features: [
				$LL.Pricing.Features.MonthlyImages({
					count:
						STRIPE_PRODUCT_ID_OBJECTS_SUBSCRIPTIONS_MO[
							PUBLIC_STRIPE_PRODUCT_ID_ULTIMATE_SUBSCRIPTION
						].monthly_images.toLocaleString($locale)
				}),
				$LL.Pricing.Features.ParallelGenerations({
					count:
						STRIPE_PRODUCT_ID_OBJECTS_SUBSCRIPTIONS_MO[
							PUBLIC_STRIPE_PRODUCT_ID_ULTIMATE_SUBSCRIPTION
						].parallel_generations.toLocaleString($locale)
				}),
				$LL.Pricing.Features.CommercialUse(),
				$LL.Pricing.Features.ImagesArePrivate()
			],
			ringClass: 'ring-c-bg-secondary'
		}
	];

	$: creditPackCards = [
		{
			id: 'credit-pack-medium',
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
			id: 'credit-pack-large',
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
			badgeText: $LL.Pricing.Badges.MostPopular(),
			badgeClasses: 'bg-c-primary text-c-on-primary'
		},
		{
			id: 'credit-pack-mega',
			title: $LL.Pricing.CreditPacks.MegaTitle(),
			priceId: PUBLIC_STRIPE_PRICE_ID_MEGA_PACK,
			productId: PUBLIC_STRIPE_PRICE_ID_MEGA_PACK,
			currency: data.currency,
			currencySymbol: STRIPE_CURRENCY_TO_SYMBOL[data.currency],
			amount:
				data.currency === 'eur'
					? STRIPE_PRODUCT_ID_OBJECTS_CREDIT_PACKS[PUBLIC_STRIPE_PRODUCT_ID_MEGA_PACK].prices[
							PUBLIC_STRIPE_PRICE_ID_MEGA_PACK
					  ].currencies.eur.amount
					: STRIPE_PRODUCT_ID_OBJECTS_CREDIT_PACKS[PUBLIC_STRIPE_PRODUCT_ID_MEGA_PACK].prices[
							PUBLIC_STRIPE_PRICE_ID_MEGA_PACK
					  ].currencies.usd.amount,
			features: [
				$LL.Pricing.Features.Images({
					count:
						STRIPE_PRODUCT_ID_OBJECTS_CREDIT_PACKS[
							PUBLIC_STRIPE_PRODUCT_ID_MEGA_PACK
						].images.toLocaleString($locale)
				}),
				$LL.Pricing.Features.NeverExpires()
			],
			ringClass: 'ring-c-bg-secondary',
			badgeText: undefined,
			badgeClasses: undefined
		}
	];

	interface FAQItem {
		id: string;
		question: string;
		answer: string;
		isHTML?: boolean;
	}
	let faqItems: FAQItem[];
	$: faqItems = [
		{
			id: 'plan-cancellation',
			question: $LL.FAQ.Questions.PlanCancellation.Question(),
			answer: $LL.FAQ.Questions.PlanCancellation.Answer()
		},
		{
			id: 'plan-upgrade-or-downgrade',
			question: $LL.FAQ.Questions.PlanUpgradeOrDowngrade.Question(),
			answer: $LL.FAQ.Questions.PlanUpgradeOrDowngrade.Answer()
		},
		{
			id: 'commercial-use',
			question: $LL.FAQ.Questions.CommercialUse.Question(),
			answer: $LL.FAQ.Questions.CommercialUse.Answer()
		},
		{
			id: 'more-credits',
			question: $LL.FAQ.Questions.MoreCredits.Question(),
			answer: $LL.FAQ.Questions.MoreCredits.Answer()
		},
		{
			id: 'credit-roll-over',
			question: $LL.FAQ.Questions.CreditRollOver.Question(),
			answer: $LL.FAQ.Questions.CreditRollOver.Answer()
		},
		{
			id: 'more-questions',
			question: $LL.FAQ.Questions.MoreQuestions.Question(),
			answer: $LL.FAQ.Questions.MoreQuestions.Answer({
				Discord: getAnchorLinkHTML(
					$LL.FAQ.Questions.MoreQuestions.Parts.Discord(),
					socialAppUrls.discord
				),
				Twitter: getAnchorLinkHTML(
					$LL.FAQ.Questions.MoreQuestions.Parts.Twitter(),
					socialAppUrls.twitter
				),
				email: getAnchorLinkHTML($LL.FAQ.Questions.MoreQuestions.Parts.Email(), socialAppUrls.email)
			}),
			isHTML: true
		}
	];

	let checkoutCreationStatus: 'idle' | 'loading' | 'success' | 'error' = 'idle';
	let isSignInModalOpen = false;
	let selectedPriceId: string | undefined = undefined;

	interface TCheckoutSessionRes {
		checkout_url?: string;
		error?: string;
	}

	async function createCheckoutSessionAndRedirect({
		priceId,
		currency,
		promotionCodeId
	}: {
		priceId: string;
		currency: string;
		promotionCodeId?: string;
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
					promotion_code_id: promotionCodeId,
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

	function getAnchorLinkHTML(text: string, href: string) {
		return `<a href="${href}" target="_blank" class="hover:text-c-primary transition underline">${text}</a>`;
	}
</script>

<MetaTag
	title="Pricing | Stablecog"
	description="Choose a plan that works for you and start using Stablecog. Free, multilingual and open-source AI image generator using Stable Diffusion and Kandinsky."
	image_url="{canonicalUrl}/previews{$page.url.pathname}-{previewImageVersion}.png"
/>

<PageWrapper>
	<div class="w-full flex flex-col items-center justify-start my-auto">
		<section id="plans" class="w-full flex flex-col items-center justify-start">
			<h1 class="text-center font-bold text-4xl">{$LL.Pricing.PlansTitle()}</h1>
			<p class="max-w-xl mt-3 text-center leading-relaxed text-c-on-bg/75">
				{$LL.Pricing.PlansParagraph()}
			</p>
			<div class="w-full max-w-7xl flex flex-wrap justify-center items-stretch gap-7 mt-9">
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
						id={card.id}
						class="w-full flex flex-col max-w-md md:max-w-[20rem] bg-c-bg shadow-xl shadow-c-shadow/[var(--o-shadow-strong)]
					 	p-4 md:p-5 rounded-2xl md:rounded-3xl ring-2 {isSubscribed
							? 'ring-c-success'
							: card.ringClass} relative"
					>
						{#if card.badgeText && card.badgeClasses && !isDowngrade}
							<div
								class="absolute -right-2.5 -top-3 rounded-full px-3.5 py-1.5 text-xs text-right
								font-bold {isSubscribed ? 'bg-c-success text-c-on-primary' : card.badgeClasses}"
							>
								{card.badgeText}
							</div>
						{/if}
						<h3 class="w-full text-c-on-bg text-center font-bold text-xl md:-mt-1.5 py-0.5 gap-2">
							{card.title}
						</h3>
						<div
							class="w-[100%+2rem] md:w-[100%+2.5rem] -mx-4 md:-mx-5 text-center bg-c-bg-secondary
							text-c-on-bg mt-4 {isFirstPurchase50Off ? 'py-4' : 'py-3'} font-bold flex flex-col items-center"
						>
							<h4 class="max-w-full flex flex-wrap justify-center items-start px-2">
								{#if isFirstPurchase50Off}
									<span class="text-xl text-c-on-bg/50">{card.currencySymbol}</span><span
										class="text-3xl font-semibold text-c-on-bg/50 line-through pr-0.4ch"
									>
										{card.amount.toLocaleString($locale)}
									</span><span class="text-xl">{card.currencySymbol}</span><span
										class="text-3xl font-bold"
									>
										{(card.amount / 2).toLocaleString($locale)}
									</span>
								{:else}
									<span class="text-xl">{card.currencySymbol}</span><span
										class="text-3xl font-bold"
									>
										{card.amount.toLocaleString($locale)}
									</span>
								{/if}
								<span class="self-end mb-0.75 text-c-on-bg/60 font-medium"
									>{$LL.Pricing.SlashMonth()}</span
								>
							</h4>
							{#if isFirstPurchase50Off}
								<div class="max-w-full px-2 mt-2 pb-1">
									<p
										class="max-w-full rounded-full bg-c-primary/15 ring-1 ring-c-primary/25 text-sm text-c-primary font-medium px-2.5 py-0.5"
									>
										{$LL.Pricing.Discounts.FirstPurchase50OffParagraph()}
									</p>
								</div>
							{/if}
						</div>

						<ul class="w-full mt-6 flex flex-col gap-3 px-1 flex-1">
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
												currency: card.currency,
												promotionCodeId: card.promotionCodeId
										  })
										: null}
								class="w-full mt-7"
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
							<Button onClick={() => (isSignInModalOpen = true)} class="w-full mt-7">
								{$LL.Pricing.SubscribeButton()}
							</Button>
						{/if}
					</div>
				{/each}
			</div>
			<div class="w-full h-[1vh]" />
		</section>
		{#if $userSummary?.product_id && $page.data.session?.user.id !== undefined}
			<section id="credit-packs" class="w-full flex flex-col items-center justify-start pt-16">
				<h2 class="text-center font-bold text-4xl">{$LL.Pricing.CreditPacksTitle()}</h2>
				<p class="max-w-xl mt-3 text-center leading-relaxed text-c-on-bg/75">
					{$LL.Pricing.CreditPacksParagraph()}
				</p>
				<div class="w-full max-w-7xl flex flex-wrap justify-center gap-7 mt-8">
					{#each creditPackCards as card}
						<div
							id={card.id}
							class="w-full max-w-md md:max-w-[20rem] bg-c-bg shadow-xl shadow-c-shadow/[var(--o-shadow-strong)]
							p-4 md:p-5 rounded-2xl md:rounded-3xl ring-2 {card.ringClass} relative"
						>
							{#if card.badgeText && card.badgeClasses}
								<div
									class="absolute -right-2.5 -top-3 rounded-full px-3.5 py-1.5 text-xs text-right
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
							<ul class="w-full mt-6 flex flex-col gap-3 px-1 flex-1">
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
		<div class="w-[calc(100%+1rem)] -mx-2 flex justify-center mt-10 md:mt-12">
			<div class="w-full max-w-5xl rounded-full h-2px bg-c-bg-secondary" />
		</div>
		<section id="faq" class="w-full flex flex-col items-center pt-5">
			<div class="max-w-5xl flex flex-wrap items-start justify-start">
				{#each faqItems as item}
					<div id={item.id} class="w-full md:w-1/2 px-0 md:px-5 py-4">
						<h5 class="font-semibold">{item.question}</h5>
						{#if item.isHTML}
							<p class="mt-1 text-c-on-bg/75">{@html item.answer}</p>
						{:else}
							<p class="mt-1 text-c-on-bg/75">{item.answer}</p>
						{/if}
					</div>
				{/each}
			</div>
		</section>
		<div class="w-[calc(100%+1rem)] -mx-2 flex justify-center mt-5 md:mt-6">
			<div class="w-full max-w-5xl rounded-full h-2px bg-c-bg-secondary" />
		</div>
	</div>
</PageWrapper>

{#if isSignInModalOpen && !$page.data.session?.user.id}
	<SignInModal
		redirectTo={$page.url.pathname + $searchParamsString}
		onClickoutside={() => (isSignInModalOpen = false)}
	/>
{/if}
