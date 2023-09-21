import { apiUrl, authServerUrl } from '$ts/constants/main';
import type { TStripeSupportedPriceIdSubscriptionsMo } from '$ts/constants/stripePublic';
import type { TUserSummary } from '$ts/stores/user/summary';

export async function getUserSummary(
	access_token: string | undefined
): Promise<TUserSummary | null> {
	if (!access_token) return null;
	console.log('getting user summary');
	let userSummary: TUserSummary | null = null;
	const userRes = await fetch(`${apiUrl.origin}/v1/user`, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${access_token}`
		}
	});
	if (userRes.ok) {
		const userResJson: TUserSummary = await userRes.json();
		userSummary = userResJson;
	}
	return userSummary;
}

export async function downgradeSubscription(
	price_id: TStripeSupportedPriceIdSubscriptionsMo,
	access_token: string
) {
	const res = await fetch(`${apiUrl.origin}/v1/user/subscription/downgrade`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${access_token}`
		},
		body: JSON.stringify({
			target_price_id: price_id
		})
	});
	const resJson = await res.json();
	console.log(resJson);
}

interface TConnectAccountResponse {
	test?: '';
	description?: string;
	error?: string;
}

interface TApproveAppAuthorizationResponse {
	redirect_url: string;
	error?: string;
}

export async function connectAccountToDiscord({
	access_token,
	platform_user_id,
	platform_token
}: {
	access_token: string;
	platform_user_id: string;
	platform_token: string;
}): Promise<TConnectAccountResponse> {
	console.log('connecting account to Discord');
	const res = await fetch(`${apiUrl.origin}/v1/user/connect/discord`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${access_token}`
		},
		body: JSON.stringify({
			platform_user_id,
			platform_token
		})
	});
	const resJson: TConnectAccountResponse = await res.json();
	return resJson;
}

export async function approveAppAuthorization({
	refresh_token,
	app_code,
	app_id
}: {
	refresh_token: string;
	app_code: string;
	app_id: string;
}): Promise<TApproveAppAuthorizationResponse> {
	const res = await fetch(`${authServerUrl.origin}/oauth/approve`, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${refresh_token}`
		},
		body: JSON.stringify({
			app_code,
			app_id
		})
	});
	const resJson: TApproveAppAuthorizationResponse = await res.json();
	return resJson;
}
