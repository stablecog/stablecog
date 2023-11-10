<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import GenerationFullScreen from '$components/generationFullScreen/GenerationFullScreen.svelte';
	import IconSearch from '$components/icons/IconSearch.svelte';
	import MetaTag from '$components/MetaTag.svelte';
	import LL from '$i18n/i18n-svelte';
	import { canonicalUrl } from '$ts/constants/main';
	import { globalSeed } from '$ts/stores/globalSeed';
	import { activeGeneration } from '$ts/stores/user/generation';
	import { createInfiniteQuery } from '@tanstack/svelte-query';
	import { quadOut } from 'svelte/easing';
	import { scale } from 'svelte/transition';
	import IconAnimatedSpinner from '$components/icons/IconAnimatedSpinner.svelte';
	import SearchAndFilterBar from '$components/SearchAndFilterBar.svelte';
	import IconSadFace from '$components/icons/IconSadFace.svelte';
	import type { TAvailableGenerationModelId } from '$ts/constants/generationModels';
	import { setActiveGenerationToOutputIndex } from '$ts/helpers/goToOutputIndex';
	import GenerationGridInfinite from '$components/grids/GenerationGridInfinite.svelte';
	import { windowWidth } from '$ts/stores/window';
	import {
		lgBreakpoint,
		mdBreakpoint,
		xlBreakpoint,
		xl3Breakpoint,
		xl2Breakpoint
	} from '$components/generationFullScreen/constants';
	import {
		galleryModelIdFilters,
		gallerySearchString,
		getGalleryInfiniteQueryKey,
		getGalleryInfiniteQueryProps
	} from '$routes/(app)/gallery/constants';
	import { previewImageVersion } from '$ts/constants/previewImageVersion.js';
	import { galleryGenerationFullOutputsQueryKey } from '$ts/stores/user/queryKeys.js';
	import { hydrated, updateHydrated } from '$ts/stores/hydrated.js';
	import { onMount } from 'svelte';

	export let data;

	if (!hydrated) {
		galleryModelIdFilters.set(data.modelIdFilters);
		gallerySearchString.set(data.searchString);
	}

	$: galleryGenerationFullOutputsQueryKey.set(
		getGalleryInfiniteQueryKey({
			searchString: $gallerySearchString,
			modelIdFilters: $galleryModelIdFilters,
			seed: $globalSeed
		})
	);

	$: galleryGenerationFullOutputsQuery = browser
		? createInfiniteQuery(
				getGalleryInfiniteQueryProps({
					searchString: $gallerySearchString,
					modelIdFilters: $galleryModelIdFilters,
					seed: $globalSeed,
					accessToken: $page.data.session?.access_token
				})
		  )
		: undefined;

	$: outputs = $galleryGenerationFullOutputsQuery?.data?.pages
		.flatMap((page) => page.outputs)
		.filter((i) => i !== undefined);
	$: outputIndex = outputs
		? outputs.findIndex((g) => g.id === $activeGeneration?.selected_output.id)
		: -1;
	$: leftIndex = outputIndex > 0 ? outputIndex - 1 : -1;
	$: rightIndex = outputs && outputIndex < outputs?.length - 1 ? outputIndex + 1 : -1;

	function setSearchQuery(query: string) {
		gallerySearchString.set(query);
	}

	function onKeyDown({ key }: KeyboardEvent) {
		if (!$activeGeneration) return;
		if (key === 'Escape') {
			activeGeneration.set(undefined);
			window.history.back();
			return;
		}
		if (key === 'ArrowLeft' && leftIndex !== -1) {
			setActiveGenerationToOutputIndex(outputs, leftIndex);
			return;
		}
		if (key === 'ArrowRight' && rightIndex !== -1) {
			setActiveGenerationToOutputIndex(outputs, rightIndex);
			return;
		}
	}

	onMount(() => {
		updateHydrated();
	});
</script>

<MetaTag
	title="Gallery | Stablecog"
	description="A gallery full of images created with Stable Diffusion and Kandinsky. Check out the images and their metadata including their prompt, negative prompt, inference steps, guidance scale and seed. Generate similar images directly from the gallery or submit your own."
	image_url="{canonicalUrl}/previews{$page.url.pathname}-{previewImageVersion}.png"
	canonical="{canonicalUrl}{$page.url.pathname}"
/>

<svelte:window on:keydown={onKeyDown} />

<div class="w-full flex-1 flex flex-col items-center pt-1.5">
	<div class="w-full px-2 py-1 md:py-2 flex justify-center">
		<div class="w-full flex max-w-3xl justify-center">
			<SearchAndFilterBar
				bind:modelIdFilters={$galleryModelIdFilters}
				bind:searchString={$gallerySearchString}
			/>
		</div>
	</div>
	<div class="w-full px-1 pb-3 pt-1 md:pt-3 relative flex flex-col flex-1">
		{#if $galleryGenerationFullOutputsQuery?.isInitialLoading}
			<div
				class="w-full flex flex-col text-c-on-bg/60 flex-1 py-6 px-4 justify-center items-center text-center"
			>
				<div
					in:scale={{
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
		{:else if galleryGenerationFullOutputsQuery !== undefined && $windowWidth}
			<div class="w-full flex-1 mt-1 md:mt-0.5 flex flex-col">
				<GenerationGridInfinite
					cardType="gallery"
					generationsQuery={galleryGenerationFullOutputsQuery}
					cols={$windowWidth > xl3Breakpoint
						? 7
						: $windowWidth > xl2Breakpoint
						? 6
						: $windowWidth > xlBreakpoint
						? 5
						: $windowWidth > lgBreakpoint
						? 4
						: $windowWidth > mdBreakpoint
						? 3
						: 2}
					{setSearchQuery}
				/>
			</div>
		{/if}
	</div>
</div>

{#if $activeGeneration && $galleryGenerationFullOutputsQuery?.isInitialLoading === false}
	<GenerationFullScreen
		onLeftButtonClicked={leftIndex !== -1
			? () => setActiveGenerationToOutputIndex(outputs, leftIndex)
			: undefined}
		onRightButtonClicked={rightIndex !== -1
			? () => setActiveGenerationToOutputIndex(outputs, rightIndex)
			: undefined}
		generation={$activeGeneration}
		{setSearchQuery}
		modalType="gallery"
	/>
{/if}
