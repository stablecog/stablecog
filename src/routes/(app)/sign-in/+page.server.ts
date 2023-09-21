import { isAllowedRedirectRoute } from '$ts/constants/main';
import { redirect } from '@sveltejs/kit';
import type { PageServerLoad } from './$types';

export const load: PageServerLoad = async (event) => {
	const { url } = event;
	const _rd_to = url.searchParams.get('rd_to');
	const rd_to = _rd_to !== null ? decodeURIComponent(_rd_to) : null;
	const data = {
		rd_to: rd_to && isAllowedRedirectRoute(rd_to) ? rd_to : null
	};
	const session = await event.locals.getSession();
	if (session?.user.id) {
		throw redirect(307, rd_to || '/');
	}
	return data;
};
