import type { TPost } from '$routes/blog/types';
import type { Load } from '@sveltejs/kit';

const getPath = (slug: string | undefined) => `/src/lib/md/blog/${slug}.md`;

export const load: Load = async ({ params }) => {
	const { slug } = params;
	const posts = import.meta.glob(`/src/lib/md/blog/*md`);
	const post = (await posts[getPath(slug)]()) as TPost;
	const metadata = post.metadata;
	return {
		metadata,
		Content: post.default
	};
};
