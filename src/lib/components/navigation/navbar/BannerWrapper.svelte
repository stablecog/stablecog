<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import Banner from '$components/navigation/navbar/Banner.svelte';
	import { lastClosedNotification } from '$ts/stores/lastClosedNotification';
	import { onMount } from 'svelte';
	import IconCart from '$components/icons/IconCart.svelte';
	import LL from '$i18n/i18n-svelte';
	import { canonicalUrl } from '$ts/constants/main';

	export let canShow = true;

	const lastNotification = 'first-month-30-off';
	const href = '/pricing#plan-starter';
	const pathname = new URL(canonicalUrl + href).pathname;

	let mounted = false;

	onMount(() => {
		mounted = true;
	});

	afterNavigate(() => {
		if ($page.url.pathname === pathname) {
			lastClosedNotification.set(lastNotification);
		}
	});
</script>

{#if mounted && canShow && ($lastClosedNotification === null || $lastClosedNotification !== lastNotification) && $page.url.pathname !== href}
	<Banner
		{href}
		target="_self"
		onClose={() => {
			lastClosedNotification.set(lastNotification);
		}}
	>
		<div class="flex items-center justify-center gap-2">
			<IconCart class="h-6 w-6 flex-shrink-0" />
			<p class="min-w-0 flex-shrink overflow-hidden overflow-ellipsis">
				{$LL.Pricing.Discounts.FirstMonth30OffParagraph()}
			</p>
		</div>
	</Banner>
{/if}
