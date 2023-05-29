import { apiUrl } from '$ts/constants/main';
import { redirect, type ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async (event) => {
	const session = await event.locals.getSession();
	if (!session?.user?.id) {
		throw redirect(307, `/sign-in?redirect_to=${encodeURIComponent(event.url.pathname)}`);
	}
	try {
		const return_url = `${event.url.origin}/account`;
		const res = await fetch(`${apiUrl.origin}/v1/user/subscription/portal`, {
			body: JSON.stringify({
				return_url
			}),
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${session.access_token}`
			}
		});
		if (!res.ok) {
			throw new Error('Failed to get customer portal url');
		}
		const resJson: TCustomerPortalRes = await res.json();
		const { customer_portal_url } = resJson;
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

interface TCustomerPortalRes {
	customer_portal_url?: string;
	error?: string;
}
