import { canonicalUrl } from '$ts/constants/main';
import type { RequestHandler } from '@sveltejs/kit';

const today = new Date();
const year = today.getFullYear();
const month = today.getMonth() + 1;
const day = today.getDate();
const todayString = `${year}-${month >= 10 ? month : '0' + month}-${day >= 10 ? day : '0' + day}`;

const definedRoutes: IRoute[] = [
	{
		loc: '/',
		lastmod: todayString,
		changefreq: 'daily'
	},
	{
		loc: '/history',
		lastmod: todayString,
		changefreq: 'daily'
	},
	{
		loc: '/live',
		lastmod: todayString,
		changefreq: 'daily'
	}
];

export const GET: RequestHandler = async () => {
	const allRoutes = [...definedRoutes];
	const headers = {
		'Cache-Control': `public, max-age=${3600}, s-max-age=${3600}`,
		'Content-Type': 'text/xml'
	};
	const body = render(allRoutes);
	return new Response(body, { headers });
};

function render(routes: IRoute[]) {
	const xml = `<?xml version="1.0" encoding="UTF-8"?>
    <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
    	${routes
				.map(
					(route) =>
						`<url><loc>${canonicalUrl}${route.loc}</loc><lastmod>${route.lastmod}</lastmod><changefreq>${route.changefreq}</changefreq></url>`
				)
				.join('')}
    </urlset>`;
	return xml;
}

interface IRoute {
	loc: string;
	lastmod: string;
	changefreq: string;
}
