import type { RequestHandler } from '@sveltejs/kit';

export const GET: RequestHandler = async ({ url, locals }) => {
	return new Response('Redirecting to /pricing', {
		status: 302,
		headers: {
			Location: `/pricing`
		}
	});
};
