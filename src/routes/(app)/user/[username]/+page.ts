import {
	availableGenerationModelIds,
	type TAvailableGenerationModelId
} from '$ts/constants/generationModels';
import type { QueryClient } from '@tanstack/svelte-query';
import type { PageLoad } from './$types';
import { redirect } from '@sveltejs/kit';
import {
	getOtherUserProfileInfiniteQueryKey,
	getOtherUserProfileInfiniteQueryProps
} from '$routes/(app)/user/[username]/constants';
import { getOtherUserMetadata, type TOtherUserMetadata } from '$ts/queries/otherUserMetadata';

interface TParent {
	queryClient: QueryClient;
	globalSeed: number;
}

export const load: PageLoad = async ({ url, parent, params }) => {
	const outputId = url.searchParams.get('output');
	const username = params.username;

	if (outputId) throw redirect(302, `/gallery/o/${outputId}`);
	const outputIdShort = url.searchParams.get('o');
	if (outputIdShort) throw redirect(302, `/gallery/o/${outputIdShort}`);

	const { queryClient, globalSeed } = (await parent()) as TParent;
	const searchQuery = url.searchParams.get('q');
	const modelIdQuery = url.searchParams.get('mi');
	const modelIds = modelIdQuery ? modelIdQuery.split(',') : [];
	const filteredModelIds = modelIds.filter((modelId) =>
		availableGenerationModelIds.includes(modelId as TAvailableGenerationModelId)
	);

	const hasInitialData =
		queryClient.getQueryData(
			getOtherUserProfileInfiniteQueryKey({
				searchString: searchQuery,
				modelIdFilters: filteredModelIds,
				seed: globalSeed,
				username
			})
		) !== undefined;
	let userMetadata: TOtherUserMetadata;
	if (!hasInitialData) {
		const [_, userRes] = await Promise.all([
			queryClient.prefetchInfiniteQuery(
				getOtherUserProfileInfiniteQueryProps({
					searchString: searchQuery,
					modelIdFilters: filteredModelIds,
					seed: globalSeed,
					username
				})
			),
			getOtherUserMetadata({ username, custom_fetch: fetch })
		]);
		userMetadata = userRes;
	} else {
		userMetadata = await getOtherUserMetadata({ username, custom_fetch: fetch });
	}

	return {
		searchQuery,
		modelIds: filteredModelIds,
		userMetadata,
		username
	};
};
