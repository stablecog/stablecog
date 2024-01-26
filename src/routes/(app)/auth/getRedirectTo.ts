import { canonicalUrl } from '$ts/constants/main';

const defaultRedirectTo = '/';

export function getRedirectTo(searchParams: URLSearchParams) {
	let rd_to = searchParams.get('rd_to') || defaultRedirectTo;
	try {
		const url = new URL(rd_to);
		const canonical = new URL(canonicalUrl);
		if (url.hostname === canonical.hostname) {
			rd_to = url.pathname + url.search;
		} else {
			rd_to = url.href + url.search;
		}
	} catch (error) {
		return rd_to;
	}
	return defaultRedirectTo;
}
