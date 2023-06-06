<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import { getUserSummaryQueryKey } from '$components/userSummary/helpers';
	import { locale } from '$i18n/i18n-svelte';
	import { logWantsEmail } from '$ts/helpers/loggers';
	import { getUserSummary } from '$ts/helpers/user/user';
	import { setWantsEmail } from '$ts/queries/wantsEmail';
	import { appVersion } from '$ts/stores/appVersion';
	import { userSummary } from '$ts/stores/user/summary';
	import { wantsEmail } from '$ts/stores/user/wantsEmail';
	import { QueryClient, createMutation, createQuery } from '@tanstack/svelte-query';
	import { onMount } from 'svelte';

	export let queryClient: QueryClient;

	let mounted = false;

	$: userSummaryQuery =
		browser && $page.data.session?.user.id
			? createQuery(getUserSummaryQueryKey($page.data.session?.user.id), {
					queryFn: () => getUserSummary($page.data.session?.access_token)
			  })
			: undefined;

	$: [$userSummaryQuery], setUserSummary();

	function setUserSummary() {
		if (browser && $userSummaryQuery && $userSummaryQuery.isSuccess && $userSummaryQuery.data) {
			userSummary.set($userSummaryQuery.data);
		}
	}

	$: logProps = {
		'SC - User Id': $page.data.session?.user.id,
		'SC - Stripe Product Id': $userSummary?.product_id,
		'SC - Locale': $locale,
		'SC - Page': `${$page.url.pathname}${$page.url.search}`,
		'SC - App Version': $appVersion,
		'SC - Email': $page.data.session?.user.email
	};
	$: wantsEmailQueryKey = ['set_wants_email', $page.data.session?.user.id];
	$: wantsEmailMutation = browser
		? createMutation(
				wantsEmailQueryKey,
				({ wantsEmail }: { wantsEmail: boolean }) => {
					queryClient.cancelQueries(wantsEmailQueryKey);
					return setWantsEmail({
						access_token: $page.data.session?.access_token || '',
						wants_email: wantsEmail
					});
				},
				{
					onSuccess: () => {
						queryClient.invalidateQueries(getUserSummaryQueryKey($page.data.session?.user.id));
					}
				}
		  )
		: undefined;
	$: [$userSummary, $wantsEmail, $page], setWantsEmailIfNeeded();

	function setWantsEmailIfNeeded() {
		if (!mounted) return;
		if (!$userSummary) return;
		if (!$wantsEmailMutation) return;
		if ($wantsEmail === null) return;
		if ($wantsEmail === $userSummary.wants_email) return;
		if ($page.url.pathname.startsWith('/api')) return;
		$wantsEmailMutation.mutate({ wantsEmail: $wantsEmail });
		logWantsEmail({ ...logProps, wantsEmail: $wantsEmail });
	}

	onMount(() => {
		if ($userSummary?.wants_email !== undefined && $wantsEmail === null) {
			wantsEmail.set($userSummary.wants_email);
		}
		mounted = true;
	});
</script>

<slot />
