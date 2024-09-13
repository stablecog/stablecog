import { getSystemStatus, systemStatusQueryKey } from '$routes/(app)/admin/system/helpers.js';
import type { QueryClient } from '@tanstack/svelte-query';

interface TParent {
	queryClient: QueryClient;
	session: Session | null | undefined;
}

export const load = async ({ parent }) => {
	const { session, queryClient } = (await parent()) as TParent;
	if (!session) throw new Error('Unauthorized');
	await queryClient.prefetchQuery({
		queryKey: systemStatusQueryKey,
		queryFn: () => getSystemStatus(session.access_token)
	});
};
