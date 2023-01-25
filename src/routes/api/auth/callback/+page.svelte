<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$components/buttons/Button.svelte';
	import IconHourglass from '$components/icons/IconHourglass.svelte';
	import IconLoadingSlim from '$components/icons/IconLoadingSlim.svelte';
	import PageWrapper from '$components/PageWrapper.svelte';
	import LL, { locale } from '$i18n/i18n-svelte';
	import { expandCollapse } from '$ts/animation/transitions';
	import { mLogSignIn } from '$ts/helpers/loggers';
	import { advancedModeApp } from '$ts/stores/advancedMode';
	import { onMount } from 'svelte';
	import { quadOut } from 'svelte/easing';
	import type { PageServerData } from './$types';

	export let data: PageServerData;

	$: if (mounted && $page.data.session?.user.id) redirect();

	async function redirect() {
		if (!browser) return;
		if (!$page.data.session?.user.id || !$page.data.session.user.email) return;
		mLogSignIn({
			'SC - Page': `${$page.url.pathname}${$page.url.search}`,
			'SC - Plan': $page.data.plan,
			'SC - Locale': $locale,
			'SC - Advanced Mode': $advancedModeApp,
			'SC - Email': $page.data.session?.user.email
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

	let mounted = false;
	onMount(() => {
		mounted = true;
	});
</script>

<PageWrapper>
	<div class="w-full flex flex-col items-center justify-center my-auto">
		{#if data.error_code === 401}
			<IconHourglass class="w-28 h-28" />
			<p class="text-3xl font-bold mt-2">{$LL.Error.LinkExpired.Title()}</p>
			<p class="text-c-on-bg/60 mt-3 w-full max-w-xs leading-relaxed pb-[5vh]">
				{$LL.Error.LinkExpired.Paragraph()}
			</p>
		{:else}
			<IconLoadingSlim class="animate-spin-faster w-16 h-16" />
		{/if}
	</div>
</PageWrapper>
