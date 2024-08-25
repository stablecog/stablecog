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
