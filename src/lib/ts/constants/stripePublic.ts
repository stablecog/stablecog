import {
	PUBLIC_STRIPE_PRICE_ID_STARTER_SUBSCRIPTION_MO_TEST,
	PUBLIC_STRIPE_PRICE_ID_PRO_SUBSCRIPTION_MO_TEST,
	PUBLIC_STRIPE_PRICE_ID_ULTIMATE_SUBSCRIPTION_MO_TEST,
	PUBLIC_STRIPE_PRODUCT_ID_STARTER_SUBSCRIPTION_TEST,
	PUBLIC_STRIPE_PRODUCT_ID_PRO_SUBSCRIPTION_TEST,
	PUBLIC_STRIPE_PRODUCT_ID_ULTIMATE_SUBSCRIPTION_TEST,
	PUBLIC_STRIPE_PRICE_ID_1500_CREDITS_TEST,
	PUBLIC_STRIPE_PRODUCT_ID_1500_CREDITS_TEST
} from '$env/static/public';

export const STRIPE_CURRENCIES = ['usd', 'eur'] as const;

export const STRIPE_PRICE_IDS_SUBSCRIPTIONS_MO = [
	PUBLIC_STRIPE_PRICE_ID_STARTER_SUBSCRIPTION_MO_TEST,
	PUBLIC_STRIPE_PRICE_ID_PRO_SUBSCRIPTION_MO_TEST,
	PUBLIC_STRIPE_PRICE_ID_ULTIMATE_SUBSCRIPTION_MO_TEST
] as const;

export const STRIPE_PRODUCT_IDS_SUBSCRIPTIONS = [
	PUBLIC_STRIPE_PRODUCT_ID_STARTER_SUBSCRIPTION_TEST,
	PUBLIC_STRIPE_PRODUCT_ID_PRO_SUBSCRIPTION_TEST,
	PUBLIC_STRIPE_PRODUCT_ID_ULTIMATE_SUBSCRIPTION_TEST
] as const;

export const STRIPE_PRICE_IDS_CREDITS = [PUBLIC_STRIPE_PRICE_ID_1500_CREDITS_TEST];
export const STRIPE_PRODUCT_IDS_CREDITS = [PUBLIC_STRIPE_PRODUCT_ID_1500_CREDITS_TEST];

export const STRIPE_HIGHEST_PRODUCT_ID_SUBSCRIPTIONS =
	STRIPE_PRODUCT_IDS_SUBSCRIPTIONS[STRIPE_PRODUCT_IDS_SUBSCRIPTIONS.length - 1];

export const STRIPE_CURRENCY_TO_SYMBOL: { [currency in TStripeSupportedCurrency]: string } = {
	usd: '$',
	eur: '€'
} as const;

export type TStripeSupportedPriceIdSubscriptionsMo =
	typeof STRIPE_PRICE_IDS_SUBSCRIPTIONS_MO[number];

export type TStripeSupportedProductIdSubscriptions =
	typeof STRIPE_PRODUCT_IDS_SUBSCRIPTIONS[number];
export type TStripeSupportedCurrency = typeof STRIPE_CURRENCIES[number];

export type TStripeSupportedPriceIdCredits = typeof STRIPE_PRICE_IDS_CREDITS[number];
export type TStripeSupportedProductIdCredits = typeof STRIPE_PRODUCT_IDS_CREDITS[number];

export const STRIPE_PRODUCT_ID_OBJECTS_SUBSCRIPTIONS_MO: {
	[prodcutId in TStripeSupportedProductIdSubscriptions]: {
		product_id: TStripeSupportedProductIdSubscriptions;
		monthly_images: number;
		prices: {
			[priceId in TStripeSupportedPriceIdSubscriptionsMo]: {
				currencies: {
					[currency in TStripeSupportedCurrency]: {
						amount: number;
					};
				};
			};
		};
	};
} = {
	[PUBLIC_STRIPE_PRODUCT_ID_STARTER_SUBSCRIPTION_TEST]: {
		product_id: PUBLIC_STRIPE_PRODUCT_ID_STARTER_SUBSCRIPTION_TEST,
		monthly_images: 1750,
		prices: {
			[PUBLIC_STRIPE_PRICE_ID_STARTER_SUBSCRIPTION_MO_TEST]: {
				currencies: {
					usd: {
						amount: 10
					},
					eur: {
						amount: 10
					}
				}
			}
		}
	},
	[PUBLIC_STRIPE_PRODUCT_ID_PRO_SUBSCRIPTION_TEST]: {
		product_id: PUBLIC_STRIPE_PRODUCT_ID_PRO_SUBSCRIPTION_TEST,
		monthly_images: 4500,
		prices: {
			[PUBLIC_STRIPE_PRICE_ID_PRO_SUBSCRIPTION_MO_TEST]: {
				currencies: {
					usd: {
						amount: 25
					},
					eur: {
						amount: 25
					}
				}
			}
		}
	},
	[PUBLIC_STRIPE_PRODUCT_ID_ULTIMATE_SUBSCRIPTION_TEST]: {
		product_id: PUBLIC_STRIPE_PRODUCT_ID_ULTIMATE_SUBSCRIPTION_TEST,
		monthly_images: 10000,
		prices: {
			[PUBLIC_STRIPE_PRICE_ID_ULTIMATE_SUBSCRIPTION_MO_TEST]: {
				currencies: {
					usd: {
						amount: 50
					},
					eur: {
						amount: 50
					}
				}
			}
		}
	}
} as const;

export const STRIPE_PRODUCT_ID_OBJECTS_CREDITS: {
	[prodcutId in TStripeSupportedProductIdCredits]: {
		product_id: TStripeSupportedProductIdCredits;
		images: number;
		prices: {
			[priceId in TStripeSupportedPriceIdCredits]: {
				currencies: {
					[currency in TStripeSupportedCurrency]: {
						amount: number;
					};
				};
			};
		};
	};
} = {
	[PUBLIC_STRIPE_PRODUCT_ID_1500_CREDITS_TEST]: {
		product_id: PUBLIC_STRIPE_PRODUCT_ID_1500_CREDITS_TEST,
		images: 1500,
		prices: {
			[PUBLIC_STRIPE_PRICE_ID_1500_CREDITS_TEST]: {
				currencies: {
					usd: {
						amount: 10
					},
					eur: {
						amount: 10
					}
				}
			}
		}
	}
} as const;
