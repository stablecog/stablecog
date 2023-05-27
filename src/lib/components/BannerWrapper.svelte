<script lang="ts">
	import Banner from '$components/Banner.svelte';
	import IconBolt from '$components/icons/IconBolt.svelte';
	import { lastClosedNotification } from '$ts/stores/lastClosedNotification';
	import { onMount } from 'svelte/types/runtime/internal/lifecycle';

	const lastNotification = 'meet-our-new-interface';

	let mounted = false;
	onMount(() => {
		mounted = true;
	});
</script>

{#if mounted && ($lastClosedNotification === null || $lastClosedNotification !== lastNotification)}
	<Banner
		href="/blog/meet-our-new-interface"
		onClose={() => {
			lastClosedNotification.set(lastNotification);
		}}
	>
		<div class="flex items-center justify-center gap-2">
			<IconBolt class="w-6 h-6 flex-shrink-0" />
			<p class="flex-shrink min-w-0 overflow-hidden overflow-ellipsis">Meet Our New Interface!</p>
		</div>
	</Banner>
{/if}
