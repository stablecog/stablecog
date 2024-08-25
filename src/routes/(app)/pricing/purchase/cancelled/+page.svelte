<script>
	import { page } from '$app/stores';
	import IconSadFace from '$components/icons/IconSadFace.svelte';
	import Button from '$components/primitives/buttons/Button.svelte';
	import MetaTag from '$components/utils/MetaTag.svelte';
	import PageWrapper from '$components/wrappers/PageWrapper.svelte';
	import LL from '$i18n/i18n-svelte';
	import { auxBucketStaticUrl } from '$ts/constants/main';
	import { previewImageVersion } from '$ts/constants/previewImageVersion';
</script>

<MetaTag
	title="Cancelled | Stablecog"
	description="Choose a plan that works for you and start using Stablecog. Free, multilingual and open-source AI image generator using Stable Diffusion, FLUX, and Kandinsky."
	image_url="{auxBucketStaticUrl}/previews{$page.url.pathname}-{previewImageVersion}.png"
/>

<PageWrapper>
	<div class="my-auto flex w-full flex-col items-center justify-start">
		<IconSadFace class="h-24 w-24 text-c-primary" />
		<h1 class="mt-4 text-center text-4xl font-bold text-c-primary">
			{$LL.Pricing.Purchase.Cancelled.PageTitle()}
		</h1>
		<p class="mt-4 max-w-xl text-center leading-relaxed text-c-on-bg/75">
			{$LL.Pricing.Purchase.Cancelled.PageParagraph()}
		</p>
		<Button href="/pricing" withSpinner class=" mt-6">{$LL.Shared.TryAgainButton()}</Button>
	</div>
</PageWrapper>
