import { stripe } from '$ts/constants/stripe';
import { supabaseAdmin } from '$ts/constants/supabaseAdmin';

export async function createStripeCustomerPortalSession(id: string, returnUrl: string) {
	let customerPortalSession = null;
	const { data: userData, error: userError } = await supabaseAdmin
		.from('user')
		.select('stripe_customer_id')
		.eq('id', id)
		.maybeSingle();
	if (userError || !userData) {
		throw Error('Customer id not found');
	}
	const customer = await stripe.customers.retrieve(userData.stripe_customer_id);
	customerPortalSession = await stripe.billingPortal.sessions.create({
		customer: customer.id,
		return_url: returnUrl
	});
	return customerPortalSession;
}
