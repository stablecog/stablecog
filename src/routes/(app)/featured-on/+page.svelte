<script lang="ts">
	import { page } from '$app/stores';
	import NoBgButton from '$components/primitives/buttons/NoBgButton.svelte';
	import MetaTag from '$components/utils/MetaTag.svelte';
	import PageWrapper from '$components/wrappers/PageWrapper.svelte';
	import LL from '$i18n/i18n-svelte';
	import { auxBucketStaticUrl } from '$ts/constants/main';
	import { previewImageVersion } from '$ts/constants/previewImageVersion';

	const featuredOn: TFeaturedOn[] = [
		{
			url: 'https://www.unite.ai/10-best-ai-art-generators/',
			logo: `<svg class='w-full h-auto' width="230" height="30" viewBox="0 0 230 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M32.3 20.5c1.2 0 2.1-.9 2.1-2.1h-.1V6.8H37v11.7c0 2.5-2 4.6-4.6 4.6H14.6c-2.5 0-4.6-2-4.6-4.6V6.8h2.7v11.6c0 1.2.9 2.1 2.1 2.1h17.5ZM52.9 6.8h17.8c2.6 0 4.6 2.1 4.6 4.7v11.7h-2.7V11.7c0-1.2-.9-2.1-2.1-2.1H53.1c-1.2 0-2.1.9-2.1 2.1v11.4h-2.7V11.4c0-2.5 2-4.6 4.6-4.6Zm35.8 0H86v16.3h2.7V6.8Zm128.6 0h2.7v16.3h-2.7V6.8Zm-120 2.8h12v13.6h2.7V9.6h12.2V6.8H97.3v2.8Zm60.6 10.9h-24.3v-4.1H158v-2.8h-27.1v9.6h27v-2.7Zm.1-13.7h-27.1v2.7H158V6.8Zm9.7 13.7h2.7v2.7h-2.7v-2.7Zm24.8-13.6-14.2 16.3h3.6l11.9-13.6 11.9 13.6h3.7L195.1 6.9h-2.6Zm6.2 16.3h-9.8l4.9-5.6 4.9 5.6Z" fill="currentColor"/>
            </svg>`,
			name: 'Unite AI'
		}
	];

	interface TFeaturedOn {
		url: string;
		logo: string;
		name: string;
	}
</script>

<MetaTag
	title="Featured On | Stablecog"
	description="Platform featuring Stablecog. Free, multilingual and open-source AI image generator using Stable Diffusion, FLUX, and Kandinsky."
	image_url="{auxBucketStaticUrl}/previews{$page.url.pathname}-{previewImageVersion}.png"
/>

<PageWrapper>
	<div class="my-auto flex w-full flex-col items-center justify-center">
		<h1 class="px-6 text-center text-3xl font-bold md:text-4xl">{$LL.FeaturedOn.PageTitle()}</h1>
		<div class="mt-6 flex w-full max-w-4xl flex-wrap items-stretch justify-center gap-6">
			{#each featuredOn as featured}
				<div class="relative flex w-full max-w-md flex-col items-center md:w-1/3">
					<a
						href={featured.url}
						target="_blank"
						rel="noopener noreferrer"
						class="group relative flex h-full w-full items-center justify-center rounded-xl bg-c-bg-secondary
          		p-4 text-c-on-bg shadow-lg shadow-c-shadow/[var(--o-shadow-normal)] ring-2 ring-c-bg-tertiary
				  		transition not-touch:hover:-translate-y-1.5 not-touch:hover:text-c-primary not-touch:hover:shadow-xl
							not-touch:hover:shadow-c-shadow/[var(--o-shadow-strong)] not-touch:hover:ring-4"
					>
						{@html featured.logo}
					</a>
					<NoBgButton
						size="sm"
						class="mt-2 font-semibold text-c-on-bg/60"
						href={featured.url}
						target="_blank"
					>
						<p
							class="font-semibold text-c-on-bg/50 transition not-touch:group-hover:text-c-primary"
						>
							{featured.name}
						</p>
					</NoBgButton>
				</div>
			{/each}
		</div>
	</div>
</PageWrapper>
