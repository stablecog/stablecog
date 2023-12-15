import {
	availableGenerationModelIds,
	type TAvailableGenerationModelId
} from '$ts/constants/generationModels';
import type { QueryClient } from '@tanstack/svelte-query';
import type { PageLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import { getOtherUserMetadata, type TOtherUserMetadata } from '$ts/queries/otherUserMetadata';
import type { Session } from '@supabase/supabase-js';
import {
	getSomeUserProfileInfiniteQueryKey,
	getSomeUserProfileInfiniteQueryProps
} from '$routes/(app)/[username]/constants';

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
	const searchQuery = url.searchParams.get('q');
	const modelIdQuery = url.searchParams.get('mi');
	const modelIds = modelIdQuery ? modelIdQuery.split(',') : [];
	const filteredModelIds = modelIds.filter((modelId) =>
		availableGenerationModelIds.includes(modelId as TAvailableGenerationModelId)
	);

	const hasInitialData =
		queryClient.getQueryData(
			getSomeUserProfileInfiniteQueryKey({
				searchString: searchQuery,
				modelIdFilters: filteredModelIds,
				username
			})
		) !== undefined;
	let userMetadata: TOtherUserMetadata;
	if (!hasInitialData) {
		const [_, userRes] = await Promise.all([
			queryClient.prefetchInfiniteQuery(
				getSomeUserProfileInfiniteQueryProps({
					searchString: searchQuery,
					modelIdFilters: filteredModelIds,
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
	if (username !== userMetadata.username) redirect(302, `/${userMetadata.username}`);
	return {
		searchQuery,
		modelIds: filteredModelIds,
		userMetadata,
		username: userMetadata.username
	};
};
