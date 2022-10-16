<script lang="ts">
	import { page } from '$app/stores';
	import IconPulsing from '$components/icons/IconPulsing.svelte';
	import MetaTag from '$components/MetaTag.svelte';
	import { env as envPublic } from '$env/dynamic/public';
	import { canonicalUrl } from '$ts/constants/main';
	import { onMount } from 'svelte';

	onMount(() => {
		window.location.assign(envPublic.PUBLIC_DISCORD_INVITE_URL);
	});
</script>

<MetaTag
	title="Discord | Stablecog"
	description="Join our Discord server to get updates on Stablecog, share your generations, and more!"
	imageUrl="{canonicalUrl}/previews{$page.url.pathname}.png"
	canonical="{canonicalUrl}{$page.url.pathname}"
/>

<div class="w-full flex-1 flex justify-center px-8 md:px-24 pt-8 pb-[calc(7vh+2rem)]">
	<div class="w-full flex flex-col items-center justify-center max-w-lg">
		<div class="w-full flex flex-col items-center justify-start py-4">
			<IconPulsing />
			<p class="w-full text-c-on-bg/40 text-center mt-1.5">Redirecting to Discord</p>
		</div>
	</div>
</div>
