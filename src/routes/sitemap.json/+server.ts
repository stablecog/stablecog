import type { RequestHandler } from '@sveltejs/kit';
import { getAllRoutes } from '$ts/helpers/sitemap';

export const GET: RequestHandler = async () => {
	const allRoutes = await getAllRoutes();
	const headers = {
		'Cache-Control': `public, max-age=${3600}, s-max-age=${3600}`,
		'Content-Type': 'application/json'
	};
	return new Response(JSON.stringify(allRoutes), { headers });
};
