import type { Load } from '@sveltejs/kit';
import type { TPost, TPostCleanedMetadata } from '$routes/(doc)/blog/types';
import { cleanPost } from '$routes/(doc)/blog/helpers';

export const load: Load = async () => {
	const blogPostsImport = import.meta.glob('/src/lib/md/blog/*.md');
	let posts: TPostCleanedMetadata[] = [];
	for (const key of Object.keys(blogPostsImport)) {
		const post = (await blogPostsImport[key]()) as TPost;
		posts.push(cleanPost(post).metadata);
	}
	const postsOrdered = posts.sort((a, b) => {
		return new Date(b.date).getTime() - new Date(a.date).getTime();
	});
	return {
		posts: postsOrdered
	};
};
