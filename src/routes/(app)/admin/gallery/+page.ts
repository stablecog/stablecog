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
	const modelIdFiltersParam = url.searchParams.get('mi');
	const modelIdFilters = modelIdFiltersParam ? modelIdFiltersParam.split(',') : [];
	const searchStringParam = url.searchParams.get('q');
	const searchString = searchStringParam || '';
	const sharedQueryParams = {
		adminGalleryCurrentFilter: view,
		modelIdFilters,
		searchString
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
		view,
		modelIdFilters,
		searchString
	};
};
