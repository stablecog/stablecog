import { isAllowedRedirectRoute } from '$ts/constants/main';
import type { PageServerLoad } from './$types';
export const load: PageServerLoad = async (event) => {
	const { url } = event;
	const _redirect_to = url.searchParams.get('redirect_to');
	const error = url.searchParams.get('error');
	const error_code = url.searchParams.get('error_code');
	const redirect_to = _redirect_to !== null ? decodeURIComponent(_redirect_to) : null;
	const data = {
		redirect_to: redirect_to && isAllowedRedirectRoute(redirect_to) ? redirect_to : null,
		error,
		error_code: error_code ? parseInt(error_code) : null
	};
	return data;
};
