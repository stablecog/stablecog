import { createStripeCustomerPortalSession } from '$ts/helpers/stripe';
import { getServerSession } from '@supabase/auth-helpers-sveltekit';
import { redirect, type ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async (event) => {
	const session = await getServerSession(event);
	if (!session?.user?.id) {
		throw redirect(307, `/login?redirect_to=${encodeURIComponent(event.url.pathname)}`);
	}
	const { url } = event;
	const baseUrl = `${url.protocol}//${url.host}`;
	const returnUrl = `${baseUrl}/account`;
	try {
		const customerPortalSession = await createStripeCustomerPortalSession(
			session.user.id,
			returnUrl
		);
		return {
			customerPortalSession
		};
	} catch (e) {
		return {
			customerPortalSession: null
		};
	}
};
