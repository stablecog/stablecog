import type { TBlogPost, TToC } from '$ts/types/main';

export async function getBlogPosts() {
	const blogPostsImport = import.meta.glob('$md/*.md');
	let blogPosts: TBlogPost[] = [];
	for (const key of Object.keys(blogPostsImport)) {
		const res: any = await blogPostsImport[key]();
		const toc: TToC = res.attributes;
		blogPosts.push({
			...toc,
			slug: key.split('/md/')[1].split('.md')[0]
		});
	}
	const blogPostsOrdered = blogPosts.sort((a, b) => {
		return new Date(b.date).getTime() - new Date(a.date).getTime();
	});
	return blogPostsOrdered;
}
