import { isAllowedRedirectRoute } from '$ts/constants/main';
import type { PageServerLoad } from './$types';
export const load: PageServerLoad = async (event) => {
	const { url } = event;
	const _redirect_to = url.searchParams.get('redirect_to');
	const redirect_to = _redirect_to !== null ? decodeURIComponent(_redirect_to) : null;
	const _error_code = url.searchParams.get('error_code');
	const error_code = _error_code !== null ? Number(decodeURIComponent(_error_code)) : null;
	const data = {
		redirect_to: redirect_to && isAllowedRedirectRoute(redirect_to) ? redirect_to : null,
		error_code: error_code || null
	};
	return data;
};
