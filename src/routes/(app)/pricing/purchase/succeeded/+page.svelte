<script>
	import { page } from '$app/stores';
	import IconConfetti from '$components/icons/IconConfetti.svelte';
	import Button from '$components/primitives/buttons/Button.svelte';
	import ConfettiFullScreen from '$components/utils/ConfettiFullScreen.svelte';
	import MetaTag from '$components/utils/MetaTag.svelte';
	import PageWrapper from '$components/wrappers/PageWrapper.svelte';
	import LL from '$i18n/i18n-svelte';
	import { staticAssetBaseUrl } from '$ts/constants/main';
	import { previewImageVersion } from '$ts/constants/previewImageVersion';
	import { userSummary } from '$ts/stores/user/summary';
	import { onMount } from 'svelte';

	let mounted = false;
	onMount(async () => {
		mounted = true;
		if ($userSummary?.refetch) {
			await $userSummary.refetch();
		}
	});
</script>

<MetaTag
	title="Succeeded | Stablecog"
	description="See your generation history on Stablecog. Free, multilingual and open-source AI image generator using Stable Diffusion, FLUX, and Kandinsky."
	image_url="{staticAssetBaseUrl}/previews{$page.url.pathname}-{previewImageVersion}.png"
/>

<PageWrapper>
	<div class="my-auto flex w-full flex-col items-center justify-start">
		<IconConfetti class="h-24 w-24 text-c-primary" />
		<h1 class="mt-4 text-center text-4xl font-bold text-c-primary">
			{$LL.Pricing.Purchase.Succeeded.PageTitle()}
		</h1>
		<p class="mt-4 max-w-xl text-center leading-relaxed text-c-on-bg/75">
			{@html $LL.Pricing.Purchase.Succeeded.PageParagraph({ platform: '__discord__' }).replace(
				'__discord__',
				`<a class="text-c-primary font-bold hover:underline" href="/discord" target="_blank">Discord</a>`
			)}
		</p>
		<Button href="/generate" withSpinner class="mt-6">{$LL.Shared.StartGeneratingButton()}</Button>
	</div>
</PageWrapper>

{#if mounted}
	<ConfettiFullScreen />
{/if}
