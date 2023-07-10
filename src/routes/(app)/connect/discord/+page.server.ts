export const load = async (event) => {
	const params = event.url.searchParams;
	const platform_user_id = params.get('platform_user_id');
	const platform_username = params.get('platform_username');
	const platform_token = params.get('platform_token');
	let platform_avatar_url = params.get('platform_avatar_url');
	if (platform_avatar_url) {
		platform_avatar_url = decodeURIComponent(platform_avatar_url);
	}
	return {
		platform_user_id,
		platform_username,
		platform_token,
		platform_avatar_url
	};
};
