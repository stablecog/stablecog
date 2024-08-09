import { getCustomerPortalUrl } from '$ts/helpers/user/getCustomerPortalUrl';
import { redirect, type ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async (event) => {
	const { session } = await event.locals.safeGetSession();
	if (!session?.user?.id) {
		redirect(307, `/sign-in?rd_to=${encodeURIComponent(event.url.pathname + event.url.search)}`);
	}
	try {
		const { customer_portal_url, error } = await getCustomerPortalUrl({
			returnUrl: `${event.url.origin}/account`,
			accessToken: session.access_token
		});
		if (error) throw new Error(error);
		return {
			customer_portal_url
		};
	} catch (e) {
		console.log(e);
		return {
			customer_portal_url: undefined
		};
	}
};
