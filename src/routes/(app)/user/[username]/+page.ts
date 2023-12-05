import { redirect } from '@sveltejs/kit';

export const load = async ({ url, params }) => {
	const outputId = url.searchParams.get('output');
	const outputIdShort = url.searchParams.get('o');
	const username = params.username;

	if (outputId) throw redirect(302, `/${username}/o/${outputId}`);
	if (outputIdShort) throw redirect(302, `/${username}/o/${outputIdShort}`);
	throw redirect(301, `/${username}`);
};
