import { isAllowedRedirectRoute } from '$ts/constants/main';

export const load = async (event) => {
	const { url } = event;
	const _rd_to = url.searchParams.get('rd_to');
	const rd_to = _rd_to !== null ? decodeURIComponent(_rd_to) : null;
	const data = {
		rd_to: rd_to && isAllowedRedirectRoute(rd_to) ? rd_to : null
	};
	return data;
};
