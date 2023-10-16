<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import Banner from '$components/navigation/navbar/Banner.svelte';
	import { lastClosedNotification } from '$ts/stores/lastClosedNotification';
	import { onMount } from 'svelte';
	import IconCart from '$components/icons/IconCart.svelte';
	import LL from '$i18n/i18n-svelte';

	export let canShow = true;

	const lastNotification = 'first-month-50-off';
	const href = '/pricing';

	let mounted = false;

	onMount(() => {
		mounted = true;
	});

	afterNavigate(() => {
		if ($page.url.pathname === href) {
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
			<IconCart class="w-6 h-6 flex-shrink-0" />
			<p class="flex-shrink min-w-0 overflow-hidden overflow-ellipsis">
				{$LL.Pricing.Discounts.FirstPurchase50OffParagraph()}
			</p>
		</div>
	</Banner>
{/if}
