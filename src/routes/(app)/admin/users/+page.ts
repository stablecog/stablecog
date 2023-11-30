export const load = async ({ url }) => {
	const searchStringParam = url.searchParams.get('q');
	const searchString = searchStringParam || '';
	const viewParam = url.searchParams.get('view');
	const view = viewParam || '';
	return {
		searchString,
		view
	};
};
