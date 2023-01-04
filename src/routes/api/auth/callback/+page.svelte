<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import IconLoadingSlim from '$components/icons/IconLoadingSlim.svelte';
	import PageWrapper from '$components/PageWrapper.svelte';
	import type { PageServerData } from './$types';

	export let data: PageServerData;

	$: $page.data.plan, redirect();

	async function redirect() {
		if (!browser) return;
		if (data.redirect_to) {
			await goto(data.redirect_to);
			console.log('redirect to', data.redirect_to);
			return;
		}
		if ($page.data.plan === 'FREE') {
			await goto('/pro');
			return;
		}
		await goto('/');
	}
</script>

<PageWrapper>
	<div class="w-full flex flex-col items-center justify-center my-auto">
		<IconLoadingSlim class="animate-spin-faster w-16 h-16" />
	</div>
</PageWrapper>
