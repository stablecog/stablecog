import {
	STRIPE_PRO_PRICE_ID,
	STRIPE_PRO_PRICE_ID_EUR,
	STRIPE_SECRET_KEY
} from '$env/static/private';
import Stripe from 'stripe';

export const stripe = new Stripe(STRIPE_SECRET_KEY, {
	apiVersion: '2022-11-15'
});

export const stripeTiers = [
	{
		name: 'Pro',
		priceId: {
			USD: STRIPE_PRO_PRICE_ID,
			EUR: STRIPE_PRO_PRICE_ID_EUR
		}
	}
] as const;

export const defaultStripeTier = stripeTiers[0];
