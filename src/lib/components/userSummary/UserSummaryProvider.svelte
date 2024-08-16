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
	import { sessionStore } from '$ts/constants/supabase';

	export let queryClient: QueryClient;

	let mounted = false;

	$: userId = $sessionStore?.user.id;
	$: userEmail = $sessionStore?.user.email;
	$: accessToken = $sessionStore?.access_token;

	$: userSummaryQuery =
		browser && userId
			? createQuery({
					queryKey: getUserSummaryQueryKey(userId),
					queryFn: () => getUserSummary(accessToken)
				})
			: undefined;

	$: isSuccess = $userSummaryQuery?.isSuccess;
	$: isError = $userSummaryQuery?.isError;
	$: data = $userSummaryQuery?.data;

	$: [isSuccess, isError, data], setUserSummary();

	function setUserSummary() {
		if (browser && $userSummaryQuery && $userSummaryQuery.isSuccess && $userSummaryQuery.data) {
			userSummary.set({ ...$userSummaryQuery.data, refetch: $userSummaryQuery.refetch });
		} else if (browser && $userSummaryQuery && $userSummaryQuery.isError) {
			userSummary.set(null);
		}
	}

	$: logProps = {
		'SC - User Id': userId,
		'SC - Stripe Product Id': $userSummary?.product_id,
		'SC - Locale': $locale,
		'SC - Page': `${$page.url.pathname}${$page.url.search}`,
		'SC - App Version': $appVersion,
		'SC - Email': userEmail
	};
	$: wantsEmailQueryKey = ['set_wants_email', userId];
	$: wantsEmailMutation = browser
		? createMutation({
				mutationKey: wantsEmailQueryKey,
				mutationFn: ({ wantsEmail }: { wantsEmail: boolean }) => {
					queryClient.cancelQueries({ queryKey: wantsEmailQueryKey });
					return setWantsEmail({
						access_token: accessToken || '',
						wants_email: wantsEmail
					});
				},
				onSuccess: () => {
					queryClient.invalidateQueries({ queryKey: getUserSummaryQueryKey(userId) });
				}
			})
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
