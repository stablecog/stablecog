import { browser } from '$app/environment';
import { isHydrated } from '$ts/helpers/isHydrated';
import { redirect, type ServerLoad } from '@sveltejs/kit';

const generationRelatedSearchParams = [
	'p',
	'np',
	's',
	'w',
	'h',
	'ar',
	'gs',
	'is',
	'mi',
	'si',
	'adv',
	'iis'
];

export const load: ServerLoad = async ({ url, parent }) => {
	const parentData = await parent();
	const { session, userSummary } = parentData;
	if (session && userSummary) {
		const params = url.searchParams.toString();
		throw redirect(302, `/generate${params ? `?${params}` : ''}`);
	}
	let hasGenerationRelatedSearchParam = false;
	for (let i = 0; i < generationRelatedSearchParams.length; i++) {
		if (url.searchParams.get(generationRelatedSearchParams[i]) !== null) {
			hasGenerationRelatedSearchParam = true;
			break;
		}
	}
	if (hasGenerationRelatedSearchParam) {
		throw redirect(302, `/generate?${url.searchParams.toString()}`);
	}
	return {};
};
