<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import IconAnimatedSpinner from '$components/icons/IconAnimatedSpinner.svelte';
	import IconHourglass from '$components/icons/IconHourglass.svelte';
	import PageWrapper from '$components/PageWrapper.svelte';
	import LL, { locale } from '$i18n/i18n-svelte';
	import { logSignIn } from '$ts/helpers/loggers';
	import { advancedModeApp } from '$ts/stores/advancedMode';
	import { appVersion } from '$ts/stores/appVersion';
	import { userSummary } from '$ts/stores/user/summary';
	import { onMount } from 'svelte';

	export let data;

	$: if (mounted && $page.data.session?.user.id) redirect();

	let errorCode: number | null = null;

	async function redirect() {
		if (!browser) return;
		if (!$page.data.session?.user.id || !$page.data.session.user.email) return;
		logSignIn({
			'SC - Page': `${$page.url.pathname}${$page.url.search}`,
			'SC - Stripe Product Id': $userSummary?.product_id,
			'SC - Locale': $locale,
			'SC - Advanced Mode': $advancedModeApp,
			'SC - Email': $page.data.session?.user.email,
			'SC - App Version': $appVersion,
			'SC - User Id': $page.data.session?.user.id
		});
		setTimeout(async () => {
			if (data.redirect_to) {
				await goto(data.redirect_to);
				return;
			}
			await goto('/');
		}, 200);
	}

	let mounted = false;
	onMount(() => {
		mounted = true;
		if (window.location.hash.includes('error_code=401')) {
			errorCode = 401;
		}
	});
</script>

<PageWrapper>
	<div class="w-full flex flex-col items-center justify-center my-auto">
		{#if errorCode === 401 || data.error_code === 400 || data.error_code === 401}
			<IconHourglass class="w-28 h-28" />
			<p class="text-3xl font-bold mt-2">{$LL.Error.LinkExpired.Title()}</p>
			<p class="text-c-on-bg/60 mt-3 w-full max-w-xs leading-relaxed pb-[5vh]">
				{$LL.Error.LinkExpired.Paragraph()}
			</p>
		{:else}
			<IconAnimatedSpinner class="w-12 h-12 text-c-on-bg/60" />
		{/if}
	</div>
</PageWrapper>
