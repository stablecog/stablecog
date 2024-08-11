<script lang="ts">
	import { page } from '$app/stores';
	import IconMinus from '$components/icons/IconMinus.svelte';
	import Button from '$components/primitives/buttons/Button.svelte';
	import MetaTag from '$components/utils/MetaTag.svelte';
	import PageWrapper from '$components/wrappers/PageWrapper.svelte';
	import {
		PUBLIC_STRIPE_PRICE_ID_LARGE_PACK,
		PUBLIC_STRIPE_PRICE_ID_MEDIUM_PACK,
		PUBLIC_STRIPE_PRICE_ID_MEGA_PACK,
		PUBLIC_STRIPE_PRICE_ID_PRO_SUBSCRIPTION_MO,
		PUBLIC_STRIPE_PRICE_ID_STARTER_SUBSCRIPTION_MO,
		PUBLIC_STRIPE_PRICE_ID_ULTIMATE_SUBSCRIPTION_MO,
		PUBLIC_STRIPE_PRODUCT_ID_LARGE_PACK,
		PUBLIC_STRIPE_PRODUCT_ID_MEDIUM_PACK,
		PUBLIC_STRIPE_PRODUCT_ID_MEGA_PACK,
		PUBLIC_STRIPE_PRODUCT_ID_PRO_SUBSCRIPTION,
		PUBLIC_STRIPE_PRODUCT_ID_STARTER_SUBSCRIPTION,
		PUBLIC_STRIPE_PRODUCT_ID_ULTIMATE_SUBSCRIPTION
	} from '$env/static/public';
	import LL, { locale } from '$i18n/i18n-svelte';
	import PlanCard from '$routes/(app)/pricing/PlanCard.svelte';
	import type { TCreditPackCard, TSubscriptionCard } from '$routes/(app)/pricing/types.js';
	import { apiUrl, canonicalUrl } from '$ts/constants/main';
	import { previewImageVersion } from '$ts/constants/previewImageVersion';
	import { socialAppUrls } from '$ts/constants/social';
	import {
		STRIPE_CURRENCY_TO_SYMBOL,
		STRIPE_PRODUCT_ID_OBJECTS_CREDIT_PACKS,
		STRIPE_PRODUCT_ID_OBJECTS_SUBSCRIPTIONS_MO,
		freeDailyImageCount
	} from '$ts/constants/stripePublic';
	import { sessionStore } from '$ts/constants/supabase';
	import { getCustomerPortalUrl } from '$ts/helpers/user/getCustomerPortalUrl.js';
	import { isSignInModalOpen } from '$ts/stores/isSignInModalOpen.js';
	import { userSummary } from '$ts/stores/user/summary';
	import { count } from 'd3';

	export let data;

	/* $: isFirstPurchase30Off = $userSummary && $userSummary.purchase_count > 0 ? false : true;
	$: promotionCodeId = isFirstPurchase30Off
		? PUBLIC_STRIPE_PROMOTION_CODE_ID_FIRST_PURCHASE_30_OFF
		: undefined; */
	$: isFirstPurchase30Off = false;
	$: promotionCodeId = undefined;

	let subscriptionCards: TSubscriptionCard[];
	const getPaidSubscriptionFeatures = ({
		$LL,
		parallelGenerations
	}: {
		$LL: TranslationFunctions;
		parallelGenerations: number;
	}) => [
		{
			paragraph: $LL.Pricing.Features.FastGeneration()
		},
		{
			paragraph: $LL.Pricing.Features.MaxImagesPerGeneration({ count: 4 })
		},
		{
			paragraph: $LL.Pricing.Features.ParallelGenerations({
				count: parallelGenerations.toLocaleString($locale)
			})
		},
		{ paragraph: $LL.Pricing.Features.CommercialUse() },
		{
			paragraph: $LL.Pricing.Features.ImagesArePrivate()
		},
		{
			paragraph: $LL.Pricing.Features.OptionalCreditTopUps()
		}
	];

	const getCreditPackFeatures = ({ $LL }: { $LL: TranslationFunctions }) => [
		{ paragraph: $LL.Pricing.Features.FastGeneration() },
		{ paragraph: $LL.Pricing.Features.NeverExpires() },
		{
			paragraph: $LL.Pricing.Features.CommercialUse()
		},
		{ paragraph: $LL.Pricing.Features.ImagesArePrivate() }
	];

	$: subscriptionCards = [
		{
			id: 'plan-free',
			title: $LL.Pricing.Plans.FreeTitle(),
			currency: data.currency,
			currencySymbol: STRIPE_CURRENCY_TO_SYMBOL[data.currency],
			amount: 0,
			mainFeatures: [
				{
					title: freeDailyImageCount.toLocaleString($locale),
					subtitle: $LL.Pricing.ImagesPerDaySubtitle()
				}
			],
			features: [
				{
					paragraph: $LL.Pricing.Features.SlowGeneration(),
					icon: IconMinus
				},
				{
					paragraph: $LL.Pricing.Features.MaxOneImagePerGeneration(),
					icon: IconMinus
				},
				{
					paragraph: $LL.Pricing.Features.NoParallelGenerations(),
					icon: IconMinus
				},
				{
					paragraph: $LL.Pricing.Features.PersonalUseOnly(),
					icon: IconMinus
				},
				{
					paragraph: $LL.Pricing.Features.ImagesArePublic(),
					icon: IconMinus
				},
				{
					paragraph: $LL.Pricing.Features.NoOptionalCreditTopUps(),
					icon: IconMinus
				}
			],
			ringClass: 'ring-c-bg-secondary'
		},
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
			mainFeatures: [
				{
					title:
						STRIPE_PRODUCT_ID_OBJECTS_SUBSCRIPTIONS_MO[
							PUBLIC_STRIPE_PRODUCT_ID_STARTER_SUBSCRIPTION
						].monthly_images.toLocaleString($locale),
					subtitle: $LL.Pricing.ImagesPerMonthSubtitle()
				}
			],
			features: getPaidSubscriptionFeatures({
				$LL,
				parallelGenerations:
					STRIPE_PRODUCT_ID_OBJECTS_SUBSCRIPTIONS_MO[PUBLIC_STRIPE_PRODUCT_ID_STARTER_SUBSCRIPTION]
						.parallel_generations
			}),
			ringClass: 'ring-c-bg-secondary',
			discountRate: isFirstPurchase30Off ? 0.3 : undefined
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
			mainFeatures: [
				{
					title:
						STRIPE_PRODUCT_ID_OBJECTS_SUBSCRIPTIONS_MO[
							PUBLIC_STRIPE_PRODUCT_ID_PRO_SUBSCRIPTION
						].monthly_images.toLocaleString($locale),
					subtitle: $LL.Pricing.ImagesPerMonthSubtitle()
				}
			],
			features: getPaidSubscriptionFeatures({
				$LL,
				parallelGenerations:
					STRIPE_PRODUCT_ID_OBJECTS_SUBSCRIPTIONS_MO[PUBLIC_STRIPE_PRODUCT_ID_PRO_SUBSCRIPTION]
						.parallel_generations
			}),
			ringClass: 'ring-c-bg-secondary',
			badgeText: $LL.Pricing.Badges.Recommended(),
			badgeClasses: 'bg-c-primary text-c-on-primary',
			discountRate: isFirstPurchase30Off ? 0.3 : undefined
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
			mainFeatures: [
				{
					title:
						STRIPE_PRODUCT_ID_OBJECTS_SUBSCRIPTIONS_MO[
							PUBLIC_STRIPE_PRODUCT_ID_ULTIMATE_SUBSCRIPTION
						].monthly_images.toLocaleString($locale),
					subtitle: $LL.Pricing.ImagesPerMonthSubtitle()
				}
			],
			features: getPaidSubscriptionFeatures({
				$LL,
				parallelGenerations:
					STRIPE_PRODUCT_ID_OBJECTS_SUBSCRIPTIONS_MO[PUBLIC_STRIPE_PRODUCT_ID_ULTIMATE_SUBSCRIPTION]
						.parallel_generations
			}),
			ringClass: 'ring-c-bg-secondary',
			discountRate: isFirstPurchase30Off ? 0.3 : undefined
		}
	];

	let creditPackCards: TCreditPackCard[];
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
			mainFeatures: [
				{
					title:
						STRIPE_PRODUCT_ID_OBJECTS_CREDIT_PACKS[
							PUBLIC_STRIPE_PRODUCT_ID_MEDIUM_PACK
						].images.toLocaleString($locale),
					subtitle: $LL.Pricing.ImagesSubtitle()
				}
			],
			features: getCreditPackFeatures({ $LL }),
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
			mainFeatures: [
				{
					title:
						STRIPE_PRODUCT_ID_OBJECTS_CREDIT_PACKS[
							PUBLIC_STRIPE_PRODUCT_ID_LARGE_PACK
						].images.toLocaleString($locale),
					subtitle: $LL.Pricing.ImagesSubtitle()
				}
			],
			features: getCreditPackFeatures({ $LL }),
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
			mainFeatures: [
				{
					title:
						STRIPE_PRODUCT_ID_OBJECTS_CREDIT_PACKS[
							PUBLIC_STRIPE_PRODUCT_ID_MEGA_PACK
						].images.toLocaleString($locale),
					subtitle: $LL.Pricing.ImagesSubtitle()
				}
			],
			features: getCreditPackFeatures({ $LL }),
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
	let customerPortalCreationStatus: 'idle' | 'loading' | 'success' | 'error' = 'idle';
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
		let body: Record<string, string> = {
			target_price_id: priceId,
			success_url: `${window.location.origin}/pricing/purchase/succeeded`,
			cancel_url: `${window.location.origin}/pricing/purchase/cancelled`,
			currency
		};
		if (promotionCodeId) {
			body.promotion_code_id = promotionCodeId;
		}
		try {
			checkoutCreationStatus = 'loading';
			const res = await fetch(`${apiUrl.origin}/v1/user/subscription/checkout`, {
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${$sessionStore?.access_token}`
				},
				body: JSON.stringify(body)
			});
			const resJson: TCheckoutSessionRes = await res.json();
			if (resJson.error) {
				throw new Error(resJson.error);
			}
			const { checkout_url } = resJson;
			if (!checkout_url) {
				throw new Error('No checkout session url returned');
			}
			window.location.href = checkout_url;
			checkoutCreationStatus = 'success';
		} catch (error) {
			checkoutCreationStatus = 'error';
			selectedPriceId = undefined;
		}
	}

	async function createCustomerPortalSessionAndRedirect(accessToken: string) {
		try {
			customerPortalCreationStatus = 'loading';
			const { customer_portal_url, error } = await getCustomerPortalUrl({
				returnUrl: `${window.location.origin}/pricing`,
				accessToken
			});
			if (error || !customer_portal_url) {
				throw new Error(error || 'No customer portal url returned');
			}
			window.location.href = customer_portal_url;
			checkoutCreationStatus = 'success';
		} catch (error) {
			customerPortalCreationStatus = 'error';
		}
	}

	function getAnchorLinkHTML(text: string, href: string) {
		return `<a href="${href}" target="_blank" class="hover:text-c-primary transition underline">${text}</a>`;
	}
</script>

<MetaTag
	title="Pricing | Stablecog"
	description="Choose a plan that works for you and start using Stablecog. Free, multilingual and open-source AI image generator using Stable Diffusion, FLUX, and Kandinsky."
	image_url="{canonicalUrl}/previews{$page.url.pathname}-{previewImageVersion}.png"
/>

<PageWrapper>
	<div class="my-auto flex w-full flex-col items-center justify-start">
		<section id="plans" class="flex w-full flex-col items-center justify-start">
			<h1 class="text-center text-4xl font-bold">{$LL.Pricing.PlansTitle()}</h1>
			<p class="mt-3 max-w-xl text-center leading-relaxed text-c-on-bg/75">
				{$LL.Pricing.PlansParagraph()}
			</p>
			<div
				class="mt-5 flex w-full max-w-7xl flex-wrap items-stretch justify-center lg:px-5 xl:px-0"
			>
				{#each subscriptionCards as card}
					{@const subscribedProductId = subscriptionCards.find(
						(c) => c.productId === $userSummary?.product_id
					)?.productId}
					{@const subscribedAmount = subscriptionCards.find(
						(c) => c.productId === $userSummary?.product_id
					)?.amount}
					{@const isSubscribed =
						subscribedProductId === card.productId && $sessionStore?.user.id !== undefined}
					{@const isUpgrade =
						subscribedAmount !== undefined &&
						subscribedAmount < card.amount &&
						$sessionStore?.user.id !== undefined}
					{@const isDowngrade =
						subscribedAmount !== undefined &&
						subscribedAmount > card.amount &&
						$sessionStore?.user.id !== undefined}
					{@const accessToken = $sessionStore?.access_token}
					<PlanCard
						id={card.id}
						planTitle={card.title}
						ringClass={card.ringClass}
						isSelected={isSubscribed && $userSummary?.product_id !== undefined}
						badgeText={!isDowngrade ? card.badgeText : undefined}
						badgeClasses={card.badgeClasses}
						currencyAmount={card.amount}
						currencySymbol={card.currencySymbol}
						discountBadgeText={isFirstPurchase30Off && card.id === 'plan-free'
							? $LL.Pricing.FreeForeverTitle()
							: isFirstPurchase30Off
								? $LL.Pricing.Discounts.FirstMonth30OffParagraph()
								: undefined}
						discountRate={card.discountRate}
						discountBadgeType={card.id === 'plan-free' ? 'on-bg' : 'primary'}
						features={card.features}
						mainFeatures={card.mainFeatures}
					>
						<div slot="button" class="w-full">
							{#if $userSummary && accessToken}
								<Button
									withSpinner
									type={isSubscribed && card.id !== 'plan-free'
										? 'success'
										: isSubscribed && card.id === 'plan-free'
											? 'bg-secondary'
											: isDowngrade
												? 'bg-secondary'
												: 'primary'}
									noBorder={!isDowngrade}
									disabled={isSubscribed}
									loading={(card.priceIdMo === selectedPriceId &&
										checkoutCreationStatus === 'loading') ||
										(card.id === 'plan-free' && customerPortalCreationStatus === 'loading')}
									href={isDowngrade && card.priceIdMo
										? `/account/subscription/downgrade?price_id=${
												card.priceIdMo
											}&from=${encodeURIComponent($page.url.pathname)}`
										: undefined}
									onClick={() =>
										!isDowngrade && card.priceIdMo
											? createCheckoutSessionAndRedirect({
													priceId: card.priceIdMo,
													currency: card.currency,
													promotionCodeId: card.promotionCodeId
												})
											: isDowngrade && card.id === 'plan-free'
												? createCustomerPortalSessionAndRedirect(accessToken)
												: null}
									class="w-full"
								>
									<p
										class="w-full {isSubscribed && subscribedAmount === 0 && card.id === 'plan-free'
											? 'opacity-60'
											: ''}"
									>
										{#if isSubscribed}
											{$LL.Pricing.SubscribedButton()}
										{:else if isUpgrade}
											{subscribedAmount === 0
												? $LL.Pricing.SubscribeButton()
												: $LL.Pricing.UpgradeButton()}
										{:else if isDowngrade}
											{$LL.Pricing.DowngradeButton()}
										{:else}
											{$LL.Pricing.SubscribeButton()}
										{/if}
									</p>
								</Button>
							{:else}
								<Button onClick={() => isSignInModalOpen.set(true)} class="w-full">
									{$LL.SignIn.GetStartedButton()}
								</Button>
							{/if}
						</div>
					</PlanCard>
				{/each}
			</div>
			<div class="h-[1vh] w-full" />
		</section>
		{#if $userSummary?.product_id && $sessionStore?.user.id !== undefined}
			<section id="credit-packs" class="flex w-full flex-col items-center justify-start pt-12">
				<h2 class="text-center text-4xl font-bold">{$LL.Pricing.CreditPacksTitle()}</h2>
				<p class="mt-3 max-w-xl text-center leading-relaxed text-c-on-bg/75">
					{$LL.Pricing.CreditPacksParagraph()}
				</p>
				<div class="mt-5 flex w-full max-w-7xl flex-wrap justify-center">
					{#each creditPackCards as card}
						<PlanCard
							id={card.id}
							planTitle={card.title}
							ringClass={card.ringClass}
							badgeText={card.badgeText}
							badgeClasses={card.badgeClasses}
							currencyAmount={card.amount}
							currencySymbol={card.currencySymbol}
							features={card.features}
							mainFeatures={card.mainFeatures}
						>
							<div slot="button" class="w-full">
								<Button
									withSpinner
									type={'primary'}
									loading={card.priceId === selectedPriceId && checkoutCreationStatus === 'loading'}
									onClick={() =>
										createCheckoutSessionAndRedirect({
											priceId: card.priceId,
											currency: card.currency
										})}
									class="w-full"
								>
									{$LL.Pricing.PurchaseButton()}
								</Button>
							</div>
						</PlanCard>
					{/each}
				</div>
				<div class="h-[1vh] w-full" />
			</section>
		{/if}
		<div class="-mx-2 mt-5 flex w-[calc(100%+1rem)] justify-center md:mt-10">
			<div class="h-2px w-full max-w-5xl rounded-full bg-c-bg-secondary" />
		</div>
		<section id="faq" class="flex w-full flex-col items-center pt-5">
			<div class="flex max-w-5xl flex-wrap items-start justify-start">
				{#each faqItems as item}
					<div id={item.id} class="w-full px-0 py-4 md:w-1/2 md:px-5">
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
		<div class="-mx-2 mt-5 flex w-[calc(100%+1rem)] justify-center md:mt-6">
			<div class="h-2px w-full max-w-5xl rounded-full bg-c-bg-secondary" />
		</div>
	</div>
</PageWrapper>
