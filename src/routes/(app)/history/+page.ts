import type { QueryClient } from '@tanstack/svelte-query';
import type { PageLoad } from '../gallery/$types';
import type { Session } from '@supabase/supabase-js';
import type { TUserSummary } from '$ts/stores/user/summary';
import {
	getHistoryInfiniteQueryKey,
	getHistoryInfiniteQueryProps
} from '$routes/(app)/history/constants';
import { TUserGalleryViewSchema } from '$ts/stores/user/gallery';

interface TParent {
	queryClient: QueryClient;
	session: Session | null | undefined;
	userSummary: TUserSummary | null | undefined;
}
export const load: PageLoad = async ({ parent, url }) => {
	const { queryClient, session, userSummary } = (await parent()) as TParent;
	const viewParam = url.searchParams.get('view');
	const view = TUserGalleryViewSchema.safeParse(viewParam).success
		? TUserGalleryViewSchema.parse(viewParam)
		: 'all';
	const modelIdFiltersParam = url.searchParams.get('mi');
	const modelIdFilters = modelIdFiltersParam ? modelIdFiltersParam.split(',') : [];
	const searchStringParam = url.searchParams.get('q');
	const searchString = searchStringParam || '';
	const sharedQueryParams = {
		userGalleryCurrentView: view,
		modelIdFilters,
		searchString
	};
	const hasInitialData =
		queryClient.getQueryData(getHistoryInfiniteQueryKey({ ...sharedQueryParams })) !== undefined;
	if (session && userSummary && !hasInitialData) {
		try {
			await queryClient.prefetchInfiniteQuery(
				getHistoryInfiniteQueryProps({
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
