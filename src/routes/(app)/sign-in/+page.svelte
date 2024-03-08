<script lang="ts">
	import { browser } from '$app/environment';
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import MetaTag from '$components/utils/MetaTag.svelte';
	import PageWrapper from '$components/wrappers/PageWrapper.svelte';
	import SignInCard from '$components/cards/SignInCard.svelte';
	import { canonicalUrl } from '$ts/constants/main';
	import { previewImageVersion } from '$ts/constants/previewImageVersion';
	import { sessionStore } from '$ts/constants/supabase';

	export let data;

	$: $sessionStore?.user.id, redirect();

	async function redirect() {
		if (!browser) return;
		if (!$sessionStore?.user.id) return;
		if (data.rd_to) {
			await goto(data.rd_to);
			return;
		}
		await goto('/');
	}
</script>

<MetaTag
	title="Sign In | Stablecog"
	description="Sign in to Stablecog. Create amazing art in seconds with AI. Free, multilingual and open-source AI image generator using Stable Diffusion and Kandinsky."
	image_url="{canonicalUrl}/previews{$page.url.pathname}-{previewImageVersion}.png"
/>

<PageWrapper>
	<div class="-mx-2 my-auto flex w-[100%+1rem] items-center justify-center">
		<SignInCard redirectTo={data.rd_to} />
	</div>
</PageWrapper>
