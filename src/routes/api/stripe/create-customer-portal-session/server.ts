import { createStripeCustomerPortalSession } from '$ts/helpers/stripe';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async (event) => {
	const { session } = await getSupabase(event);
	if (!session?.user.id) {
		return new Response(JSON.stringify({ error: 'No user ID' }));
	}
	const url = event.url;
	const baseUrl = `${url.protocol}//${url.host}`;
	try {
		const customerPortalSession = await createStripeCustomerPortalSession(session.user.id, baseUrl);
		return new Response(
			JSON.stringify({
				data: {
					customerPortalSession
				}
			})
		);
	} catch (err) {
		return new Response(JSON.stringify({ error: (err as Error).message }));
	}
};
