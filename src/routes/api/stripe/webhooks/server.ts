import { STRIPE_SIGNING_SECRET_TEST } from '$env/static/private';
import { stripe } from '$ts/constants/stripe';
import { supabaseAdmin } from '$ts/constants/supabaseAdmin';
import type { RequestHandler } from '@sveltejs/kit';
import Stripe from 'stripe';

const cryptoProvider = Stripe.createSubtleCryptoProvider();

export const GET: RequestHandler = async (event) => {
	const signature = event.request.headers.get('stripe-signature');
	if (!signature) {
		return new Response('No signature', { status: 400 });
	}
	const body = await event.request.text();

	let receivedEvent;
	try {
		receivedEvent = await stripe.webhooks.constructEventAsync(
			body,
			signature,
			STRIPE_SIGNING_SECRET_TEST,
			undefined,
			cryptoProvider
		);
	} catch (err) {
		return new Response((err as Error).message, { status: 400 });
	}

	console.log(`Stripe webhook event received: ${receivedEvent.id}`);

	const requestOptions =
		receivedEvent.request && receivedEvent.request.idempotency_key
			? {
					idempotencyKey: receivedEvent.request.idempotency_key
			  }
			: {};

	let retrievedEvent;
	try {
		retrievedEvent = await stripe.events.retrieve(receivedEvent.id, requestOptions);
	} catch (err) {
		return new Response((err as Error).message, { status: 400 });
	}

	const subscription = retrievedEvent.data.object;

	switch (retrievedEvent.type) {
		case 'customer.subscription.deleted':
			await supabaseAdmin
				.from('user')
				.update({
					subscription_tier: 'FREE'
				})
				// @ts-ignore
				.match({ stripe_customer_id: subscription.customer });
			break;
		case 'customer.subscription.updated':
			// @ts-ignore
			const product = await stripe.products.retrieve(subscription.plan.product);
			await supabaseAdmin
				.from('user')
				.update({
					subscription_tier: product.name.toUpperCase()
				})
				// @ts-ignore
				.match({ stripe_customer_id: subscription.customer });
			break;
		default:
			console.log(`Unhandled retrievedEvent type ${retrievedEvent.type}`);
	}

	return new Response(JSON.stringify({ id: retrievedEvent.id, status: 'ok' }), { status: 200 });
};
