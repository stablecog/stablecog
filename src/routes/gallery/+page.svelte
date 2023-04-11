<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import GenerationFullScreen from '$components/generationFullScreen/GenerationFullScreen.svelte';
	import GenerationGridInfinite from '$components/grids/GenerationGridInfinite.svelte';
	import IconSearch from '$components/icons/IconSearch.svelte';
	import MetaTag from '$components/MetaTag.svelte';
	import LL, { locale } from '$i18n/i18n-svelte';
	import { canonicalUrl } from '$ts/constants/main';
	import { getGalleryMetaTagDescriptionFromPromptText } from '$ts/helpers/metaTag';
	import { getPreviewImageUrlFromOutputId } from '$ts/helpers/getPreviewImageUrl';
	import {
		getGalleryGenerationFullOutputs,
		type TGalleryGenerationFullOutputsPage
	} from '$ts/queries/galleryGenerations';
	import { globalSeed } from '$ts/stores/globalSeed';
	import { navbarHeight } from '$ts/stores/navbarHeight';
	import { activeGeneration } from '$ts/stores/user/generation';
	import { createInfiniteQuery } from '@tanstack/svelte-query';
	import { quadOut } from 'svelte/easing';
	import { scale } from 'svelte/transition';
	import { onMount } from 'svelte';
	import type { PageServerData } from './$types';
	import IconAnimatedSpinner from '$components/icons/IconAnimatedSpinner.svelte';
	import SearchAndFilterBar from '$components/SearchAndFilterBar.svelte';
	import IconSadFace from '$components/icons/IconSadFace.svelte';
	import { logGallerySearch } from '$ts/helpers/loggers';
	import { advancedModeApp } from '$ts/stores/advancedMode';
	import { userSummary } from '$ts/stores/user/summary';
	import { appVersion } from '$ts/stores/appVersion';

	export let data: PageServerData;
	const { generationFullOutput: generationFullOutputFromData } = data;

	let searchString: string;

	$: galleryGenerationFullOutputsQuery = browser
		? createInfiniteQuery({
				queryKey: ['gallery_generation_full_outputs', searchString ? searchString : ''],
				queryFn: async (lastPage) => {
					return getGalleryGenerationFullOutputs({
						cursor: lastPage?.pageParam,
						search: searchString,
						seed: $globalSeed
					});
				},
				getNextPageParam: (lastPage: TGalleryGenerationFullOutputsPage) => {
					if (!lastPage.next) return undefined;
					return lastPage.next;
				}
		  })
		: undefined;

	$: gridRerenderKey = `gallery_generation_full_outputs_${searchString ? searchString : ''}_${
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

	function onKeyDown({ key }: KeyboardEvent) {
		if (!$activeGeneration) return;
		if (key === 'Escape') {
			activeGeneration.set(undefined);
			return;
		}
		if (key === 'ArrowLeft' || key === 'ArrowRight') {
			const outputs = $galleryGenerationFullOutputsQuery?.data?.pages.flatMap(
				(page) => page.outputs
			);
			if (!outputs) return;
			const index = outputs.findIndex((g) => g.id === $activeGeneration?.selected_output.id);
			if (index === -1) return;
			const addition = key === 'ArrowLeft' ? -1 : 1;
			const newIndex = (index + addition + outputs.length) % outputs.length;
			activeGeneration.set({
				...outputs[newIndex].generation,
				selected_output: outputs[newIndex]
			});
		}
	}

	const notAtTheVeryTopThreshold = 5;
	const minScrollThreshold = 40;

	$: hideSearchBar = scrollDirection === 'down' && notAtTheVeryTop;

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
<div class="w-full flex-1 flex flex-col items-center relative mt-1 md:mt-0">
	<div
		style="top: {$navbarHeight}px"
		class="w-full px-2 py-1 md:py-2 flex justify-center sticky z-10 transition duration-200 {hideSearchBar
			? '-translate-y-22 pointer-events-none opacity-0'
			: 'translate-y-0 opacity-100'}"
	>
		<div class="w-full flex max-w-3xl justify-center">
			<SearchAndFilterBar
				bind:searchString
				disabled={hideSearchBar}
				inputShadow={notAtTheVeryTop ? 'strongest' : 'normal'}
			/>
		</div>
	</div>
	<div class="w-full px-1 pb-3 pt-1 md:pt-3 relative flex flex-col flex-1">
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
		{:else if $galleryGenerationFullOutputsQuery?.isError || ($galleryGenerationFullOutputsQuery?.data && !$galleryGenerationFullOutputsQuery?.data?.pages)}
			<div class="w-full flex-1 flex flex-col items-center py-8 px-5">
				<div class="flex flex-col my-auto items-center gap-2">
					<IconSadFace class="w-16 h-16 text-c-on-bg/50" />
					<p class="text-c-on-bg/50">{$LL.Error.SomethingWentWrong()}</p>
				</div>
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
