import type { TPost, TPostMetadata } from '$routes/blog/types';
import { flatDocsSidebarShallow } from '$routes/docs/v1/constants';
import { flatGuideSidebarShallow } from '$routes/guide/constants';
import { flatTrySidebarShallow } from '$routes/try/constants';
import type { RequestHandler } from '@sveltejs/kit';

const today = new Date();
const getDateStringFromDate = (date: Date) => {
	const year = date.getFullYear();
	const month = date.getMonth() + 1;
	const day = date.getDate();
	return `${year}-${month >= 10 ? month : '0' + month}-${day >= 10 ? day : '0' + day}`;
};
const todayString = getDateStringFromDate(today);

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
	},
	{
		loc: '/gallery',
		lastmod: todayString,
		changefreq: 'daily'
	},
	{ loc: '/blog', lastmod: todayString, changefreq: 'daily' }
];

export const GET: RequestHandler = async () => {
	const blogPostsImport = import.meta.glob('/src/lib/md/blog/*.md');
	let blogPosts: TPostMetadata[] = [];
	for (const key of Object.keys(blogPostsImport)) {
		const post = (await blogPostsImport[key]()) as TPost;
		blogPosts.push(post.metadata);
	}
	const blogPostRoutes = blogPosts.map((post) => ({
		loc: `/blog/${post.slug}`,
		lastmod: getDateStringFromDate(new Date(post.date)),
		changefreq: 'weekly'
	}));
	const guideRoutes: IRoute[] = flatGuideSidebarShallow.map((item) => ({
		loc: `${item.pathname}`,
		lastmod: todayString,
		changefreq: 'weekly'
	}));
	const tryRoutes: IRoute[] = flatTrySidebarShallow.map((item) => ({
		loc: `${item.pathname}`,
		lastmod: todayString,
		changefreq: 'weekly'
	}));
	const docsRoutes: IRoute[] = flatDocsSidebarShallow.map((item) => ({
		loc: `${item.pathname}`,
		lastmod: todayString,
		changefreq: 'weekly'
	}));
	const allRoutes = [
		...definedRoutes,
		...blogPostRoutes,
		...guideRoutes,
		...tryRoutes,
		...docsRoutes
	];
	const headers = {
		'Cache-Control': `public, max-age=${3600}, s-max-age=${3600}`,
		'Content-Type': 'application/json'
	};
	return new Response(JSON.stringify(allRoutes), { headers });
};

interface IRoute {
	loc: string;
	lastmod: string;
	changefreq: string;
}
