import { eurCountryCodes } from '$ts/constants/main';
import {
	currencyToSymbol,
	stripe,
	STRIPE_PRICE_IDS,
	type TSupportedCurrency
} from '$ts/constants/stripe';
import { error } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async ({ url, locals }) => {
	const countryCode = locals.countryCode;
	const currency: TSupportedCurrency =
		countryCode && eurCountryCodes.includes(countryCode) ? 'eur' : 'usd';
	const promises = STRIPE_PRICE_IDS.map((priceId) => stripe.prices.retrieve(priceId));
	const res = await Promise.all(promises);
	const prices = res.map((price) => {
		if (price.unit_amount === null || price.unit_amount === undefined) {
			throw error(500, 'Error loading prices');
		}
		return {
			id: price.id,
			amount: price.unit_amount / 100,
			currency: currency,
			currencySymbol: currencyToSymbol[currency]
		};
	});
	return {
		prices
	};
};
