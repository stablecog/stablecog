<script lang="ts">
	import { page } from '$app/stores';
	import GenerationFullScreen from '$components/generationFullScreen/GenerationFullScreen.svelte';
	import IconSearch from '$components/icons/IconSearch.svelte';
	import MetaTag from '$components/utils/MetaTag.svelte';
	import LL from '$i18n/i18n-svelte';
	import { canonicalUrl } from '$ts/constants/main';
	import { globalSeed } from '$ts/stores/globalSeed';
	import { activeGeneration } from '$ts/stores/user/generation';
	import { createInfiniteQuery } from '@tanstack/svelte-query';
	import { quadOut } from 'svelte/easing';
	import { scale } from 'svelte/transition';
	import IconAnimatedSpinner from '$components/icons/IconAnimatedSpinner.svelte';
	import SearchAndFilterBar from '$components/galleryLike/SearchAndFilterBar.svelte';
	import IconSadFace from '$components/icons/IconSadFace.svelte';
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
		galleryAspectRatioFilters,
		galleryModelIdFilters,
		gallerySearchString,
		gallerySorts,
		galleryUsernameFilters,
		getGalleryInfiniteQueryKey,
		getGalleryInfiniteQueryProps,
		mainSortViewDefault,
		mainSorts,
		sortsDefault
	} from '$routes/(app)/gallery/constants';
	import { previewImageVersion } from '$ts/constants/previewImageVersion.js';
	import { galleryGenerationFullOutputsQueryKey } from '$ts/stores/user/queryKeys.js';
	import { hydrated, updateHydrated } from '$ts/stores/hydrated.js';
	import { onMount } from 'svelte';
	import { setUrlParam } from '$ts/helpers/setUrlParam.js';
	import type { TTab } from '$ts/types/main.js';
	import TabLikeDropdown from '$components/primitives/tabBars/TabLikeDropdown.svelte';
	import IconMainSortView from '$components/icons/IconMainSortView.svelte';
	import GalleryLikePageWrapper from '$components/galleryLike/GalleryLikePageWrapper.svelte';
	import GalleryLikeTitleSection from '$components/galleryLike/GalleryLikeTitleSection.svelte';
	import GalleryLikeGridWrapper from '$components/galleryLike/GalleryLikeGridWrapper.svelte';
	import { sessionStore } from '$ts/constants/supabase';

	export let data;

	if (!hydrated) {
		galleryModelIdFilters.set(data.modelIdFilters);
		galleryAspectRatioFilters.set(data.aspectRatioFilters);
		gallerySearchString.set(data.searchString);
		gallerySorts.set(data.sorts);
		galleryUsernameFilters.set(data.usernameFilters);
	}

	let mainSortView = $gallerySorts?.find((i) => mainSorts.includes(i)) ?? mainSortViewDefault;

	const mainSortViews: TTab<string>[] = [
		{
			value: 'trending',
			label: $LL.Gallery.Sort.Options.Trending()
		},
		{
			value: 'top',
			label: $LL.Gallery.Sort.Options.Top()
		},
		{
			value: 'new',
			label: $LL.Gallery.Sort.Options.New()
		}
	];

	$: mainSortView, onMainSortViewChanged();
	$: $gallerySorts, setUrlParam({ key: 'sort', value: $gallerySorts, defaultValue: sortsDefault });

	$: galleryGenerationFullOutputsQueryKey.set(
		getGalleryInfiniteQueryKey({
			searchString: $gallerySearchString,
			modelIdFilters: $galleryModelIdFilters,
			aspectRatioFilters: $galleryAspectRatioFilters,
			sorts: $gallerySorts,
			usernameFilters: $galleryUsernameFilters,
			seed: $globalSeed
		})
	);

	$: galleryGenerationFullOutputsQuery = createInfiniteQuery(
		getGalleryInfiniteQueryProps({
			searchString: $gallerySearchString,
			modelIdFilters: $galleryModelIdFilters,
			aspectRatioFilters: $galleryAspectRatioFilters,
			sorts: $gallerySorts,
			usernameFilters: $galleryUsernameFilters,
			seed: $globalSeed,
			accessToken: $sessionStore?.access_token
		})
	);

	$: outputs = $galleryGenerationFullOutputsQuery?.data?.pages
		.flatMap((page) => page.outputs)
		.filter((i) => i !== undefined);
	$: outputIndex = outputs
		? outputs.findIndex((g) => g.id === $activeGeneration?.selected_output.id)
		: -1;
	$: leftIndex = outputIndex > 0 ? outputIndex - 1 : -1;
	$: rightIndex = outputs && outputIndex < outputs?.length - 1 ? outputIndex + 1 : -1;

	function onMainSortViewChanged() {
		if (!$gallerySorts) return;
		gallerySorts.set([mainSortView, ...$gallerySorts.filter((i) => !mainSorts.includes(i))]);
	}

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
		if ((key === 'ArrowLeft' && leftIndex !== -1) || (key === 'ArrowRight' && rightIndex !== -1)) {
			setActiveGenerationToOutputIndex(outputs, key === 'ArrowLeft' ? leftIndex : rightIndex);
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

<GalleryLikePageWrapper>
	<GalleryLikeTitleSection title={$LL.Gallery.PageTitle()}>
		<div slot="view" class="w-full flex justify-end">
			<TabLikeDropdown
				name={$LL.Gallery.Sort.Title()}
				items={mainSortViews}
				bind:value={mainSortView}
				iconSet={IconMainSortView}
				class="flex-1 min-w-0 md:max-w-[15rem] z-50"
			/>
		</div>
		<div slot="search-and-filter" class="w-full">
			<SearchAndFilterBar
				type="gallery"
				bind:modelIdFilters={$galleryModelIdFilters}
				bind:searchString={$gallerySearchString}
				bind:usernameFilters={$galleryUsernameFilters}
				bind:aspectRatioFilters={$galleryAspectRatioFilters}
			/>
		</div>
	</GalleryLikeTitleSection>
	<GalleryLikeGridWrapper>
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
		{/if}
	</GalleryLikeGridWrapper>
</GalleryLikePageWrapper>

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
