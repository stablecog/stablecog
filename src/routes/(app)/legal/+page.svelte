<script lang="ts">
	import { page } from '$app/stores';
	import MetaTag from '$components/MetaTag.svelte';
	import { canonicalUrl } from '$ts/constants/main';
	import PageWrapper from '$components/PageWrapper.svelte';
	import { previewImageVersion } from '$ts/constants/previewImageVersion';
	import Logo from '$components/Logo.svelte';
	import LL from '$i18n/i18n-svelte';

	type TDoc = {
		title: string;
		href: string;
	};
	let docs: TDoc[];
	$: docs = [
		{
			title: $LL.Legal.TermsOfServiceTitle(),
			href: '/terms'
		},
		{
			title: $LL.Legal.PrivacyPolicyTitle(),
			href: '/privacy'
		}
	];
</script>

<MetaTag
	title="Legal | Stablecog"
	description="Check out our terms and policies. Create amazing art in seconds with AI. Free, multilingual and open-source AI image generator using Stable Diffusion and Kandinsky."
	image_url="{canonicalUrl}/previews{$page.url.pathname}-{previewImageVersion}.png"
/>

<PageWrapper>
	<div class="w-full flex flex-col items-center justify-start my-auto">
		<section id="legal" class="w-full flex flex-col items-center justify-start text-center">
			<Logo class="w-16" />
			<h1 class="text-4xl font-bold max-w-sm mt-5">{$LL.Legal.PageTitle()}</h1>
			<p class="mt-4 max-w-sm text-c-on-bg/75">{$LL.Legal.PageParagraph()}</p>
			<div
				class="w-full max-w-7xl items-start justify-center flex flex-row flex-wrap gap-4 md:gap-5 mt-8"
			>
				{#each docs as doc}
					<a
						href={doc.href}
						data-sveltekit-preload-data="hover"
						class="w-full max-w-sm flex flex-col items-center justify-center px-6 py-6 bg-c-bg-secondary ring-2 ring-c-bg-tertiary relative z-0 overflow-hidden
						rounded-xl shadow-lg shadow-c-shadow/[var(--o-shadow-normal)] transition group
						not-touch:hover:ring-4 not-touch:hover:shadow-xl
						not-touch:hover:shadow-c-shadow/[var(--o-shadow-strong)] not-touch:hover:-translate-y-1.5"
					>
						<h1 class="text-xl font-bold max-w-full">
							{doc.title}
						</h1>
					</a>
				{/each}
			</div>
			<div class="w-full h-[2vh]" />
		</section>
	</div>
</PageWrapper>
