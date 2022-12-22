<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$components/buttons/Button.svelte';
	import IconLoading from '$components/icons/IconLoading.svelte';
	import MetaTag from '$components/MetaTag.svelte';
	import { canonicalUrl } from '$ts/constants/main';
	import type { PageServerData } from './$types';

	export let data: PageServerData;

	$: if (!$page.data.session?.user.id) {
		goto(`/login?redirect_to=${encodeURIComponent($page.url.pathname)}`);
	}
</script>

<MetaTag
	title="Account | Stablecog"
	description="Manage your Stablecog account."
	imageUrl="{canonicalUrl}/previews{$page.url.pathname}.png"
	canonical="{canonicalUrl}{$page.url.pathname}"
/>

{#if !$page.data.session?.user.id}
	<div class="w-full flex-1 flex flex-col py-8 px-5 justify-center items-center">
		<IconLoading class="w-10 h-10 text-c-on-bg/50 animate-spin-faster" />
	</div>
{:else}
	<div class="w-full flex-1 flex flex-col py-8 px-5">
		<div class="w-full flex flex-col items-center justify-center my-auto">
			<h1 class="text-4xl font-bold">Account</h1>
			{#if data.customerPortalSession}
				<div class="w-full mt-5 flex flex-wrap items-center justify-center">
					<Button href={data.customerPortalSession.url}>Manage Subscription</Button>
				</div>
			{/if}
		</div>
	</div>
{/if}
