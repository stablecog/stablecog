<script lang="ts">
	import Banner from '$components/Banner.svelte';
	import IconBolt from '$components/icons/IconBolt.svelte';
	import { lastClosedNotification } from '$ts/stores/lastClosedNotification';
	import { onMount } from 'svelte';

	const lastNotification = 'announcing-our-public-api';

	let mounted = false;
	onMount(() => {
		mounted = true;
	});
</script>

{#if mounted && ($lastClosedNotification === null || $lastClosedNotification !== lastNotification)}
	<Banner
		href="/blog/announcing-our-public-api"
		onClose={() => {
			lastClosedNotification.set(lastNotification);
		}}
	>
		<div class="flex items-center justify-center gap-2">
			<IconBolt class="w-6 h-6 flex-shrink-0" />
			<p class="flex-shrink min-w-0 overflow-hidden overflow-ellipsis">
				Announcing our public API!
			</p>
		</div>
	</Banner>
{/if}
