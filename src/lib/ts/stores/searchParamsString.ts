import { page } from '$app/stores';
import { derived } from 'svelte/store';

export const searchParamsString = derived([page], ([$page]) => {
	return $page.url.searchParams.toString() === '' ? '' : '?' + $page.url.searchParams.toString();
});
