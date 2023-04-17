<script>
	import { page } from '$app/stores';
	import Button from '$components/buttons/Button.svelte';
	import IconSadFace from '$components/icons/IconSadFace.svelte';
	import MetaTag from '$components/MetaTag.svelte';
	import PageWrapper from '$components/PageWrapper.svelte';
	import LL from '$i18n/i18n-svelte';
	import { canonicalUrl } from '$ts/constants/main';
</script>

<MetaTag
	title="Cancelled | Synthica"
	description="Choose a plan that works for you and start using Synthica."
	imageUrl="{canonicalUrl}/previews{$page.url.pathname}.png"
	canonical="{canonicalUrl}{$page.url.pathname}"
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
