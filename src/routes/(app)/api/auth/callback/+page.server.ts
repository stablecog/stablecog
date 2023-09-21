import { isAllowedRedirectRoute } from '$ts/constants/main';
import type { PageServerLoad } from './$types';
export const load: PageServerLoad = async (event) => {
	const { url } = event;
	const _rd_to = url.searchParams.get('rd_to');
	const error = url.searchParams.get('error');
	const error_code = url.searchParams.get('error_code');
	const rd_to = _rd_to !== null ? decodeURIComponent(_rd_to) : null;
	const data = {
		rd_to: rd_to && isAllowedRedirectRoute(rd_to) ? rd_to : null,
		error,
		error_code: error_code ? parseInt(error_code) : null
	};
	return data;
};
