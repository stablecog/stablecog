<script>
	import { page } from '$app/stores';
	import Button from '$components/buttons/Button.svelte';
	import IconSadFace from '$components/icons/IconSadFace.svelte';
	import MetaTag from '$components/MetaTag.svelte';
	import LL from '$i18n/i18n-svelte';
	import { canonicalUrl } from '$ts/constants/main';
</script>

<MetaTag
	title="Cancelled | Stablecog"
	description="Become a pro member on Stablecog to unlock all of its features."
	imageUrl="{canonicalUrl}/previews{$page.url.pathname}.png"
	canonical="{canonicalUrl}{$page.url.pathname}"
/>

<div class="w-full flex-1 flex flex-col py-8 px-5">
	<div class="w-full flex flex-col items-center justify-start my-auto">
		<IconSadFace class="w-32 h-32 text-c-primary" />
		<h1 class="text-center font-bold text-4xl mt-8">{$LL.Pro.Cancel.PageTitle()}</h1>
		<p class="max-w-xl mt-4 leading-relaxed text-center text-c-on-bg/75">
			{$LL.Pro.Cancel.PageParagraph()}
		</p>
		<Button href="/pro" withSpinner class=" mt-8">{$LL.Shared.TryAgainButton()}</Button>
	</div>
</div>
