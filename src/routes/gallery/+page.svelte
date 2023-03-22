<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import GenerationFullScreen from '$components/generationFullScreen/GenerationFullScreen.svelte';
	import GenerationGridInfinite from '$components/grids/GenerationGridInfinite.svelte';
	import IconSearch from '$components/icons/IconSearch.svelte';
	import Input from '$components/Input.svelte';
	import MetaTag from '$components/MetaTag.svelte';
	import LL, { locale } from '$i18n/i18n-svelte';
	import { canonicalUrl } from '$ts/constants/main';
	import { getGalleryMetaTagDescriptionFromPromptText } from '$ts/helpers/metaTag';
	import { getPreviewImageUrlFromOutputId } from '$ts/helpers/getPreviewImageUrl';
	import { logGallerySearch } from '$ts/helpers/loggers';
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
	import { onMount } from 'svelte';
	import type { PageServerData } from './$types';
	import IconAnimatedSpinner from '$components/icons/IconAnimatedSpinner.svelte';
	import { appVersion } from '$ts/stores/appVersion';

	export let data: PageServerData;
	const { generationFullOutput: generationFullOutputFromData } = data;

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

	$: gridRerenderKey = `gallery_generation_full_outputs_${searchStringDebounced}_${
		$galleryGenerationFullOutputsQuery?.isInitialLoading
	}_${$galleryGenerationFullOutputsQuery?.isStale}_${
		$galleryGenerationFullOutputsQuery?.data?.pages?.[0]?.outputs &&
		$galleryGenerationFullOutputsQuery.data.pages[0].outputs.length > 0
			? $galleryGenerationFullOutputsQuery.data.pages[0].outputs[0].id
			: false
	}`;

	let scrollDirection: 'up' | 'down' = 'down';
	let oldScrollY = 0;
	let notAtTheVeryTop = false;

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
				logGallerySearch({
					'SC - Search Query': searchStringDebounced,
					'SC - Advanced Mode': $advancedModeApp,
					'SC - Locale': $locale,
					'SC - Stripe Product Id': $userSummary?.product_id,
					'SC - App Version': $appVersion
				});
			} else {
				searchStringDebounced = '';
			}
		}, searchDebounceMs);
	}

	function onKeyDown({ key }: KeyboardEvent) {
		if ($activeGeneration !== undefined) {
			if (key === 'Escape') {
				activeGeneration.set(undefined);
			}
		}
	}

	const notAtTheVeryTopThreshold = 5;
	const minScrollThreshold = 50;

	function onScroll() {
		const scrollY = window.scrollY;
		const _notAtTheVeryTop = scrollY > notAtTheVeryTopThreshold;
		if (_notAtTheVeryTop !== notAtTheVeryTop) {
			notAtTheVeryTop = _notAtTheVeryTop;
		}
		if (Math.abs(window.scrollY - oldScrollY) < minScrollThreshold) return;
		if (window.scrollY > oldScrollY) {
			scrollDirection = 'down';
		} else {
			scrollDirection = 'up';
		}
		oldScrollY = scrollY;
	}

	onMount(() => {
		if (generationFullOutputFromData) {
			activeGeneration.set({
				...generationFullOutputFromData.generation,
				selected_output: generationFullOutputFromData
			});
		}
	});
</script>

<MetaTag
	title="Gallery | Stablecog"
	description={generationFullOutputFromData
		? getGalleryMetaTagDescriptionFromPromptText(
				generationFullOutputFromData.generation.prompt.text
		  )
		: 'A gallery full of images created with Stable Diffusion. Check out the images and their metadata including their prompt, negative prompt, inference steps, guidance scale and seed. Generate similar images directly from the gallery or submit your own.'}
	imageUrl={generationFullOutputFromData
		? getPreviewImageUrlFromOutputId(generationFullOutputFromData.id)
		: `${canonicalUrl}/previews${$page.url.pathname}.png`}
	canonical={generationFullOutputFromData
		? `${canonicalUrl}${$page.url.pathname}?output=${generationFullOutputFromData.id}`
		: `${canonicalUrl}${$page.url.pathname}`}
/>

<svelte:window on:keydown={onKeyDown} on:scroll={onScroll} />
<div class="w-full flex-1 flex flex-col items-center relative">
	<div
		style="top: {$navbarHeight}px"
		class="w-full px-2 py-2 flex justify-center sticky z-10 transition duration-200 {scrollDirection ===
			'down' && notAtTheVeryTop
			? '-translate-y-22 pointer-events-none opacity-0'
			: 'translate-y-0 opacity-100'}"
	>
		<Input
			disabled={scrollDirection === 'down'}
			class="max-w-2xl"
			bind:value={searchString}
			title={$LL.Gallery.SearchInput.Title()}
			hasIcon
			hasClearButton
			bg="bg-secondary"
			shadow={notAtTheVeryTop ? 'strongest' : 'normal'}
		>
			<IconSearch slot="icon" class="w-full h-full" />
		</Input>
	</div>
	<div class="w-full px-1 pb-3 md:pt-3 relative flex flex-col flex-1">
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
					class="w-12 h-12"
				>
					<IconAnimatedSpinner class="w-full h-full" />
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
			<div class="w-full flex-1 flex flex-col">
				<GenerationGridInfinite
					rerenderKey={gridRerenderKey}
					cardType="gallery"
					generationsQuery={galleryGenerationFullOutputsQuery}
				/>
			</div>
		{/if}
	</div>
</div>

{#if $activeGeneration && $galleryGenerationFullOutputsQuery?.isInitialLoading === false}
	<GenerationFullScreen generation={$activeGeneration} modalType="gallery" />
{/if}
