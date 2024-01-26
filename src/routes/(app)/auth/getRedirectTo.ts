const defaultRedirectTo = '/';

export function getRedirectTo(searchParams: URLSearchParams) {
	let rd_to = searchParams.get('rd_to') || defaultRedirectTo;
	return rd_to;
}
