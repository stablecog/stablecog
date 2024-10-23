import { getApiUrl } from '$ts/constants/main';
import { redirect, type ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async (event) => {
	const { session } = await event.locals.safeGetSession();
	if (!session) {
		redirect(302, '/sign-in');
	}
	const targetPriceId = event.url.searchParams.get('target_price_id');
	const url = `${getApiUrl().origin}/v1/user/subscription/update/preview`;
	const res = await event.fetch(url, {
		method: 'POST',
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${session.access_token}`
		},
		body: JSON.stringify({
			target_price_id: targetPriceId
		})
	});
	if (!res.ok) {
		console.log(res.statusText);
		return {
			previewData: null,
			error: res.statusText
		};
	}
	const resJson = await res.json();
	console.log(resJson);
};
