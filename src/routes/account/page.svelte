<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import IconLoading from '$components/icons/IconLoading.svelte';
	import MetaTag from '$components/MetaTag.svelte';
	import { canonicalUrl } from '$ts/constants/main';

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
		<div class="w-full flex flex-col items-center justify-center my-auto">Account</div>
	</div>
{/if}
