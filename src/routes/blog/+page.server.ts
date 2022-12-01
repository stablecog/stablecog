import { getBlogPosts } from '$ts/queries/blog/getBlogPosts';
import type { ServerLoad } from '@sveltejs/kit';

export const prerender = true;
export const load: ServerLoad = async ({}) => {
	const posts = await getBlogPosts();
	return {
		posts
	};
};
