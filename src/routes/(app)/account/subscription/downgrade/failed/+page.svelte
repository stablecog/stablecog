<script>
	import { page } from '$app/stores';
	import IconSadFace from '$components/icons/IconSadFace.svelte';
	import Button from '$components/primitives/buttons/Button.svelte';
	import MetaTag from '$components/utils/MetaTag.svelte';
	import PageWrapper from '$components/wrappers/PageWrapper.svelte';
	import LL from '$i18n/i18n-svelte';
	import { staticAssetBaseUrl } from '$ts/constants/main';
	import { previewImageVersion } from '$ts/constants/previewImageVersion';
</script>

<MetaTag
	title="Change Plan | Stablecog"
	description="Change your Stablecog subscription plan. Free, multilingual and open-source AI image generator using Stable Diffusion, FLUX, and Kandinsky."
	image_url="{staticAssetBaseUrl}/previews/home-{previewImageVersion}.png"
/>

<PageWrapper>
	<div class="my-auto flex w-full flex-col items-center justify-start">
		<IconSadFace class="h-24 w-24 text-c-primary" />
		<h1 class="mt-4 text-center text-4xl font-bold text-c-primary">
			{$LL.Account.Subscription.Failed.PageTitle()}
		</h1>
		<p class="mt-4 max-w-xl text-center leading-relaxed text-c-on-bg/75">
			{$LL.Account.Subscription.Failed.PageParagraph()}
		</p>
		<Button href="/pricing" withSpinner class="mt-6">{$LL.Shared.TryAgainButton()}</Button>
	</div>
</PageWrapper>
