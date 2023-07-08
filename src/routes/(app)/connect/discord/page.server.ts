export const load = async (event) => {
	const params = event.url.searchParams;
	const discord_id = params.get('discord_id');
	const discord_token = params.get('discord_token');
	return {
		discord_id,
		discord_token
	};
};
