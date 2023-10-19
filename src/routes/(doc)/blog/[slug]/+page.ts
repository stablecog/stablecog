import { cleanPost } from '$routes/(doc)/blog/helpers';
import type { TPost, TPostCleaned, TPostCleanedMetadata } from '$routes/(doc)/blog/types';
import type { Load } from '@sveltejs/kit';

const getPath = (slug: string | undefined) => `/src/lib/md/blog/${slug}.md`;
const similarPostCount = 4;

export const load: Load = async ({ params }) => {
	const { slug } = params;
	const postImports = import.meta.glob(`/src/lib/md/blog/*md`);
	let otherPosts: Record<string, TPostCleaned> = {};
	for (const path in postImports) {
		if (path === getPath(slug)) continue;
		const post = (await postImports[path]()) as TPost;
		otherPosts[path] = cleanPost(post);
	}
	const post = (await postImports[getPath(slug)]()) as TPost;
	const post_cleaned = cleanPost(post);
	const metadata = post_cleaned.metadata;
	const orderedOtherPosts = orderPostsBySimilarity(post_cleaned, Object.values(otherPosts));
	const similarPosts = orderedOtherPosts.slice(0, similarPostCount).map((post) => post.metadata);
	return {
		metadata,
		Content: post_cleaned.default,
		similarPosts
	};
};

function jaccardSimilarity(setA: Set<string>, setB: Set<string>): number {
	const intersection = new Set([...setA].filter((x) => setB.has(x)));
	const union = new Set([...setA, ...setB]);
	return intersection.size / union.size;
}

function orderPostsBySimilarity(
	mainPost: TPostCleaned,
	otherPosts: TPostCleaned[]
): TPostCleaned[] {
	const mainSet = new Set(mainPost.metadata.tags);

	// Calculate the Jaccard similarity for each post and store with its index.
	const similarities = otherPosts.map((post, index) => {
		return {
			index: index,
			similarity: jaccardSimilarity(mainSet, new Set(post.metadata.tags))
		};
	});

	// Sort by similarity in descending order.
	const sortedIndices = similarities
		.sort((a, b) => b.similarity - a.similarity)
		.map((s) => s.index);

	// Rearrange the posts based on sorted indices.
	return sortedIndices.map((index) => otherPosts[index]);
}
