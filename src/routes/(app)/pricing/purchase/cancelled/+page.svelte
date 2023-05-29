<script>
	import { page } from '$app/stores';
	import Button from '$components/buttons/Button.svelte';
	import IconSadFace from '$components/icons/IconSadFace.svelte';
	import MetaTag from '$components/MetaTag.svelte';
	import PageWrapper from '$components/PageWrapper.svelte';
	import LL from '$i18n/i18n-svelte';
	import { canonicalUrl } from '$ts/constants/main';
	import { previewImageVersion } from '$ts/constants/previewImageVersion';
</script>

<MetaTag
	title="Cancelled | Stablecog"
	description="Choose a plan that works for you and start using Stablecog. Free, multilingual and open-source AI image generator using Stable Diffusion and Kandinsky."
	image_url="{canonicalUrl}/previews{$page.url.pathname}-{previewImageVersion}.png"
/>

<PageWrapper>
	<div class="w-full flex flex-col items-center justify-start my-auto">
		<IconSadFace class="w-24 h-24 text-c-primary" />
		<h1 class="text-center font-bold text-4xl mt-4 text-c-primary">
			{$LL.Pricing.Purchase.Cancelled.PageTitle()}
		</h1>
		<p class="max-w-xl mt-4 leading-relaxed text-center text-c-on-bg/75">
			{$LL.Pricing.Purchase.Cancelled.PageParagraph()}
		</p>
		<Button href="/pricing" withSpinner class=" mt-6">{$LL.Shared.TryAgainButton()}</Button>
	</div>
</PageWrapper>
