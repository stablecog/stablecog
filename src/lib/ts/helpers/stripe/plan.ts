import {
	PUBLIC_STRIPE_PRICE_ID_LARGE_PACK,
	PUBLIC_STRIPE_PRODUCT_ID_MEDIUM_PACK,
	PUBLIC_STRIPE_PRODUCT_ID_PRO_SUBSCRIPTION,
	PUBLIC_STRIPE_PRODUCT_ID_STARTER_SUBSCRIPTION,
	PUBLIC_STRIPE_PRODUCT_ID_ULTIMATE_SUBSCRIPTION
} from '$env/static/public';

export const getTitleFromProductId = ($LL: TranslationFunctions, productId: string | undefined) => {
	switch (productId) {
		case PUBLIC_STRIPE_PRODUCT_ID_STARTER_SUBSCRIPTION:
			return $LL.Pricing.Plans.StarterTitle();
		case PUBLIC_STRIPE_PRODUCT_ID_PRO_SUBSCRIPTION:
			return $LL.Pricing.Plans.ProTitle();
		case PUBLIC_STRIPE_PRODUCT_ID_ULTIMATE_SUBSCRIPTION:
			return $LL.Pricing.Plans.UltimateTitle();
		case PUBLIC_STRIPE_PRODUCT_ID_MEDIUM_PACK:
			return $LL.Pricing.CreditPacks.MediumTitle();
		case PUBLIC_STRIPE_PRICE_ID_LARGE_PACK:
			return $LL.Pricing.CreditPacks.LargeTitle();
		default:
			return $LL.Pricing.Plans.FreeTitle();
	}
};
