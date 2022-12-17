import { env } from '$env/dynamic/private';
import { supabaseAdmin } from '$ts/constants/supabaseAdmin';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import type { RequestHandler } from '@sveltejs/kit';
import Stripe from 'stripe';

const stripe = new Stripe(env.STRIPE_SECRET_KEY_TEST, {
	apiVersion: '2022-11-15'
});

/* const tiers = [
	{
		name: 'pro',
		priceId: 'price_1MFLkCBZEfCmgpOWyidn3xgR'
	}
] as const; */

const tiers = [
	{
		name: 'pro',
		priceId: 'price_1MG8RWBZEfCmgpOWQNLLeTwK'
	}
] as const;

const defaultTier = tiers[0];

export const GET: RequestHandler = async (event) => {
	const { session } = await getSupabase(event);
	const url = event.url;
	const baseUrl = `${url.protocol}//${url.host}`;
	const tierParam = event.url.searchParams.get('tier');
	const tier = tiers.find((t) => t.name === tierParam) || defaultTier;
	const email = session?.user.email;
	if (!email) {
		return new Response(JSON.stringify({ error: 'No email provided' }));
	}
	const { data: userData, error: userError } = await supabaseAdmin
		.from('user')
		.select('id,stripe_customer_id')
		.eq('email', email)
		.maybeSingle();
	if (userError || !userData) {
		return new Response(JSON.stringify({ error: userError || 'No user found' }));
	}
	const customer = await stripe.customers.retrieve(userData.stripe_customer_id);
	const checkoutSession = await stripe.checkout.sessions.create({
		customer: customer.id,
		line_items: [
			{
				price: tier.priceId,
				quantity: 1
			}
		],
		mode: 'subscription',
		success_url: `${baseUrl}/pro/success`,
		cancel_url: `${baseUrl}/pro/cancel`
	});
	return new Response(
		JSON.stringify({
			data: {
				checkoutSession
			}
		})
	);
};

interface IBody {
	access_token: string;
}
