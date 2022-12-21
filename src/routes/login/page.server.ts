import { isAllowedRedirectRoute } from '$ts/constants/main';
import type { ServerLoad } from '@sveltejs/kit';

export const load: ServerLoad = ({ url }) => {
	const _redirect_to = url.searchParams.get('redirect_to');
	const redirect_to = _redirect_to !== null ? decodeURIComponent(_redirect_to) : null;
	const data = {
		redirect_to: redirect_to && isAllowedRedirectRoute(redirect_to) ? redirect_to : null
	};
	return data;
};
