import type { QueryClient } from '@tanstack/svelte-query';
import type { PageLoad } from '../gallery/$types';
import type { Session } from '@supabase/supabase-js';
import type { TUserSummary } from '$ts/stores/user/summary';
import {
	getHistoryInfiniteQueryKey,
	getHistoryInfiniteQueryProps
} from '$routes/(app)/history/constants';

interface TParent {
	queryClient: QueryClient;
	session: Session | null | undefined;
	userSummary: TUserSummary | null | undefined;
}
export const load: PageLoad = async ({ parent }) => {
	const { queryClient, session, userSummary } = (await parent()) as TParent;
	const hasInitialData =
		queryClient.getQueryData(getHistoryInfiniteQueryKey({ userGalleryCurrentView: 'all' })) !==
		undefined;
	if (session && userSummary && !hasInitialData) {
		try {
			await queryClient.prefetchInfiniteQuery(
				getHistoryInfiniteQueryProps({ userGalleryCurrentView: 'all', session })
			);
		} catch (error) {
			console.log(error);
		}
	}
};
