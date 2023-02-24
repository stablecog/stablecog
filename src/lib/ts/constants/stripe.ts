import { STRIPE_SECRET_KEY_TEST } from '$env/static/private';
import {
	PUBLIC_STRIPE_PRICE_ID_STARTER_TEST,
	PUBLIC_STRIPE_PRICE_ID_PRO_TEST,
	PUBLIC_STRIPE_PRICE_ID_ULTIMATE_TEST
} from '$env/static/public';
import Stripe from 'stripe';

export const stripe = new Stripe(STRIPE_SECRET_KEY_TEST, {
	apiVersion: '2022-11-15'
});

export const STRIPE_PRICE_IDS = [
	PUBLIC_STRIPE_PRICE_ID_STARTER_TEST,
	PUBLIC_STRIPE_PRICE_ID_PRO_TEST,
	PUBLIC_STRIPE_PRICE_ID_ULTIMATE_TEST
] as const;

export const supportedCurrencies = ['usd', 'eur'] as const;

export type TSupportedCurrency = typeof supportedCurrencies[number];
export type TSupportedPriceId = typeof STRIPE_PRICE_IDS[number];

export const currencyToSymbol: { [currency in TSupportedCurrency]: string } = {
	usd: '$',
	eur: '€'
} as const;

export const stripeProducts: {
	[priceId in TSupportedPriceId]: {
		currencies: {
			[currency in TSupportedCurrency]: {
				amount: number;
			};
		};
	};
} = {
	PUBLIC_STRIPE_PRICE_ID_STARTER_TEST: {
		currencies: {
			usd: {
				amount: 10
			},
			eur: {
				amount: 10
			}
		}
	},
	PUBLIC_STRIPE_PRICE_ID_PRO_TEST: {
		currencies: {
			usd: {
				amount: 25
			},
			eur: {
				amount: 25
			}
		}
	},
	PUBLIC_STRIPE_PRICE_ID_ULTIMATE_TEST: {
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
