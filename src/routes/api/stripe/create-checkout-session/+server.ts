import { stripe } from '$ts/constants/stripe';
import {
	STRIPE_CURRENCIES,
	STRIPE_PRICE_IDS,
	type TStripeSupportedCurrency,
	type TStripeSupportedPriceId
} from '$ts/constants/stripePublic';
import { supabaseAdmin } from '$ts/constants/supabaseAdmin';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async (event) => {
	const { session } = await getSupabase(event);
	if (!session?.user.id) {
		return new Response(JSON.stringify({ error: 'No user ID' }));
	}
	const priceIdParam = event.url.searchParams.get('price_id');
	const priceId = STRIPE_PRICE_IDS.find((id) => id === priceIdParam);
	if (!priceId) {
		return new Response(JSON.stringify({ error: 'Invalid price ID' }));
	}
	const priceIdValidated = priceId as TStripeSupportedPriceId;
	const currencyParam = event.url.searchParams.get('currency');
	if (!STRIPE_CURRENCIES.includes(currencyParam as TStripeSupportedCurrency)) {
		return new Response(JSON.stringify({ error: 'Invalid currency' }));
	}
	const currencyValidated = currencyParam as TStripeSupportedCurrency;
	const url = event.url;
	const baseUrl = `${url.protocol}//${url.host}`;

	const { data: userData, error: userError } = await supabaseAdmin
		.from('users')
		.select('stripe_customer_id')
		.eq('id', session.user.id)
		.maybeSingle();
	if (userError || !userData) {
		return new Response(JSON.stringify({ error: userError || 'No user found' }));
	}
	const customer = await stripe.customers.retrieve(userData.stripe_customer_id);
	const checkoutSession = await stripe.checkout.sessions.create({
		customer: customer.id,
		line_items: [
			{
				price: priceIdValidated,
				quantity: 1
			}
		],
		currency: currencyValidated,
		mode: 'subscription',
		success_url: `${baseUrl}/pricing/purchase/succeeded`,
		cancel_url: `${baseUrl}/pricing/purchase/cancelled`
	});
	return new Response(
		JSON.stringify({
			data: {
				checkoutSession
			}
		})
	);
};
