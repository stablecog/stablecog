import {
	getUserProfileInfiniteQueryKey,
	getUserProfileProfileInfiniteQueryProps
} from '$routes/(app)/[username]/constants';
import { getGalleryLikeParamsFromSearchParams } from '$ts/helpers/galleryLike';
import { getOtherUserMetadata, type TOtherUserMetadata } from '$ts/queries/otherUserMetadata';
import type { Session } from '@supabase/supabase-js';
import { error, redirect } from '@sveltejs/kit';
import type { QueryClient } from '@tanstack/svelte-query';
import type { PageLoad } from './$types';

interface TParent {
	queryClient: QueryClient;
	globalSeed: number;
	session: Session | undefined | null;
}

export const load: PageLoad = async ({ url, parent, params }) => {
	const outputId = url.searchParams.get('output');
	const outputIdShort = url.searchParams.get('o');
	const username = params.username;

	if (outputId) redirect(302, `/${username}/o/${outputId}`);
	if (outputIdShort) redirect(302, `/${username}/o/${outputIdShort}`);

	const { queryClient, session } = (await parent()) as TParent;
	const galleryLikeParams = getGalleryLikeParamsFromSearchParams(url.searchParams);

	const hasInitialData =
		queryClient.getQueryData(
			getUserProfileInfiniteQueryKey({
				...galleryLikeParams,
				username
			})
		) !== undefined;
	let userMetadata: TOtherUserMetadata;
	try {
		if (!hasInitialData) {
			const [_, userRes] = await Promise.all([
				queryClient.prefetchInfiniteQuery(
					getUserProfileProfileInfiniteQueryProps({
						...galleryLikeParams,
						username,
						accessToken: session?.access_token
					})
				),
				getOtherUserMetadata({ username, custom_fetch: fetch })
			]);
			userMetadata = userRes;
		} else {
			userMetadata = await getOtherUserMetadata({ username, custom_fetch: fetch });
		}
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
