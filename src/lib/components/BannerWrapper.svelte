<script lang="ts">
	import { afterNavigate } from '$app/navigation';
	import { page } from '$app/stores';
	import Banner from '$components/Banner.svelte';
	import IconBolt from '$components/icons/IconBolt.svelte';
	import { lastClosedNotification } from '$ts/stores/lastClosedNotification';
	import { onMount } from 'svelte';

	const lastNotification = 'kandinsky-2-2-announcement';
	const href = '/blog/kandinsky-2-2-the-best-open-source-ai-image-model';

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

{#if mounted && ($lastClosedNotification === null || $lastClosedNotification !== lastNotification) && $page.url.pathname !== href}
	<Banner
		{href}
		onClose={() => {
			lastClosedNotification.set(lastNotification);
		}}
	>
		<div class="flex items-center justify-center gap-2">
			<IconBolt class="w-6 h-6 flex-shrink-0" />
			<p class="flex-shrink min-w-0 overflow-hidden overflow-ellipsis">We have a new AI model!</p>
		</div>
	</Banner>
{/if}
