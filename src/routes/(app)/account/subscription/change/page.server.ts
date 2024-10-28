import { getApiUrl } from '$ts/constants/main';
import { error, redirect, type ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = async (event) => {
	const { session } = await event.locals.safeGetSession();
	if (!session) {
		redirect(302, '/sign-in');
	}
	const targetPriceId = event.url.searchParams.get('target_price_id');
	const from = event.url.searchParams.get('from') || '/pricing';
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
		console.log('Failed to get preview data', res.statusText);
		error(500, 'Failed to get preview data');
	}
	const resJson: TPreviewRes = await res.json();
	if (!resJson.success) {
		error(500, 'Failed to get preview data');
	}
	console.log(resJson);
	const previewData: TPreviewRes['preview'] = {
		...resJson.preview
	};
	return {
		previewData,
		from
	};
};

type TPreviewRes = {
	preview: {
		current_plan: string;
		new_plan: string;
		has_proration: boolean;
		proration_amount: number;
		proration_date: number;
		new_amount: number;
		current_period_end: number;
		is_annual: boolean;
		currency: 'usd' | 'eur';
	};
	success: true;
};
