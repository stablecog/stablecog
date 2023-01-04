<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import IconLoadingSlim from '$components/icons/IconLoadingSlim.svelte';
	import PageWrapper from '$components/PageWrapper.svelte';
	import { locale } from '$i18n/i18n-svelte';
	import { mLogSignIn } from '$ts/helpers/loggers';
	import { advancedModeApp } from '$ts/stores/advancedMode';
	import type { PageServerData } from './$types';

	export let data: PageServerData;

	$: $page.data.session, redirect();

	async function redirect() {
		if (!browser) return;
		if (!$page.data.session?.user.id) return;
		mLogSignIn({
			'SC - Page': `${$page.url.pathname}${$page.url.search}`,
			'SC - Plan': $page.data.plan,
			'SC - Locale': $locale,
			'SC - Advanced Mode': $advancedModeApp
		});
		setTimeout(async () => {
			if (data.redirect_to) {
				await goto(data.redirect_to);
				return;
			}
			if ($page.data.plan === 'FREE') {
				await goto('/pro');
				return;
			}
			await goto('/');
		}, 200);
	}
</script>

<PageWrapper>
	<div class="w-full flex flex-col items-center justify-center my-auto">
		<IconLoadingSlim class="animate-spin-faster w-16 h-16" />
	</div>
</PageWrapper>
