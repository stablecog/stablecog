import { browser } from '$app/environment';
import type { ServerLoad } from '@sveltejs/kit';
import { QueryClient } from '@tanstack/svelte-query';

export const load: ServerLoad = async ({}) => {
	const queryClient = new QueryClient({
		defaultOptions: {
			queries: {
				staleTime: 5 * 1000,
				enabled: browser
			}
		}
	});
	return { queryClient };
};
