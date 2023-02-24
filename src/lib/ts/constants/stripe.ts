import { STRIPE_SECRET_KEY_TEST } from '$env/static/private';
import Stripe from 'stripe';

export const stripe = new Stripe(STRIPE_SECRET_KEY_TEST, {
	apiVersion: '2022-11-15'
});
