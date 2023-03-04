<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import GenerationFullScreen from '$components/generationFullScreen/GenerationFullScreen.svelte';
	import GenerationGridInfinite from '$components/grids/GenerationGridInfinite.svelte';
	import IconLoadingSlim from '$components/icons/IconLoadingSlim.svelte';
	import IconSearch from '$components/icons/IconSearch.svelte';
	import Input from '$components/Input.svelte';
	import MetaTag from '$components/MetaTag.svelte';
	import LL, { locale } from '$i18n/i18n-svelte';
	import { canonicalUrl } from '$ts/constants/main';
	import { mLogGallerySearch } from '$ts/helpers/loggers';
	import {
		getGalleryGenerationFullOutputs,
		type TGalleryGenerationFullOutputsPage
	} from '$ts/queries/galleryGenerations';
	import { advancedModeApp } from '$ts/stores/advancedMode';
	import { globalSeed } from '$ts/stores/globalSeed';
	import { navbarHeight } from '$ts/stores/navbarHeight';
	import { activeGeneration } from '$ts/stores/user/generation';
	import { userSummary } from '$ts/stores/user/summary';
	import { createInfiniteQuery } from '@tanstack/svelte-query';
	import { quadOut } from 'svelte/easing';
	import { scale } from 'svelte/transition';
	import type { PageServerData } from './$types';

	export let data: PageServerData;
	const {} = data;

	let searchString: string;
	let searchStringDebounced: string | undefined = undefined;
	let searchTimeout: NodeJS.Timeout;
	let searchDebounceMs = 400;
	$: searchString, setDebouncedSearch(searchString);

	$: galleryGenerationFullOutputsQuery = browser
		? createInfiniteQuery({
				queryKey: ['gallery_generation_full_outputs', searchStringDebounced],
				queryFn: async (lastPage) => {
					return getGalleryGenerationFullOutputs({
						cursor: lastPage?.pageParam,
						search: searchStringDebounced,
						seed: $globalSeed
					});
				},
				getNextPageParam: (lastPage: TGalleryGenerationFullOutputsPage) => {
					if (!lastPage.next) return undefined;
					return lastPage.next;
				}
		  })
		: undefined;

	let scrollDirection: 'up' | 'down' = 'up';
	let oldScrollY = 0;
	let atTheTop = true;

	async function setDebouncedSearch(searchString: string | undefined) {
		if (!browser) return;
		clearTimeout(searchTimeout);
		if (!searchString) {
			searchStringDebounced = '';
			return;
		}
		searchTimeout = setTimeout(async () => {
			if (searchString) {
				searchStringDebounced = searchString;
				mLogGallerySearch({
					'SC - Search Query': searchStringDebounced,
					'SC - Advanced Mode': $advancedModeApp,
					'SC - Locale': $locale,
					'SC - Stripe Product Id': $userSummary?.product_id
				});
			} else {
				searchStringDebounced = '';
			}
		}, searchDebounceMs);
	}

	function onKeyDown(event: KeyboardEvent) {}

	const atTheTopThreshold = 50;
	const minScrollThreshold = 40;
</script>

<!-- <MetaTag
	title="Gallery | Stablecog"
	description={generationData
		? `Check out this generation on the gallery: "${capitalize(
				generationData.prompt.text.slice(0, 200)
		  )}${generationData.prompt.text.length > 200 ? '...' : ''}".`
		: 'A gallery full of images created with Stable Diffusion. Check out the images and their metadata including their prompt, negative prompt, inference steps, guidance scale and seed. Generate similar images directly from the gallery or submit your own.'}
	imageUrl={generationData
		? generationGPreviewUrlFromId(generationData.id)
		: `${canonicalUrl}/previews${$page.url.pathname}.png`}
	canonical={generationData
		? `${canonicalUrl}${$page.url.pathname}?generation=${generationData.id}`
		: `${canonicalUrl}${$page.url.pathname}`}
/> -->

<svelte:window
	on:keydown={onKeyDown}
	on:scroll={() => {
		if (Math.abs(window.scrollY) < atTheTopThreshold) {
			atTheTop = true;
			return;
		} else {
			atTheTop = false;
		}
		if (Math.abs(window.scrollY - oldScrollY) < minScrollThreshold) return;
		if (window.scrollY > oldScrollY) {
			scrollDirection = 'down';
		} else {
			scrollDirection = 'up';
		}
		oldScrollY = window.scrollY;
	}}
/>
<div class="w-full flex-1 flex flex-col items-center relative">
	<div
		style="top: {$navbarHeight}px"
		class="w-full px-2 py-2 flex justify-center sticky z-10 transition {scrollDirection === 'up'
			? 'translate-y-0 opacity-100'
			: '-translate-y-22 pointer-events-none opacity-0'}"
	>
		<Input
			disabled={scrollDirection === 'down'}
			class="max-w-2xl"
			bind:value={searchString}
			title={$LL.Gallery.SearchInput.Title()}
			hasIcon
			hasClearButton
			bg="bg-secondary"
			shadow={!atTheTop ? 'strongest' : 'normal'}
		>
			<IconSearch slot="icon" class="w-full h-full" />
		</Input>
	</div>
	<div class="w-full px-2 py-3 relative flex flex-col flex-1">
		{#if $galleryGenerationFullOutputsQuery?.isInitialLoading}
			<div
				class="w-full flex flex-col text-c-on-bg/60 flex-1 py-6 px-4 justify-center items-center text-center"
			>
				<div
					in:scale|local={{
						duration: 200,
						easing: quadOut,
						opacity: 0,
						start: 0.5
					}}
					class="w-16 h-16"
				>
					<IconLoadingSlim class="animate-spin-faster w-full h-full" />
				</div>
				<p class="mt-2 opacity-0">
					{$LL.Gallery.SearchingTitle()}
				</p>
				<div class="h-[2vh]" />
			</div>
		{:else if $galleryGenerationFullOutputsQuery?.data?.pages.length === 1 && $galleryGenerationFullOutputsQuery.data.pages[0].outputs.length === 0}
			<div
				class="w-full flex flex-col text-c-on-bg/60 flex-1 py-6 px-4 justify-center items-center text-center"
			>
				<div class="w-16 h-16">
					<IconSearch class="w-full h-full" />
				</div>
				<p class="mt-2">
					{$LL.Gallery.NoMatchingGenerationTitle()}
				</p>
				<div class="h-[2vh]" />
			</div>
		{:else if galleryGenerationFullOutputsQuery !== undefined}
			{#key searchStringDebounced}
				<div class="w-full flex-1 flex flex-col">
					<GenerationGridInfinite
						cardType="gallery"
						generationsQuery={galleryGenerationFullOutputsQuery}
					/>
				</div>
			{/key}
		{/if}
	</div>
</div>

{#if $activeGeneration}
	<GenerationFullScreen generation={$activeGeneration} modalType="gallery" />
{/if}
