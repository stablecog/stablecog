import { STRIPE_PRO_PRICE_ID } from '$env/static/private';
import { stripe } from '$ts/constants/stripe';
import type { ServerLoad } from '@sveltejs/kit';
import { error } from '@sveltejs/kit';

export const load: ServerLoad = async ({}) => {
	try {
		const res = await stripe.prices.retrieve(STRIPE_PRO_PRICE_ID);
		if (res.unit_amount === null || res.unit_amount === undefined) {
			throw error(500, 'Error loading prices');
		}
		return {
			prices: {
				pro: res.unit_amount
			}
		};
	} catch (err) {
		throw error(500, 'Error loading prices');
	}
};
