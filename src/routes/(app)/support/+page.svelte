<script lang="ts">
	import { page } from '$app/stores';
	import MetaTag from '$components/utils/MetaTag.svelte';
	import LL from '$i18n/i18n-svelte';
	import { canonicalUrl } from '$ts/constants/main';
	import PageWrapper from '$components/wrappers/PageWrapper.svelte';
	import ScBar from '$components/ScBar.svelte';
	import { previewImageVersion } from '$ts/constants/previewImageVersion';
	import Logo from '$components/Logo.svelte';
</script>

<MetaTag
	title="Support | Stablecog"
	description="Reach out to us and we'll answer any questions you have. Create amazing art in seconds with AI. Free, multilingual and open-source AI image generator using Stable Diffusion, FLUX, and Kandinsky."
	image_url="{canonicalUrl}/previews{$page.url.pathname}-{previewImageVersion}.png"
/>

<PageWrapper>
	<div class="my-auto flex w-full flex-col items-center justify-start">
		<section id="support" class="flex w-full flex-col items-center justify-start">
			<Logo class="w-16" />
			<h1 class="mt-5 text-center text-4xl font-bold">{$LL.Support.PageTitle()}</h1>
			<p class="mt-4 max-w-lg text-balance text-center leading-relaxed text-c-on-bg/75">
				{$LL.Support.PageParagraph()}
			</p>
			<div
				class="mt-6 rounded-xl bg-c-bg p-2 shadow-lg shadow-c-shadow/[var(--o-shadow-strong)] ring-2 ring-c-bg-secondary"
			>
				<ScBar noBlog noGuide emailFirst color="normal" size="md" />
			</div>
			<div class="h-[2vh] w-full" />
		</section>
	</div>
</PageWrapper>
