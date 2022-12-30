import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async (_) => {
	return new Response('Ok', {
		status: 302,
		headers: {
			Location: '/pro'
		}
	});
};
