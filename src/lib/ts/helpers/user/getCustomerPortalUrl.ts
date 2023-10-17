import { apiUrl } from '$ts/constants/main';

export async function getCustomerPortalUrl({
	returnUrl,
	accessToken
}: {
	returnUrl: string;
	accessToken: string;
}) {
	const res = await fetch(`${apiUrl.origin}/v1/user/subscription/portal`, {
		body: JSON.stringify({
			return_url: returnUrl
		}),
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${accessToken}`
		}
	});
	if (!res.ok) {
		throw new Error('Failed to get customer portal url');
	}
	const resJson: TCustomerPortalRes = await res.json();
	return resJson;
}

export interface TCustomerPortalRes {
	customer_portal_url?: string;
	error?: string;
}
