<script lang="ts">
	import { page } from '$app/stores';
	import MetaTag from '$components/utils/MetaTag.svelte';
	import { canonicalUrl } from '$ts/constants/main';
	import PageWrapper from '$components/wrappers/PageWrapper.svelte';
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
	description="Check out our terms and policies. Create amazing art in seconds with AI. Free, multilingual and open-source AI image generator using Stable Diffusion, FLUX, and Kandinsky."
	image_url="{canonicalUrl}/previews{$page.url.pathname}-{previewImageVersion}.png"
/>

<PageWrapper>
	<div class="my-auto flex w-full flex-col items-center justify-start">
		<section id="legal" class="flex w-full flex-col items-center justify-start text-center">
			<Logo class="w-16" />
			<h1 class="mt-5 max-w-sm text-4xl font-bold">{$LL.Legal.PageTitle()}</h1>
			<p class="mt-4 max-w-sm text-c-on-bg/75">{$LL.Legal.PageParagraph()}</p>
			<div
				class="mt-8 flex w-full max-w-7xl flex-row flex-wrap items-start justify-center gap-4 md:gap-5"
			>
				{#each docs as doc}
					<a
						href={doc.href}
						data-sveltekit-preload-data="hover"
						class="group relative z-0 flex w-full max-w-sm flex-col items-center justify-center overflow-hidden rounded-xl bg-c-bg-secondary px-6 py-6
						shadow-lg shadow-c-shadow/[var(--o-shadow-normal)] ring-2 ring-c-bg-tertiary transition
						not-touch:hover:-translate-y-1.5 not-touch:hover:shadow-xl
						not-touch:hover:shadow-c-shadow/[var(--o-shadow-strong)] not-touch:hover:ring-4"
					>
						<h1
							class="max-w-full text-xl font-bold text-c-on-bg transition not-touch:group-hover:text-c-primary"
						>
							{doc.title}
						</h1>
					</a>
				{/each}
			</div>
			<div class="h-[2vh] w-full" />
		</section>
	</div>
</PageWrapper>
