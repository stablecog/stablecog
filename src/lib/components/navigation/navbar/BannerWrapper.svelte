<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import IconBolt from '$components/icons/IconBolt.svelte';
	import Banner from '$components/navigation/navbar/Banner.svelte';
	import { canonicalUrl } from '$ts/constants/main';
	import { lastClosedNotification } from '$ts/stores/lastClosedNotification';
	import { onMount } from 'svelte';

	export let canShow = true;

	const lastNotification = 'flux-1';
	const href = '/blog/the-best-open-source-ai-image-model-in-2024-flux-1';
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
			<IconBolt class="h-6 w-6 flex-shrink-0" />
			<p class="min-w-0 flex-shrink overflow-hidden overflow-ellipsis">FLUX.1 is now available!</p>
		</div>
	</Banner>
{/if}
