<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { getUserSummary } from '$ts/helpers/user/user';
	import { userSummary } from '$ts/stores/user/summary';
	import { createQuery } from '@tanstack/svelte-query';

	$: userSummaryQuery =
		browser && $page.data.session?.user.id
			? createQuery(['user_summary', $page.data.session.user.id], {
					queryFn: () => getUserSummary($page.data.session?.access_token)
			  })
			: undefined;

	$: userSummary.set(browser ? $userSummaryQuery?.data : $userSummary);
</script>

<slot />
