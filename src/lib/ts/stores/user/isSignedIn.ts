import { page } from '$app/stores';
import { userSummary } from '$ts/stores/user/summary';
import { derived } from 'svelte/store';

export const isSignedIn = derived([userSummary, page], ([$userSummary, $page]) => {
	return $page.data.session?.access_token !== undefined && $userSummary !== undefined;
});
