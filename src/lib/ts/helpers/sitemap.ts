import { flatDocsSidebarShallow } from '$docroutes/docs/v1/constants';
import { flatGuideSidebarShallow } from '$docroutes/guide/constants';
import { flatTrySidebarShallow } from '$docroutes/try/constants';
import type { TPost, TPostMetadata } from '$routes/(doc)/blog/types';

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
		loc: '/generate',
		lastmod: todayString,
		changefreq: 'daily'
	},
	{
		loc: '/voiceover/generate',
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
	{ loc: '/blog', lastmod: todayString, changefreq: 'daily' },
	{ loc: '/docs', lastmod: todayString, changefreq: 'daily' }
];

export const getAllRoutes = async () => {
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
	return allRoutes;
};

export interface IRoute {
	loc: string;
	lastmod: string;
	changefreq: string;
}
