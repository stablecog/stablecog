import {
	PUBLIC_STRIPE_PRICE_ID_STARTER_MO_TEST,
	PUBLIC_STRIPE_PRICE_ID_PRO_MO_TEST,
	PUBLIC_STRIPE_PRICE_ID_ULTIMATE_MO_TEST,
	PUBLIC_STRIPE_PRODUCT_ID_STARTER_TEST,
	PUBLIC_STRIPE_PRODUCT_ID_PRO_TEST,
	PUBLIC_STRIPE_PRODUCT_ID_ULTIMATE_TEST
} from '$env/static/public';

export const STRIPE_CURRENCIES = ['usd', 'eur'] as const;

export const STRIPE_PRICE_IDS = [
	PUBLIC_STRIPE_PRICE_ID_STARTER_MO_TEST,
	PUBLIC_STRIPE_PRICE_ID_PRO_MO_TEST,
	PUBLIC_STRIPE_PRICE_ID_ULTIMATE_MO_TEST
] as const;

export const STRIPE_PRODUCT_IDS = [
	PUBLIC_STRIPE_PRODUCT_ID_STARTER_TEST,
	PUBLIC_STRIPE_PRODUCT_ID_PRO_TEST,
	PUBLIC_STRIPE_PRODUCT_ID_ULTIMATE_TEST
] as const;

export const STRIPE_CURRENCY_TO_SYMBOL: { [currency in TStripeSupportedCurrency]: string } = {
	usd: '$',
	eur: '€'
} as const;

export type TStripeSupportedPriceId = typeof STRIPE_PRICE_IDS[number];
export type TStripeSupportedProductId = typeof STRIPE_PRODUCT_IDS[number];
export type TStripeSupportedCurrency = typeof STRIPE_CURRENCIES[number];

export const STRIPE_PRODUCT_ID_OBJECTS: {
	[prodcutId in TStripeSupportedProductId]: {
		product_id: TStripeSupportedProductId;
		monthly_images: number;
		prices: {
			[priceId in TStripeSupportedPriceId]: {
				currencies: {
					[currency in TStripeSupportedCurrency]: {
						amount: number;
					};
				};
			};
		};
	};
} = {
	[PUBLIC_STRIPE_PRODUCT_ID_STARTER_TEST]: {
		product_id: PUBLIC_STRIPE_PRODUCT_ID_STARTER_TEST,
		monthly_images: 1750,
		prices: {
			[PUBLIC_STRIPE_PRICE_ID_STARTER_MO_TEST]: {
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
	[PUBLIC_STRIPE_PRODUCT_ID_PRO_TEST]: {
		product_id: PUBLIC_STRIPE_PRODUCT_ID_PRO_TEST,
		monthly_images: 4500,
		prices: {
			[PUBLIC_STRIPE_PRICE_ID_PRO_MO_TEST]: {
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
	[PUBLIC_STRIPE_PRODUCT_ID_ULTIMATE_TEST]: {
		product_id: PUBLIC_STRIPE_PRODUCT_ID_ULTIMATE_TEST,
		monthly_images: 10000,
		prices: {
			[PUBLIC_STRIPE_PRICE_ID_ULTIMATE_MO_TEST]: {
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
