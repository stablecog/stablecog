import { apiUrl } from '$ts/constants/main';
import type { TUserSummary } from '$ts/stores/user/summary';

export async function getUserSummary(access_token: string | undefined) {
	if (!access_token) return undefined;
	let userSummary: TUserSummary | undefined = undefined;
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
