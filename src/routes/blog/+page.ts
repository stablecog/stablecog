import type { Load } from '@sveltejs/kit';
import type { TPostMetadata, TPost } from '$routes/blog/types';

export const load: Load = async () => {
	const blogPostsImport = import.meta.glob('/src/lib/md/blog/*.md');
	let posts: TPostMetadata[] = [];
	for (const key of Object.keys(blogPostsImport)) {
		const post = (await blogPostsImport[key]()) as TPost;
		posts.push(post.metadata);
	}
	const postsOrdered = posts.sort((a, b) => {
		return new Date(b.date).getTime() - new Date(a.date).getTime();
	});
	return {
		posts: postsOrdered
	};
};
