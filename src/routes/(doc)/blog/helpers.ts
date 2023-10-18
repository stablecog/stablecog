import type { TPost, TPostCleaned, TPostCleanedMetadata } from '$routes/(doc)/blog/types';

export function cleanPost(post: TPost) {
	const metadataCleaned: TPostCleanedMetadata = {
		...post.metadata,
		tags: post.metadata.tags.split(',').map((tag) => tag.trim())
	};
	const { metadata, ...rest } = post;
	const cleanedPost: TPostCleaned = {
		...rest,
		metadata: metadataCleaned
	};
	return cleanedPost;
}
