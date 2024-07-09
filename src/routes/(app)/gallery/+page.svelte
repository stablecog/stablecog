<script lang="ts">
	import { page } from '$app/stores';
	import GalleryLikeGridWrapper from '$components/galleryLike/GalleryLikeGridWrapper.svelte';
	import GalleryLikePageWrapper from '$components/galleryLike/GalleryLikePageWrapper.svelte';
	import GalleryLikeTitleSection from '$components/galleryLike/GalleryLikeTitleSection.svelte';
	import SearchAndFilterBar from '$components/galleryLike/SearchAndFilterBar.svelte';
	import GenerationFullScreen from '$components/generationFullScreen/GenerationFullScreen.svelte';
	import {
		lgBreakpoint,
		mdBreakpoint,
		xl2Breakpoint,
		xl3Breakpoint,
		xlBreakpoint
	} from '$components/generationFullScreen/constants';
	import GenerationGridInfinite from '$components/grids/GenerationGridInfinite.svelte';
	import GenerationGridInfiniteWrapper from '$components/grids/GenerationGridInfiniteWrapper.svelte';
	import IconAnimatedSpinner from '$components/icons/IconAnimatedSpinner.svelte';
	import IconDocumentSearch from '$components/icons/IconDocumentSearch.svelte';
	import IconMainSortView from '$components/icons/IconMainSortView.svelte';
	import IconSadFace from '$components/icons/IconSadFace.svelte';
	import IconSearch from '$components/icons/IconSearch.svelte';
	import TabLikeDropdown from '$components/primitives/tabBars/TabLikeDropdown.svelte';
	import MetaTag from '$components/utils/MetaTag.svelte';
	import LL, { locale } from '$i18n/i18n-svelte';
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
		type TGalleryMainSort
	} from '$routes/(app)/gallery/constants';
	import { getGalleryMeta, type TGalleryMeta } from '$routes/(app)/gallery/helpers.js';
	import { canonicalUrl } from '$ts/constants/main';
	import { sessionStore } from '$ts/constants/supabase';
	import { setActiveGenerationToOutputIndex } from '$ts/helpers/goToOutputIndex';
	import { logGalleryMainSortChanged } from '$ts/helpers/loggers.js';
	import { appVersion } from '$ts/stores/appVersion.js';
	import { globalSeed } from '$ts/stores/globalSeed';
	import { hydrated, updateHydrated } from '$ts/stores/hydrated.js';
	import { activeGeneration } from '$ts/stores/user/generation';
	import { galleryFullOutputsQueryKey } from '$ts/stores/user/queryKeys.js';
	import { userSummary } from '$ts/stores/user/summary.js';
	import { windowWidth } from '$ts/stores/window';
	import type { TTab } from '$ts/types/main.js';
	import { createInfiniteQuery } from '@tanstack/svelte-query';
	import { onMount } from 'svelte';
	import { quadOut } from 'svelte/easing';
	import { scale } from 'svelte/transition';

	export let data;

	let mounted = false;

	let galleryMeta: TGalleryMeta;
	$: galleryMeta = getGalleryMeta({
		searchString: data.searchString,
		modelIdFilters: data.modelIdFilters,
		usernameFilters: data.usernameFilters,
		aspectRatioFilters: data.aspectRatioFilters,
		sorts: data.sorts
	});

	if (!hydrated) {
		galleryModelIdFilters.set(data.modelIdFilters);
		galleryAspectRatioFilters.set(data.aspectRatioFilters);
		gallerySearchString.set(data.searchString);
		gallerySorts.set(data.sorts);
		galleryUsernameFilters.set(data.usernameFilters);
	}

	let mainSortView = $gallerySorts?.find((i) => mainSorts.includes(i)) ?? mainSortViewDefault;

	const getMainSorts = ($LL: TranslationFunctions): TTab<TGalleryMainSort>[] => [
		{
			value: 'new',
			label: $LL.Gallery.Sort.Options.New()
		},
		{
			value: 'trending',
			label: $LL.Gallery.Sort.Options.Trending()
		},
		{
			value: 'top',
			label: $LL.Gallery.Sort.Options.Top()
		}
	];

	let mainSortViews = getMainSorts($LL);
	$: mainSortViews = getMainSorts($LL);

	$: mainSortView, onMainSortViewChanged();

	$: galleryFullOutputsQueryKey.set(
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
		if (mounted) {
			logGalleryMainSortChanged({
				'SC - App Version': $appVersion,
				'SC - Locale': $locale,
				'SC - Main Sort': mainSortView,
				'SC - Stripe Product Id': $userSummary?.product_id,
				'SC - User Id': $sessionStore?.user.id
			});
		}
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
		mounted = true;
	});
</script>

<MetaTag
	title={galleryMeta.title}
	description={galleryMeta.description}
	image_url={data.previewImageUrl}
	canonical="{canonicalUrl}{$page.url.pathname}"
/>

<svelte:window on:keydown={onKeyDown} />

<GalleryLikePageWrapper>
	<GalleryLikeTitleSection title={$LL.Gallery.PageTitle()}>
		<div slot="view" class="flex w-full justify-end">
			<TabLikeDropdown
				name={$LL.Gallery.Sort.Title()}
				items={mainSortViews}
				bind:value={mainSortView}
				iconSet={IconMainSortView}
				disabled={$gallerySearchString !== '' &&
					$gallerySearchString !== undefined &&
					$gallerySearchString !== null}
				disabledText={$LL.Gallery.SearchResultsTitle()}
				disabledIcon={IconDocumentSearch}
				class="z-50 min-w-0 flex-1 md:max-w-[13rem]"
			/>
		</div>
		<div slot="search-and-filter" class="relative z-40 w-full">
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
		{#if $galleryGenerationFullOutputsQuery?.isLoading}
			<div
				class="flex w-full flex-1 flex-col items-center justify-center px-4 py-6 text-center text-c-on-bg/60"
			>
				<div
					in:scale={{
						duration: 200,
						easing: quadOut,
						opacity: 0,
						start: 0.5
					}}
					class="h-12 w-12"
				>
					<IconAnimatedSpinner class="h-full w-full" />
				</div>
				<p class="mt-2 opacity-0">
					{$LL.Gallery.SearchingTitle()}
				</p>
				<div class="h-[2vh]" />
			</div>
		{:else if $galleryGenerationFullOutputsQuery?.isError || ($galleryGenerationFullOutputsQuery?.data && !$galleryGenerationFullOutputsQuery?.data?.pages)}
			<div class="flex w-full flex-1 flex-col items-center px-5 py-8">
				<div class="my-auto flex flex-col items-center gap-2">
					<IconSadFace class="h-16 w-16 text-c-on-bg/50" />
					<p class="text-c-on-bg/50">{$LL.Error.SomethingWentWrong()}</p>
				</div>
			</div>
		{:else if $galleryGenerationFullOutputsQuery?.data?.pages.length === 1 && $galleryGenerationFullOutputsQuery.data.pages[0].outputs.length === 0}
			<div
				class="flex w-full flex-1 flex-col items-center justify-center px-4 py-6 text-center text-c-on-bg/60"
			>
				<div class="h-16 w-16">
					<IconSearch class="h-full w-full" />
				</div>
				<p class="mt-2">
					{$LL.Gallery.NoMatchingGenerationTitle()}
				</p>
				<div class="h-[2vh]" />
			</div>
		{:else if galleryGenerationFullOutputsQuery !== undefined && $windowWidth}
			<GenerationGridInfiniteWrapper
				key={$gallerySearchString +
					$galleryModelIdFilters.join(',') +
					$galleryAspectRatioFilters.join(',') +
					$galleryUsernameFilters.join(',')}
			>
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
			</GenerationGridInfiniteWrapper>
		{/if}
	</GalleryLikeGridWrapper>
</GalleryLikePageWrapper>

{#if $activeGeneration && $galleryGenerationFullOutputsQuery?.isLoading === false}
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
