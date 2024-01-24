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
	title="Contact | Stablecog"
	description="Reach out to us and we'll answer any questions you have. Create amazing art in seconds with AI. Free, multilingual and open-source AI image generator using Stable Diffusion and Kandinsky."
	image_url="{canonicalUrl}/previews{$page.url.pathname}-{previewImageVersion}.png"
/>

<PageWrapper>
	<div class="w-full flex flex-col items-center justify-start my-auto">
		<section id="support" class="w-full flex flex-col items-center justify-start">
			<Logo class="w-16" />
			<h1 class="text-center font-bold text-4xl mt-5">{$LL.Contact.PageTitle()}</h1>
			<p class="max-w-lg mt-4 text-center leading-relaxed text-c-on-bg/75">
				{$LL.Contact.PageParagraph()}
			</p>
			<div
				class="rounded-xl p-2 bg-c-bg ring-2 ring-c-bg-secondary mt-6 shadow-lg shadow-c-shadow/[var(--o-shadow-strong)]"
			>
				<ScBar withEmail emailFirst color="normal" size="md" />
			</div>
			<div class="w-full h-[2vh]" />
		</section>
	</div>
</PageWrapper>
