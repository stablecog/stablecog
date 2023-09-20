export const load = async ({ url }) => {
	const app_id = url.searchParams.get('app_id');
	const app_code = url.searchParams.get('app_code');
	return {
		app_id,
		app_code
	};
};
