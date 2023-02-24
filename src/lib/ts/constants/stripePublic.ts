import {
	PUBLIC_STRIPE_PRICE_ID_STARTER_TEST,
	PUBLIC_STRIPE_PRICE_ID_PRO_TEST,
	PUBLIC_STRIPE_PRICE_ID_ULTIMATE_TEST
} from '$env/static/public';

export const STRIPE_CURRENCIES = ['usd', 'eur'] as const;
export const STRIPE_PRICE_IDS = [
	PUBLIC_STRIPE_PRICE_ID_STARTER_TEST,
	PUBLIC_STRIPE_PRICE_ID_PRO_TEST,
	PUBLIC_STRIPE_PRICE_ID_ULTIMATE_TEST
] as const;

export type TStripeSupportedPriceId = typeof STRIPE_PRICE_IDS[number];
export type TStripeSupportedCurrency = typeof STRIPE_CURRENCIES[number];

export const STRIPE_CURRENCY_TO_SYMBOL: { [currency in TStripeSupportedCurrency]: string } = {
	usd: '$',
	eur: '€'
} as const;

export const STRIPE_PRODUCTS: {
	[priceId in TStripeSupportedPriceId]: {
		currencies: {
			[currency in TStripeSupportedCurrency]: {
				amount: number;
			};
		};
	};
} = {
	[PUBLIC_STRIPE_PRICE_ID_STARTER_TEST]: {
		currencies: {
			usd: {
				amount: 10
			},
			eur: {
				amount: 10
			}
		}
	},
	[PUBLIC_STRIPE_PRICE_ID_PRO_TEST]: {
		currencies: {
			usd: {
				amount: 25
			},
			eur: {
				amount: 25
			}
		}
	},
	[PUBLIC_STRIPE_PRICE_ID_ULTIMATE_TEST]: {
		currencies: {
			usd: {
				amount: 50
			},
			eur: {
				amount: 50
			}
		}
	}
} as const;
