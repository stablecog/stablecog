import { redirect } from '@sveltejs/kit';

export const load = async ({ url, params }) => {
	const outputId = url.searchParams.get('output');
	const outputIdShort = url.searchParams.get('o');
	const username = params.username;

	if (outputId) redirect(302, `/${username}/o/${outputId}`);
	if (outputIdShort) redirect(302, `/${username}/o/${outputIdShort}`);
	redirect(301, `/${username}`);
};
