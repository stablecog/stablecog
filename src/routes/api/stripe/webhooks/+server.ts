import { DISCORD_WEBHOOK_SUBSCRIBER_URL, STRIPE_SIGNING_SECRET } from '$env/static/private';
import { stripe } from '$ts/constants/stripe';
import { supabaseAdmin } from '$ts/constants/supabaseAdmin';
import type { RequestHandler } from '@sveltejs/kit';
import Stripe from 'stripe';
import Mixpanel from 'mixpanel';
import { PUBLIC_MIXPANEL_ID } from '$env/static/public';
import { getDiscordWebhookBodyNewSubscriber } from '$ts/helpers/discord';

const cryptoProvider = Stripe.createSubtleCryptoProvider();
const mixpanel = Mixpanel.init(PUBLIC_MIXPANEL_ID);

export const POST: RequestHandler = async (event) => {
	console.log('Stripe webhook - Request received - /api/stripe/webhooks');
	const signature = event.request.headers.get('Stripe-Signature');
	if (!signature) return new Response('No signature', { status: 400 });

	const body = await event.request.text();

	let receivedEvent;
	try {
		receivedEvent = await stripe.webhooks.constructEventAsync(
			body,
			signature,
			STRIPE_SIGNING_SECRET,
			undefined,
			cryptoProvider
		);
	} catch (err) {
		console.log('Stripe webhook - Error constructing event: ', (err as Error).message);
		return new Response((err as Error).message, { status: 400 });
	}

	console.log(`Stripe webhook - Event received: ${receivedEvent.id}`);

	const requestOptions =
		receivedEvent.request && receivedEvent.request.idempotency_key
			? {
					idempotencyKey: receivedEvent.request.idempotency_key
			  }
			: {};

	let retrievedEvent: Stripe.Response<Stripe.Event>;
	try {
		retrievedEvent = await stripe.events.retrieve(receivedEvent.id, requestOptions);
	} catch (err) {
		return new Response((err as Error).message, { status: 400 });
	}

	const subscription = retrievedEvent.data.object as Stripe.Subscription;
	const customerId = subscription.customer;
	// @ts-ignore
	const prevStatus: string | undefined = retrievedEvent.data.previous_attributes?.status;
	// @ts-ignore
	const productId = subscription.plan?.product;
	if (customerId && productId)
		console.log(`Stripe webhook - Customer ID: ${customerId} - Product: ${productId}`);

	switch (retrievedEvent.type) {
		case 'customer.subscription.deleted':
			await supabaseAdmin
				.from('user')
				.update({
					subscription_tier: 'FREE'
				})
				.match({ stripe_customer_id: customerId });
			break;
		case 'customer.subscription.updated':
			const prod = await stripe.products.retrieve(productId);
			if (subscription.status === 'incomplete_expired') {
				const customer = await stripe.customers.retrieve(customerId as string, {
					expand: ['subscriptions']
				});
				// @ts-ignore
				const subscription: Stripe.Subscription[] = customer.subscriptions.data;
				if (!subscription || subscription.length === 0) {
					await supabaseAdmin
						.from('user')
						.update({
							subscription_tier: 'FREE'
						})
						.match({ stripe_customer_id: customerId });
				}
			} else {
				const userRes = await supabaseAdmin
					.from('user')
					.update({
						subscription_tier: prod.name.toUpperCase()
					})
					.match({ stripe_customer_id: customerId })
					.select('id,email')
					.maybeSingle();
				const user = userRes.data;
				if (!user) return new Response('User not found', { status: 400 });
				// If new subscription
				if (prevStatus && prevStatus === 'incomplete') {
					mixpanel.people.set(user.id, {
						$email: user.email,
						'SC - Stripe ID': customerId
					});
					mixpanel.track('Subscription', {
						distinct_id: user.id,
						'SC - Email': user.email,
						'SC - Plan': prod.name.toUpperCase(),
						'SC - Supabase ID': user.id,
						'SC - Stripe ID': customerId
					});
					try {
						const { count } = await supabaseAdmin
							.from('user')
							.select('*', { count: 'exact', head: true })
							.filter('subscription_tier', 'eq', prod.name.toUpperCase())
							.or(
								'subscription_category.is.null,subscription_category.not.in.("GIFTED","FRIEND_BOUGHT")'
							);
						await fetch(DISCORD_WEBHOOK_SUBSCRIBER_URL, {
							method: 'POST',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify(
								getDiscordWebhookBodyNewSubscriber({
									email: user.email,
									plan: prod.name.toUpperCase(),
									stripeId: customerId.toString(),
									supabaseId: user.id,
									count
								})
							)
						});
					} catch (e) {
						console.log(e);
					}
				}
			}
			break;
		default:
			console.log(`Stripe webhook - Unhandled retrievedEvent type ${retrievedEvent.type}`);
	}

	return new Response(JSON.stringify({ id: retrievedEvent.id, status: 'ok' }), { status: 200 });
};
