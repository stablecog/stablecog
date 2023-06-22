<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import Banner from '$components/Banner.svelte';
	import IconMicrophoneFilled from '$components/icons/IconMicrophoneFilled.svelte';
	import { lastClosedNotification } from '$ts/stores/lastClosedNotification';
	import { onMount } from 'svelte';

	const lastNotification = 'create-voiceovers-with-ai';

	let mounted = false;
	onMount(() => {
		mounted = true;
	});

	afterNavigate(() => {
		if ($page.url.pathname === href) {
			lastClosedNotification.set(lastNotification);
		}
	});

	const href = '/blog/create-voiceovers-with-ai';
</script>

{#if mounted && ($lastClosedNotification === null || $lastClosedNotification !== lastNotification) && $page.url.pathname !== href}
	<Banner
		{href}
		onClose={() => {
			lastClosedNotification.set(lastNotification);
		}}
	>
		<div class="flex items-center justify-center gap-2">
			<IconMicrophoneFilled class="w-6 h-6 flex-shrink-0" />
			<p class="flex-shrink min-w-0 overflow-hidden overflow-ellipsis">
				Our Voiceover Feature is Here!
			</p>
		</div>
	</Banner>
{/if}
