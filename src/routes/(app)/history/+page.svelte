<script lang="ts">
	import { page } from '$app/stores';
	import SignInCard from '$components/cards/SignInCard.svelte';
	import BatchEditBar from '$components/galleryLike/BatchEditBar.svelte';
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
	import IconHeartOutlined from '$components/icons/IconHeartOutlined.svelte';
	import IconImage from '$components/icons/IconImage.svelte';
	import IconSadFace from '$components/icons/IconSadFace.svelte';
	import IconStarOutlined from '$components/icons/IconStarOutlined.svelte';
	import IconUserGalleryFilterSet from '$components/icons/IconUserGalleryFilterSet.svelte';
	import Button from '$components/primitives/buttons/Button.svelte';
	import TabLikeDropdown from '$components/primitives/tabBars/TabLikeDropdown.svelte';
	import MetaTag from '$components/utils/MetaTag.svelte';
	import LL, { locale } from '$i18n/i18n-svelte';
	import {
		getHistoryInfiniteQueryKey,
		getHistoryInfiniteQueryProps,
		userGallerySearchString
	} from '$routes/(app)/history/constants';
	import { canonicalUrl } from '$ts/constants/main';
	import { previewImageVersion } from '$ts/constants/previewImageVersion';
	import { sessionStore } from '$ts/constants/supabase';
	import { setActiveGenerationToOutputIndex } from '$ts/helpers/goToOutputIndex';
	import { logBatchEditActived, logBatchEditDeactivated } from '$ts/helpers/loggers';
	import type { TUserGenerationFullOutputsPage } from '$ts/queries/userGenerations';
	import { appVersion } from '$ts/stores/appVersion';
	import { hydrated, updateHydrated } from '$ts/stores/hydrated.js';
	import { searchParamsString } from '$ts/stores/searchParamsString';
	import {
		isUserGalleryEditActive,
		userGalleryAspectRatioFilters,
		userGalleryCurrentView,
		userGalleryModelIdFilters,
		type TUserGalleryView
	} from '$ts/stores/user/gallery';
	import { userGenerationFullOutputsQueryKey } from '$ts/stores/user/queryKeys';
	import { userSummary } from '$ts/stores/user/summary';
	import { windowWidth } from '$ts/stores/window';
	import type { TTab } from '$ts/types/main';
	import { activeGeneration } from '$userStores/generation';
	import { createInfiniteQuery, type CreateInfiniteQueryResult } from '@tanstack/svelte-query';
	import { onMount } from 'svelte';

	export let data;

	let totalOutputs: number;

	let userGenerationFullOutputsQuery:
		| CreateInfiniteQueryResult<TUserGenerationFullOutputsPage, unknown>
		| undefined;

	let searchInputIsFocused = false;

	if (!hydrated) {
		userGalleryCurrentView.set(data.view);
		userGalleryModelIdFilters.set(data.modelIdFilters);
		userGalleryAspectRatioFilters.set(data.aspectRatioFilters);
		userGallerySearchString.set(data.searchString);
	}

	$: userGenerationFullOutputsQueryKey.set(
		getHistoryInfiniteQueryKey({
			userGalleryCurrentView: $userGalleryCurrentView,
			searchString: $userGallerySearchString,
			modelIdFilters: $userGalleryModelIdFilters,
			aspectRatioFilters: $userGalleryAspectRatioFilters
		})
	);

	$: userGenerationFullOutputsQuery =
		$sessionStore?.user.id && $userSummary
			? createInfiniteQuery(
					getHistoryInfiniteQueryProps({
						userGalleryCurrentView: $userGalleryCurrentView,
						searchString: $userGallerySearchString,
						modelIdFilters: $userGalleryModelIdFilters,
						aspectRatioFilters: $userGalleryAspectRatioFilters,
						session: $sessionStore
					})
				)
			: undefined;

	$: $userGenerationFullOutputsQuery?.data?.pages, onPagesChanged();

	const getUserGalleryTabs = ($LL: TranslationFunctions): TTab<TUserGalleryView>[] => [
		{
			label: $LL.History.Views.AllTitle(),
			value: 'all'
		},
		{
			label: $LL.History.Views.FavoritesTitle(),
			value: 'favorites'
		},
		{
			label: $LL.History.Views.LikesTitle(),
			value: 'likes'
		}
	];

	let userGalleryTabs = getUserGalleryTabs($LL);
	$: userGalleryTabs = getUserGalleryTabs($LL);

	let userGalleryEditActivatedOnce = false;
	$: $isUserGalleryEditActive, onUserGalleryEditActiveChanged();

	$: outputs = $userGenerationFullOutputsQuery?.data?.pages
		.flatMap((page) => page.outputs)
		.filter((i) => i !== undefined);
	$: outputIndex = outputs
		? outputs.findIndex((g) => g.id === $activeGeneration?.selected_output.id)
		: -1;
	$: leftIndex = outputIndex > 0 ? outputIndex - 1 : -1;
	$: rightIndex = outputs && outputIndex < outputs?.length - 1 ? outputIndex + 1 : -1;

	function onUserGalleryEditActiveChanged() {
		if (!userGalleryEditActivatedOnce && !$isUserGalleryEditActive) return;
		const props = {
			'SC - Locale': $locale,
			'SC - Page': `${$page.url.pathname}${$page.url.search}`,
			'SC - User Id': $sessionStore?.user.id,
			'SC - Stripe Product Id': $userSummary?.product_id,
			'SC - App Version': $appVersion
		};
		if ($isUserGalleryEditActive) {
			logBatchEditActived(props);
			userGalleryEditActivatedOnce = true;
		} else {
			logBatchEditDeactivated(props);
		}
	}

	const onPagesChanged = () => {
		if (!$sessionStore?.user.id || !$userGenerationFullOutputsQuery) return;
		if (!$userGenerationFullOutputsQuery.data?.pages) return;
		for (let i = 0; i < $userGenerationFullOutputsQuery.data.pages.length; i++) {
			let page = $userGenerationFullOutputsQuery.data.pages[i];
			if (page.total_count !== undefined) {
				totalOutputs = page.total_count;
			}
		}
	};

	function onKeyDown({ key }: KeyboardEvent) {
		if (
			key === 'e' &&
			document?.activeElement?.tagName !== 'INPUT' &&
			document?.activeElement?.tagName !== 'TEXTAREA' &&
			!$activeGeneration
		) {
			if ($userGalleryCurrentView === 'likes') return;
			isUserGalleryEditActive.set(!$isUserGalleryEditActive);
			return;
		}
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

	$: $userGalleryCurrentView, onUserGalleryCurrentViewChanged();

	function onUserGalleryCurrentViewChanged() {
		if ($userGalleryCurrentView === 'likes') {
			isUserGalleryEditActive.set(false);
		}
	}

	onMount(() => {
		updateHydrated();
	});
</script>

<MetaTag
	title="History | Stablecog"
	description="See your generation history on Stablecog. Free, multilingual and open-source AI image generator using Stable Diffusion and Kandinsky."
	image_url="{canonicalUrl}/previews{$page.url.pathname}-{previewImageVersion}.png"
/>

<svelte:window on:keydown={onKeyDown} />

<GalleryLikePageWrapper>
	{#if !$sessionStore?.user.id || !$userSummary}
		<div class="flex w-full max-w-7xl flex-1 justify-center px-2 py-4 md:px-8 md:py-2">
			<div class="my-auto flex flex-col">
				<SignInCard redirectTo={'/history' + $searchParamsString} />
				<div class="h-[1vh] w-full" />
			</div>
		</div>
	{:else}
		<GalleryLikeTitleSection
			title={$userGalleryCurrentView === 'favorites'
				? $LL.History.Views.FavoritesTitle()
				: $userGalleryCurrentView === 'likes'
					? $LL.History.Views.LikesTitle()
					: $LL.History.GenerationsTitle()}
			titleSecondary={`(${
				totalOutputs !== undefined ? totalOutputs.toLocaleString($locale) : '...'
			})`}
		>
			<div slot="view" class="flex w-full justify-end">
				<TabLikeDropdown
					name="Filters"
					items={userGalleryTabs}
					bind:value={$userGalleryCurrentView}
					iconSet={IconUserGalleryFilterSet}
					class="z-50 min-w-0 flex-1 md:max-w-[13rem]"
				/>
			</div>
			<div slot="search-and-filter" class="relative z-40 w-full">
				<SearchAndFilterBar
					bind:searchString={$userGallerySearchString}
					bind:modelIdFilters={$userGalleryModelIdFilters}
					bind:aspectRatioFilters={$userGalleryAspectRatioFilters}
					bind:searchInputIsFocused
				/>
			</div>
		</GalleryLikeTitleSection>
		{#if $isUserGalleryEditActive}
			<div
				class="sticky top-1 z-30 w-full max-w-3xl px-1 {$isUserGalleryEditActive ? 'mt-3' : 'mt-0'}"
			>
				<BatchEditBar type="history" />
			</div>
		{/if}
		<GalleryLikeGridWrapper>
			{#if userGenerationFullOutputsQuery !== undefined}
				{#if $userGenerationFullOutputsQuery?.isError || ($userGenerationFullOutputsQuery?.data && !$userGenerationFullOutputsQuery?.data?.pages)}
					<div class="flex w-full flex-1 flex-col items-center px-5 py-8">
						<div class="my-auto flex flex-col items-center gap-2">
							<IconSadFace class="h-16 w-16 text-c-on-bg/50" />
							<p class="text-c-on-bg/50">{$LL.Error.SomethingWentWrong()}</p>
						</div>
					</div>
				{:else if $userGenerationFullOutputsQuery?.data?.pages.length === 1 && $userGenerationFullOutputsQuery.data.pages[0].outputs.length === 0}
					<div class="flex w-full flex-1 flex-col items-center px-5 py-8">
						<div class="my-auto flex flex-col items-center gap-6">
							<div class="-mb-3 flex items-center justify-center">
								{#if $userGalleryCurrentView === 'likes'}
									<IconHeartOutlined class="h-16 w-16 text-c-on-bg/50" />
								{:else if $userGalleryCurrentView === 'favorites'}
									<IconStarOutlined class="h-16 w-16 text-c-on-bg/50" />
								{:else}
									<IconImage class="h-16 w-16 text-c-on-bg/50" />
								{/if}
							</div>
							<p class="text-center text-c-on-bg/50">
								{$userGalleryCurrentView === 'likes'
									? $LL.History.NoLikesYet()
									: $userGalleryCurrentView === 'favorites'
										? $LL.History.NoFavoritesYet()
										: $LL.History.NoGenerationsYet()}
							</p>
							{#if $userGalleryCurrentView === 'all'}
								<Button href="/generate">{$LL.Shared.StartGeneratingButton()}</Button>
							{/if}
							<div class="h-[1vh]" />
						</div>
					</div>
				{:else if $windowWidth}
					{#key $userGalleryCurrentView}
						<GenerationGridInfiniteWrapper
							key={$userGallerySearchString +
								$userGalleryModelIdFilters.join(',') +
								$userGalleryAspectRatioFilters.join(',')}
						>
							<GenerationGridInfinite
								generationsQuery={userGenerationFullOutputsQuery}
								cardType="history"
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
							/>
						</GenerationGridInfiniteWrapper>
					{/key}
				{/if}
			{/if}
		</GalleryLikeGridWrapper>
	{/if}
</GalleryLikePageWrapper>

{#if $activeGeneration}
	<GenerationFullScreen
		onLeftButtonClicked={leftIndex !== -1
			? () => setActiveGenerationToOutputIndex(outputs, leftIndex)
			: undefined}
		onRightButtonClicked={rightIndex !== -1
			? () => setActiveGenerationToOutputIndex(outputs, rightIndex)
			: undefined}
		generation={$activeGeneration}
		modalType="history"
	/>
{/if}
