import { getGalleryLikeParamsFromSearchParams } from '$ts/helpers/galleryLike';
import { getOtherUserMetadata, type TOtherUserMetadata } from '$ts/queries/otherUserMetadata';
import { error, redirect } from '@sveltejs/kit';

export const load = async ({ url, params }) => {
	const outputId = url.searchParams.get('output');
	const outputIdShort = url.searchParams.get('o');
	const username = params.username;

	if (outputId) redirect(302, `/${username}/o/${outputId}`);
	if (outputIdShort) redirect(302, `/${username}/o/${outputIdShort}`);

	const galleryLikeParams = getGalleryLikeParamsFromSearchParams(url.searchParams);

	let userMetadata: TOtherUserMetadata;
	try {
		userMetadata = await getOtherUserMetadata({ username, custom_fetch: fetch });
	} catch (err) {
		error(404, 'Not found');
	}
	if (username !== userMetadata.username) redirect(302, `/${userMetadata.username}`);
	return {
		...galleryLikeParams,
		userMetadata,
		username: userMetadata.username
	};
};
