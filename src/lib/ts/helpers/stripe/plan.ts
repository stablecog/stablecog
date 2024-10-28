import { env } from '$env/dynamic/public';

export const getTitleFromProductId = ($LL: TranslationFunctions, productId: string | undefined) => {
	switch (productId) {
		case env.PUBLIC_STRIPE_PRODUCT_ID_STARTER_SUBSCRIPTION:
			return $LL.Pricing.Plans.StarterTitle();
		case env.PUBLIC_STRIPE_PRODUCT_ID_PRO_SUBSCRIPTION:
			return $LL.Pricing.Plans.ProTitle();
		case env.PUBLIC_STRIPE_PRODUCT_ID_ULTIMATE_SUBSCRIPTION:
			return $LL.Pricing.Plans.UltimateTitle();
		case env.PUBLIC_STRIPE_PRODUCT_ID_MEDIUM_PACK:
			return $LL.Pricing.CreditPacks.MediumTitle();
		case env.PUBLIC_STRIPE_PRODUCT_ID_LARGE_PACK:
			return $LL.Pricing.CreditPacks.LargeTitle();
		case env.PUBLIC_STRIPE_PRODUCT_ID_MEGA_PACK:
			return $LL.Pricing.CreditPacks.MegaTitle();
		default:
			return $LL.Pricing.Plans.FreeTitle();
	}
};

export const getInfoFromPriceId: (
	$LL: TranslationFunctions,
	priceId: string | undefined
) => {
	title: string;
	billingType: 'monthly' | 'yearly' | 'one-time';
	productId: string;
} = ($LL, priceId) => {
	switch (priceId) {
		case env.PUBLIC_STRIPE_PRICE_ID_STARTER_SUBSCRIPTION_MO:
			return {
				billingType: 'monthly',
				title: $LL.Pricing.Monthly({ planTitle: $LL.Pricing.Plans.StarterTitle() }),
				productId: env.PUBLIC_STRIPE_PRODUCT_ID_STARTER_SUBSCRIPTION
			};
		case env.PUBLIC_STRIPE_PRICE_ID_STARTER_SUBSCRIPTION_YR:
			return {
				billingType: 'yearly',
				title: $LL.Pricing.Yearly({ planTitle: $LL.Pricing.Plans.StarterTitle() }),
				productId: env.PUBLIC_STRIPE_PRODUCT_ID_STARTER_SUBSCRIPTION
			};
		case env.PUBLIC_STRIPE_PRICE_ID_PRO_SUBSCRIPTION_MO:
			return {
				billingType: 'monthly',
				title: $LL.Pricing.Monthly({ planTitle: $LL.Pricing.Plans.ProTitle() }),
				productId: env.PUBLIC_STRIPE_PRODUCT_ID_PRO_SUBSCRIPTION
			};
		case env.PUBLIC_STRIPE_PRICE_ID_PRO_SUBSCRIPTION_YR:
			return {
				billingType: 'yearly',
				title: $LL.Pricing.Yearly({ planTitle: $LL.Pricing.Plans.ProTitle() }),
				productId: env.PUBLIC_STRIPE_PRODUCT_ID_PRO_SUBSCRIPTION
			};
		case env.PUBLIC_STRIPE_PRICE_ID_ULTIMATE_SUBSCRIPTION_MO:
			return {
				billingType: 'monthly',
				title: $LL.Pricing.Monthly({ planTitle: $LL.Pricing.Plans.UltimateTitle() }),
				productId: env.PUBLIC_STRIPE_PRODUCT_ID_ULTIMATE_SUBSCRIPTION
			};
		case env.PUBLIC_STRIPE_PRICE_ID_ULTIMATE_SUBSCRIPTION_YR:
			return {
				billingType: 'yearly',
				title: $LL.Pricing.Yearly({ planTitle: $LL.Pricing.Plans.UltimateTitle() }),
				productId: env.PUBLIC_STRIPE_PRODUCT_ID_ULTIMATE_SUBSCRIPTION
			};
		case env.PUBLIC_STRIPE_PRODUCT_ID_MEDIUM_PACK:
			return {
				billingType: 'one-time',
				title: $LL.Pricing.CreditPacks.MediumTitle(),
				productId: env.PUBLIC_STRIPE_PRODUCT_ID_MEDIUM_PACK
			};
		case env.PUBLIC_STRIPE_PRODUCT_ID_LARGE_PACK:
			return {
				billingType: 'one-time',
				title: $LL.Pricing.CreditPacks.LargeTitle(),
				productId: env.PUBLIC_STRIPE_PRODUCT_ID_LARGE_PACK
			};
		case env.PUBLIC_STRIPE_PRODUCT_ID_MEGA_PACK:
			return {
				billingType: 'one-time',
				title: $LL.Pricing.CreditPacks.MegaTitle(),
				productId: env.PUBLIC_STRIPE_PRODUCT_ID_MEGA_PACK
			};
		default:
			return {
				billingType: 'monthly',
				title: $LL.Pricing.Plans.FreeTitle(),
				productId: 'free'
			};
	}
};
