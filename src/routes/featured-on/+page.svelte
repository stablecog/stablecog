<script lang="ts">
	import { page } from '$app/stores';
	import MetaTag from '$components/MetaTag.svelte';
	import PageWrapper from '$components/PageWrapper.svelte';
	import LL from '$i18n/i18n-svelte';
	import { canonicalUrl } from '$ts/constants/main';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';

	const featuredOn: TFeaturedOn[] = [
		{
			url: 'https://www.unite.ai/10-best-ai-art-generators/',
			logo: `<svg class='w-full h-auto' width="230" height="30" viewBox="0 0 230 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path fill-rule="evenodd" clip-rule="evenodd" d="M32.3 20.5c1.2 0 2.1-.9 2.1-2.1h-.1V6.8H37v11.7c0 2.5-2 4.6-4.6 4.6H14.6c-2.5 0-4.6-2-4.6-4.6V6.8h2.7v11.6c0 1.2.9 2.1 2.1 2.1h17.5ZM52.9 6.8h17.8c2.6 0 4.6 2.1 4.6 4.7v11.7h-2.7V11.7c0-1.2-.9-2.1-2.1-2.1H53.1c-1.2 0-2.1.9-2.1 2.1v11.4h-2.7V11.4c0-2.5 2-4.6 4.6-4.6Zm35.8 0H86v16.3h2.7V6.8Zm128.6 0h2.7v16.3h-2.7V6.8Zm-120 2.8h12v13.6h2.7V9.6h12.2V6.8H97.3v2.8Zm60.6 10.9h-24.3v-4.1H158v-2.8h-27.1v9.6h27v-2.7Zm.1-13.7h-27.1v2.7H158V6.8Zm9.7 13.7h2.7v2.7h-2.7v-2.7Zm24.8-13.6-14.2 16.3h3.6l11.9-13.6 11.9 13.6h3.7L195.1 6.9h-2.6Zm6.2 16.3h-9.8l4.9-5.6 4.9 5.6Z" fill="currentColor"/>
            </svg>`,
			name: 'Unite AI'
		}
		/* {
			url: 'https://www.skylinesocial.com/ai-art-generator/',
			logo: `<svg class='w-full h-auto' width="205" height="83" viewBox="0 0 205 83" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M192 44v-7.5h-13.5v-5h9V25h-9v-4.5H192v-7h-21.5v31h-6v-31h-8v15l-18-17v33h-6V8l-8 5.5v31h-4v-8h-13v-23h-7v31h-14v-12l10.5-19h-8L83 24l-6-10.5h-9l11 19v12h-9.5L56.5 28 67 13.5h-9l-9.5 13v-13h-8v30L33 41.45c1.77-1.5 3-3.76 3-6.95 0-3-2-5.5-4.5-7-2.88-1.73-9.5-3-9.5-6s5.5-1.5 8 1.5c1.5-1 5-3.5 5.5-4-1.5-2-5-6-10-6C19 13 15 16 15 21.5s5 8.5 7 9.5 7.5 3 6 5.5-7-.5-9.5-3c-1.5 1.5-4 3.5-5 4.5" stroke="currentColor"/>
              <path fill-rule="evenodd" clip-rule="evenodd" d="m115 38-8 4.5V71h8V38Zm32 33h-7.5l-1-2h-11l-1 2H119l14-31 14 31Zm-17.5-8 3.5-7.5 3.5 7.5h-7Zm21.5 8h20v-6h-13V42h-7v29ZM87.5 41.5c8.5 0 12 3 15 7L98 53l-.37-.38C96.09 51.05 93.6 48.5 89 48.5c-5 0-8 4.5-8 8.5s3 8 8 8c3 0 6-1.5 8-4.5 2 1 5 3 5.5 3.5-2 4-6.5 8-13.5 8-6.5 0-16-5.5-16-15s7.5-15.5 14.5-15.5ZM31 55.5c2.5 1.5 4.5 4 4.5 7 0 7.04-6 9.5-10.5 9.5-4 0-7.5-2-12-6 .45-.45 1.2-1.1 2.03-1.82A60.9 60.9 0 0 0 18 61.5c2.5 2.5 8 5.5 9.5 3 1.29-2.15-2.6-3.93-4.98-5.02L21.5 59c-2-1-7-4-7-9.5S18.5 41 25 41c5 0 8.5 4 10 6-.5.5-4 3-5.5 4-2.5-3-8-4.5-8-1.5 0 2.08 3.17 3.33 6.08 4.47 1.3.51 2.53 1 3.42 1.53ZM70 57a16 16 0 0 1-18.56 15.8C49.55 73.83 47 74.5 42 74.5c1.37-1.37 2.5-2.97 2.92-4.32A16 16 0 1 1 70 57Z" fill="currentColor"/>
            </svg>`,
			name: 'Skyline Social'
		} */
	];

	interface TFeaturedOn {
		url: string;
		logo: string;
		name: string;
	}
</script>

<MetaTag
	title="Featured On | Stablecog"
	description="Websites that have featured Stablecog (free and multi-lingual AI image generator)."
	imageUrl="{canonicalUrl}/previews{$page.url.pathname}.png"
	canonical="{canonicalUrl}{$page.url.pathname}"
/>

<PageWrapper>
	<div class="w-full flex flex-col items-center justify-center my-auto">
		<h1 class="text-4xl font-bold">{$LL.FeaturedOn.PageTitle()}</h1>
		<div class="w-full max-w-4xl flex flex-wrap items-stretch justify-center mt-6 gap-6">
			{#each featuredOn as featured}
				<a
					href={featured.url}
					target="_blank"
					rel="noopener noreferrer"
					class="w-full md:w-1/3 max-w-md p-4 flex transition items-center justify-center rounded-xl 
          ring-2 ring-c-bg-tertiary bg-c-bg-secondary shadow-lg shadow-c-shadow/[var(--o-shadow-normal)] group
				  {!$isTouchscreen
						? 'hover:text-c-primary hover:ring-4 hover:shadow-xl hover:shadow-c-shadow/[var(--o-shadow-strong)] hover:-translate-y-1.5'
						: 'text-c-on-bg'}"
				>
					{@html featured.logo}
				</a>
			{/each}
		</div>
	</div>
</PageWrapper>
