import { env } from '$env/dynamic/private';
import { supabaseAdmin } from '$ts/constants/supabaseAdmin';
import type { RequestHandler } from '@sveltejs/kit';
import Stripe from 'stripe';

const stripe = new Stripe(env.STRIPE_SECRET_KEY_TEST, {
	apiVersion: '2022-11-15'
});

export const POST: RequestHandler = async ({ request }) => {
	const body: IBody = await request.json();
	const record = body.record;

	if (!record.email) {
		return new Response(JSON.stringify({ error: 'No email provided' }));
	}
	if (!record.id) {
		return new Response(JSON.stringify({ error: 'No ID provided' }));
	}

	const { data, error } = await supabaseAdmin
		.from('user')
		.select('id,email,stripe_customer_id')
		.eq('id', record.id)
		.maybeSingle();
	if (error) {
		return new Response(JSON.stringify({ error }));
	}
	if (!data || !data.id) {
		return new Response(JSON.stringify({ error: 'No user found' }));
	}
	if (data.stripe_customer_id) {
		return new Response(JSON.stringify({ error: 'User already has a Stripe customer id' }));
	}
	if (!data.email || data.email !== record.email) {
		return new Response(JSON.stringify({ error: 'Emails do not match' }));
	}

	const customer = await stripe.customers.create({
		email: record.email,
		metadata: {
			supabase_id: record.id
		}
	});

	const { data: dataUpdate, error: errorUpdate } = await supabaseAdmin
		.from('user')
		.update({ stripe_customer_id: customer.id })
		.match({ id: record.id })
		.select('stripe_customer_id');

	return new Response(JSON.stringify({ data: dataUpdate, error: errorUpdate }));
};

interface IBody {
	record: {
		id: string;
		email: string;
	};
}
