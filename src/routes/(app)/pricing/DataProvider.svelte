<script lang="ts">
	import IconMinus from '$components/icons/IconMinus.svelte';
	import { env } from '$env/dynamic/public';
	import LL, { locale } from '$i18n/i18n-svelte';
	import type {
		TBillingType,
		TCreditPackCard,
		TSubscriptionCard
	} from '$routes/(app)/pricing/types';
	import {
		STRIPE_CURRENCY_TO_SYMBOL,
		STRIPE_PRODUCT_ID_OBJECTS_CREDIT_PACKS,
		STRIPE_PRODUCT_ID_OBJECTS_SUBSCRIPTIONS,
		freeDailyImageCount
	} from '$ts/constants/stripePublic';

	export let data: {
		currency: 'usd' | 'eur';
	};
	export let selectedBillingType: TBillingType;

	const yearlyDivider = 12;
	let subscriptionCards: TSubscriptionCard[];
	const isFirstPurchase30Off = false;

	$: promotionCodeId = undefined;

	$: subscriptionCards = [
		{
			id: 'plan-free',
			title: $LL.Pricing.Plans.FreeTitle(),
			currency: data.currency,
			currencySymbol: STRIPE_CURRENCY_TO_SYMBOL[data.currency],
			billingType: selectedBillingType === 'yearly' ? 'yearly' : 'monthly',
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
			priceId:
				selectedBillingType === 'yearly'
					? env.PUBLIC_STRIPE_PRICE_ID_STARTER_SUBSCRIPTION_YR
					: env.PUBLIC_STRIPE_PRICE_ID_STARTER_SUBSCRIPTION_MO,
			productId: env.PUBLIC_STRIPE_PRODUCT_ID_STARTER_SUBSCRIPTION,
			currency: data.currency,
			currencySymbol: STRIPE_CURRENCY_TO_SYMBOL[data.currency],
			promotionCodeId,
			billingType: selectedBillingType === 'yearly' ? 'yearly' : 'monthly',
			amount:
				STRIPE_PRODUCT_ID_OBJECTS_SUBSCRIPTIONS[env.PUBLIC_STRIPE_PRODUCT_ID_STARTER_SUBSCRIPTION!]
					.prices[selectedBillingType === 'yearly' ? 'yearly' : 'monthly'][
					selectedBillingType === 'yearly'
						? env.PUBLIC_STRIPE_PRICE_ID_STARTER_SUBSCRIPTION_YR!
						: env.PUBLIC_STRIPE_PRICE_ID_STARTER_SUBSCRIPTION_MO!
				].currencies[data.currency === 'eur' ? 'eur' : 'usd'].amount /
				(selectedBillingType === 'yearly' ? yearlyDivider : 1),
			mainFeatures: [
				{
					title:
						STRIPE_PRODUCT_ID_OBJECTS_SUBSCRIPTIONS[
							env.PUBLIC_STRIPE_PRODUCT_ID_STARTER_SUBSCRIPTION!
						].monthly_images.toLocaleString($locale),
					subtitle: $LL.Pricing.ImagesPerMonthSubtitle()
				}
			],
			features: getPaidSubscriptionFeatures({
				$LL,
				parallelGenerations:
					STRIPE_PRODUCT_ID_OBJECTS_SUBSCRIPTIONS[
						env.PUBLIC_STRIPE_PRODUCT_ID_STARTER_SUBSCRIPTION!
					].parallel_generations
			}),
			ringClass: 'ring-c-bg-secondary',
			discountRate: isFirstPurchase30Off ? 0.3 : undefined
		},
		{
			id: 'plan-pro',
			title: $LL.Pricing.Plans.ProTitle(),
			priceId:
				selectedBillingType === 'yearly'
					? env.PUBLIC_STRIPE_PRICE_ID_PRO_SUBSCRIPTION_YR
					: env.PUBLIC_STRIPE_PRICE_ID_PRO_SUBSCRIPTION_MO,
			productId: env.PUBLIC_STRIPE_PRODUCT_ID_PRO_SUBSCRIPTION,
			currency: data.currency,
			currencySymbol: STRIPE_CURRENCY_TO_SYMBOL[data.currency],
			promotionCodeId,
			billingType: selectedBillingType === 'yearly' ? 'yearly' : 'monthly',
			amount:
				STRIPE_PRODUCT_ID_OBJECTS_SUBSCRIPTIONS[env.PUBLIC_STRIPE_PRODUCT_ID_PRO_SUBSCRIPTION!]
					.prices[selectedBillingType === 'yearly' ? 'yearly' : 'monthly'][
					selectedBillingType === 'yearly'
						? env.PUBLIC_STRIPE_PRICE_ID_PRO_SUBSCRIPTION_YR!
						: env.PUBLIC_STRIPE_PRICE_ID_PRO_SUBSCRIPTION_MO!
				].currencies[data.currency === 'eur' ? 'eur' : 'usd'].amount /
				(selectedBillingType === 'yearly' ? yearlyDivider : 1),
			mainFeatures: [
				{
					title:
						STRIPE_PRODUCT_ID_OBJECTS_SUBSCRIPTIONS[
							env.PUBLIC_STRIPE_PRODUCT_ID_PRO_SUBSCRIPTION!
						].monthly_images.toLocaleString($locale),
					subtitle: $LL.Pricing.ImagesPerMonthSubtitle()
				}
			],
			features: getPaidSubscriptionFeatures({
				$LL,
				parallelGenerations:
					STRIPE_PRODUCT_ID_OBJECTS_SUBSCRIPTIONS[env.PUBLIC_STRIPE_PRODUCT_ID_PRO_SUBSCRIPTION!]
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
			priceId:
				selectedBillingType === 'yearly'
					? env.PUBLIC_STRIPE_PRICE_ID_ULTIMATE_SUBSCRIPTION_YR
					: env.PUBLIC_STRIPE_PRICE_ID_ULTIMATE_SUBSCRIPTION_MO,
			productId: env.PUBLIC_STRIPE_PRODUCT_ID_ULTIMATE_SUBSCRIPTION,
			currency: data.currency,
			currencySymbol: STRIPE_CURRENCY_TO_SYMBOL[data.currency],
			promotionCodeId,
			billingType: selectedBillingType === 'yearly' ? 'yearly' : 'monthly',
			amount:
				STRIPE_PRODUCT_ID_OBJECTS_SUBSCRIPTIONS[env.PUBLIC_STRIPE_PRODUCT_ID_ULTIMATE_SUBSCRIPTION!]
					.prices[selectedBillingType === 'yearly' ? 'yearly' : 'monthly'][
					selectedBillingType === 'yearly'
						? env.PUBLIC_STRIPE_PRICE_ID_ULTIMATE_SUBSCRIPTION_YR!
						: env.PUBLIC_STRIPE_PRICE_ID_ULTIMATE_SUBSCRIPTION_MO!
				].currencies[data.currency === 'eur' ? 'eur' : 'usd'].amount /
				(selectedBillingType === 'yearly' ? yearlyDivider : 1),
			mainFeatures: [
				{
					title:
						STRIPE_PRODUCT_ID_OBJECTS_SUBSCRIPTIONS[
							env.PUBLIC_STRIPE_PRODUCT_ID_ULTIMATE_SUBSCRIPTION!
						].monthly_images.toLocaleString($locale),
					subtitle: $LL.Pricing.ImagesPerMonthSubtitle()
				}
			],
			features: getPaidSubscriptionFeatures({
				$LL,
				parallelGenerations:
					STRIPE_PRODUCT_ID_OBJECTS_SUBSCRIPTIONS[
						env.PUBLIC_STRIPE_PRODUCT_ID_ULTIMATE_SUBSCRIPTION!
					].parallel_generations
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
			priceId: env.PUBLIC_STRIPE_PRICE_ID_MEDIUM_PACK!,
			productId: env.PUBLIC_STRIPE_PRICE_ID_MEDIUM_PACK!,
			currency: data.currency,
			currencySymbol: STRIPE_CURRENCY_TO_SYMBOL[data.currency],
			billingType: 'one-time',
			amount:
				STRIPE_PRODUCT_ID_OBJECTS_CREDIT_PACKS[env.PUBLIC_STRIPE_PRODUCT_ID_MEDIUM_PACK!].prices[
					env.PUBLIC_STRIPE_PRICE_ID_MEDIUM_PACK!
				].currencies[data.currency === 'eur' ? 'eur' : 'usd'].amount,
			mainFeatures: [
				{
					title:
						STRIPE_PRODUCT_ID_OBJECTS_CREDIT_PACKS[
							env.PUBLIC_STRIPE_PRODUCT_ID_MEDIUM_PACK!
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
			priceId: env.PUBLIC_STRIPE_PRICE_ID_LARGE_PACK!,
			productId: env.PUBLIC_STRIPE_PRICE_ID_LARGE_PACK!,
			currency: data.currency,
			currencySymbol: STRIPE_CURRENCY_TO_SYMBOL[data.currency],
			billingType: 'one-time',
			amount:
				STRIPE_PRODUCT_ID_OBJECTS_CREDIT_PACKS[env.PUBLIC_STRIPE_PRODUCT_ID_LARGE_PACK!].prices[
					env.PUBLIC_STRIPE_PRICE_ID_LARGE_PACK!
				].currencies[data.currency === 'eur' ? 'eur' : 'usd'].amount,
			mainFeatures: [
				{
					title:
						STRIPE_PRODUCT_ID_OBJECTS_CREDIT_PACKS[
							env.PUBLIC_STRIPE_PRODUCT_ID_LARGE_PACK!
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
			priceId: env.PUBLIC_STRIPE_PRICE_ID_MEGA_PACK!,
			productId: env.PUBLIC_STRIPE_PRICE_ID_MEGA_PACK!,
			currency: data.currency,
			currencySymbol: STRIPE_CURRENCY_TO_SYMBOL[data.currency],
			billingType: 'one-time',
			amount:
				STRIPE_PRODUCT_ID_OBJECTS_CREDIT_PACKS[env.PUBLIC_STRIPE_PRODUCT_ID_MEGA_PACK!].prices[
					env.PUBLIC_STRIPE_PRICE_ID_MEGA_PACK!
				].currencies[data.currency === 'eur' ? 'eur' : 'usd'].amount,
			mainFeatures: [
				{
					title:
						STRIPE_PRODUCT_ID_OBJECTS_CREDIT_PACKS[
							env.PUBLIC_STRIPE_PRODUCT_ID_MEGA_PACK!
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

	function getPaidSubscriptionFeatures({
		$LL,
		parallelGenerations
	}: {
		$LL: TranslationFunctions;
		parallelGenerations: number;
	}) {
		return [
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
	}

	function getCreditPackFeatures({ $LL }: { $LL: TranslationFunctions }) {
		return [
			{ paragraph: $LL.Pricing.Features.FastGeneration() },
			{ paragraph: $LL.Pricing.Features.NeverExpires() },
			{
				paragraph: $LL.Pricing.Features.CommercialUse()
			},
			{ paragraph: $LL.Pricing.Features.ImagesArePrivate() }
		];
	}
</script>

<slot {subscriptionCards} {creditPackCards} {isFirstPurchase30Off} />
