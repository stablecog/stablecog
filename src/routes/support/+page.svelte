<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import Button from '$components/buttons/Button.svelte';
	import MetaTag from '$components/MetaTag.svelte';
	import LL, { locale } from '$i18n/i18n-svelte';
	import { apiUrl, canonicalUrl } from '$ts/constants/main';
	import PageWrapper from '$components/PageWrapper.svelte';
	import SignInCard from '$components/SignInCard.svelte';
	import { clickoutside } from '$ts/actions/clickoutside';
	import { fade, fly } from 'svelte/transition';
	import { quadOut } from 'svelte/easing';
	import { portal } from 'svelte-portal';
	import SocialBar from '$components/SocialBar.svelte';
</script>

<MetaTag
	title="Support | Stablecog"
	description="Reach out to us and we'll answer any questions you have."
	imageUrl="{canonicalUrl}/previews{$page.url.pathname}.png"
	canonical="{canonicalUrl}{$page.url.pathname}"
/>

<PageWrapper>
	<div class="w-full flex flex-col items-center justify-start my-auto">
		<section id="support" class="w-full flex flex-col items-center justify-start">
			<h1 class="text-center font-bold text-4xl">{$LL.Support.PageTitle()}</h1>
			<p class="max-w-xl mt-3 text-center leading-relaxed text-c-on-bg/75">
				{$LL.Support.PageParagraph()}
			</p>
			<div
				class="rounded-xl p-2 bg-c-bg ring-2 ring-c-bg-secondary mt-5 shadow-lg shadow-c-shadow/[var(--o-shadow-strong)]"
			>
				<SocialBar withEmail emailFirst color="normal" size="md" />
			</div>
			<div class="w-full h-[2vh]" />
		</section>
	</div>
</PageWrapper>
