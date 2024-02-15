import type { QueryClient } from '@tanstack/svelte-query';
import type { Session } from '@supabase/supabase-js';
import type { TUserSummary } from '$ts/stores/user/summary';
import type { PageLoad } from './$types';
import { isSuperAdmin } from '$ts/helpers/admin/roles';
import {
	getAllUserGenerationFullOutputsQueryKey,
	getAllUserGenerationFullOutputsQueryProps
} from '$routes/(app)/admin/gallery/constants';
import { TGalleryStatusSchema } from '$ts/stores/user/generation';
import { adminGalleryCurrentFilterDefault } from '$ts/stores/admin/gallery';
import { getGalleryLikeParamsFromSearchParams } from '$ts/helpers/galleryLike';

interface TParent {
	queryClient: QueryClient;
	session: Session | null | undefined;
	userSummary: TUserSummary | null | undefined;
}

export const load: PageLoad = async ({ parent, url }) => {
	const { queryClient, session, userSummary } = (await parent()) as TParent;
	const viewParam = url.searchParams.get('view');
	const view = TGalleryStatusSchema.safeParse(viewParam).success
		? TGalleryStatusSchema.parse(viewParam)
		: adminGalleryCurrentFilterDefault;
	const usernameFiltersQuery = url.searchParams.get('un');
	const usernameFilters = usernameFiltersQuery?.split(',') || [];
	const galleryLikeParams = getGalleryLikeParamsFromSearchParams(url.searchParams);
	const sharedQueryParams = {
		...galleryLikeParams,
		usernameFilters,
		adminGalleryCurrentFilter: view
	};
	const hasInitialData =
		queryClient.getQueryData(
			getAllUserGenerationFullOutputsQueryKey({
				...sharedQueryParams
			})
		) !== undefined;
	if (session && userSummary && !hasInitialData && isSuperAdmin(userSummary.roles)) {
		try {
			await queryClient.prefetchInfiniteQuery(
				getAllUserGenerationFullOutputsQueryProps({
					...sharedQueryParams,
					session
				})
			);
		} catch (error) {
			console.log(error);
		}
	}
	return {
		...galleryLikeParams,
		usernameFilters,
		view
	};
};
