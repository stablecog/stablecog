<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import BatchEditBar from '$components/galleryLike/BatchEditBar.svelte';
	import GalleryLikeGridWrapper from '$components/galleryLike/GalleryLikeGridWrapper.svelte';
	import GalleryLikePageWrapper from '$components/galleryLike/GalleryLikePageWrapper.svelte';
	import GalleryLikeTitleSection from '$components/galleryLike/GalleryLikeTitleSection.svelte';
	import {
		lgBreakpoint,
		mdBreakpoint,
		xl2Breakpoint,
		xl3Breakpoint,
		xlBreakpoint
	} from '$components/generationFullScreen/constants';
	import GenerationFullScreen from '$components/generationFullScreen/GenerationFullScreen.svelte';
	import GenerationGridInfinite from '$components/grids/GenerationGridInfinite.svelte';
	import IconAnimatedSpinner from '$components/icons/IconAnimatedSpinner.svelte';
	import IconFunnel from '$components/icons/IconFunnel.svelte';
	import IconSadFace from '$components/icons/IconSadFace.svelte';
	import IconTick from '$components/icons/IconTick.svelte';
	import MetaTag from '$components/utils/MetaTag.svelte';
	import SearchAndFilterBar from '$components/galleryLike/SearchAndFilterBar.svelte';
	import SignInCard from '$components/cards/SignInCard.svelte';
	import TabLikeDropdown from '$components/primitives/tabBars/TabLikeDropdown.svelte';
	import LL, { locale } from '$i18n/i18n-svelte';
	import {
		adminGalleryModelIdFilters,
		adminGalleryAspectRatioFilters,
		adminGallerySearchString,
		getAllUserGenerationFullOutputsQueryKey,
		getAllUserGenerationFullOutputsQueryProps
	} from '$routes/(app)/admin/gallery/constants';
	import type { TRequestNavigationEventParams } from '$routes/(app)/admin/gallery/types.js';
	import { canonicalUrl } from '$ts/constants/main';
	import { previewImageVersion } from '$ts/constants/previewImageVersion';
	import { isSuperAdmin } from '$ts/helpers/admin/roles';
	import { setUrlParam } from '$ts/helpers/setUrlParam.js';
	import type { TUserGenerationFullOutputsPage } from '$ts/queries/userGenerations';
	import {
		adminGalleryCurrentFilter,
		adminGalleryCurrentFilterDefault,
		allUserGenerationFullOutputsQueryKey,
		isAdminGalleryEditActive
	} from '$ts/stores/admin/gallery';
	import { hydrated, updateHydrated } from '$ts/stores/hydrated.js';
	import { userSummary } from '$ts/stores/user/summary';
	import { windowWidth } from '$ts/stores/window';
	import { activeGeneration, type TGenerationWithSelectedOutput } from '$userStores/generation';
	import { createInfiniteQuery, type CreateInfiniteQueryResult } from '@tanstack/svelte-query';
	import { onMount } from 'svelte';
	import { sessionStore } from '$ts/constants/supabase';

	export let data;

	if (!hydrated) {
		adminGalleryModelIdFilters.set(data.modelIdFilters);
		adminGalleryAspectRatioFilters.set(data.aspectRatioFilters);
		adminGalleryCurrentFilter.set(data.view);
		adminGallerySearchString.set(data.searchString);
	}

	let totalOutputs: number;
	let searchInputIsFocused = false;
	let prevGeneration: TGenerationWithSelectedOutput | undefined = undefined;
	let nextGeneration: TGenerationWithSelectedOutput | undefined = undefined;

	let allUserGenerationFullOutputsQuery:
		| CreateInfiniteQueryResult<TUserGenerationFullOutputsPage, unknown>
		| undefined;

	$: allUserGenerationFullOutputsQueryKey.set(
		getAllUserGenerationFullOutputsQueryKey({
			adminGalleryCurrentFilter: $adminGalleryCurrentFilter,
			searchString: $adminGallerySearchString,
			modelIdFilters: $adminGalleryModelIdFilters,
			aspectRatioFilters: $adminGalleryAspectRatioFilters
		})
	);

	$: allUserGenerationFullOutputsQuery =
		browser && $sessionStore?.user.id
			? createInfiniteQuery(
					getAllUserGenerationFullOutputsQueryProps({
						adminGalleryCurrentFilter: $adminGalleryCurrentFilter,
						session: $sessionStore,
						modelIdFilters: $adminGalleryModelIdFilters,
						aspectRatioFilters: $adminGalleryAspectRatioFilters,
						searchString: $adminGallerySearchString
					})
			  )
			: undefined;

	$: $allUserGenerationFullOutputsQuery?.data?.pages, onPagesChanged();

	$: outputs = $allUserGenerationFullOutputsQuery?.data?.pages
		.flatMap((page) => page.outputs)
		.filter((i) => i !== undefined);
	$: outputIndex = outputs
		? outputs.findIndex((g) => g.id === $activeGeneration?.selected_output.id)
		: -1;
	$: leftIndex = outputIndex > 0 ? outputIndex - 1 : -1;
	$: rightIndex = outputs && outputIndex < outputs?.length - 1 ? outputIndex + 1 : -1;
	$: prevGeneration =
		outputs && leftIndex !== -1
			? { ...outputs[leftIndex].generation, selected_output: outputs[leftIndex] }
			: undefined;
	$: nextGeneration =
		outputs && rightIndex !== -1
			? { ...outputs[rightIndex].generation, selected_output: outputs[rightIndex] }
			: undefined;

	const onPagesChanged = () => {
		if (!$sessionStore?.user.id || !$allUserGenerationFullOutputsQuery) return;
		if (!$allUserGenerationFullOutputsQuery.data?.pages) return;
		for (let i = 0; i < $allUserGenerationFullOutputsQuery.data.pages.length; i++) {
			let page = $allUserGenerationFullOutputsQuery.data.pages[i];
			if (page.total_count !== undefined) {
				totalOutputs = page.total_count;
			}
		}
	};

	function onKeyDown({ key }: KeyboardEvent) {
		if (key === 'e' && !searchInputIsFocused) {
			isAdminGalleryEditActive.set(!$isAdminGalleryEditActive);
			return;
		}
		if (!$activeGeneration) return;
		if (key === 'Escape') {
			activeGeneration.set(undefined);
			window.history.back();
			return;
		}
		if ((key === 'ArrowLeft' || key === 'a') && leftIndex !== -1) {
			goToSide('left');
			return;
		}
		if ((key === 'ArrowRight' || key === 'd') && rightIndex !== -1) {
			goToSide('right');
			return;
		}
	}

	function onRequestNavigation(e: CustomEvent<TRequestNavigationEventParams>) {
		const { direction } = e.detail;
		if (direction === 'left' && leftIndex !== -1) {
			goToSide('left');
			return;
		}
		if (direction === 'right' && rightIndex !== -1) {
			goToSide('right');
			return;
		}
	}

	function goToSide(side: 'left' | 'right') {
		const outputs = $allUserGenerationFullOutputsQuery?.data?.pages
			.flatMap((page) => page.outputs)
			.filter((i) => i !== undefined);
		if (!outputs) return;
		const index = outputs.findIndex((g) => g.id === $activeGeneration?.selected_output.id);
		if (index === -1) return;
		const addition = side === 'left' ? -1 : 1;
		const newIndex = (index + addition + outputs.length) % outputs.length;
		activeGeneration.set({
			...outputs[newIndex].generation,
			selected_output: outputs[newIndex]
		});
	}

	$: $adminGalleryCurrentFilter,
		setUrlParam({
			key: 'view',
			value: $adminGalleryCurrentFilter,
			defaultValue: adminGalleryCurrentFilterDefault
		});

	onMount(() => {
		updateHydrated();
	});
</script>

<MetaTag
	title="Gallery | Stablecog"
	description="Stablecog admin panel. Free, multilingual and open-source AI image generator using Stable Diffusion and Kandinsky."
	image_url="{canonicalUrl}/previews{$page.url.pathname}-{previewImageVersion}.png"
/>

<svelte:window on:keydown={onKeyDown} />

<GalleryLikePageWrapper>
	{#if !$sessionStore?.user.id}
		<div class="w-full flex-1 max-w-5xl flex justify-center px-2 py-4 md:py-2">
			<div class="my-auto flex flex-col">
				<SignInCard redirectTo="/history" />
				<div class="w-full h-[1vh]" />
			</div>
		</div>
	{:else}
		<GalleryLikeTitleSection
			title={$LL.History.GenerationsTitle()}
			titleSecondary={`(${
				totalOutputs !== undefined ? totalOutputs.toLocaleString($locale) : '...'
			})`}
		>
			<div slot="view" class="w-full flex justify-end">
				<TabLikeDropdown
					class="flex-1 min-w-0 md:max-w-[15rem]"
					name="Filter"
					items={[
						{
							label: $LL.Admin.Gallery.StatusDropdown.SubmittedBest(),
							value: 'submitted_best'
						},
						{ label: $LL.Admin.Gallery.StatusDropdown.Submitted(), value: 'submitted' },
						{
							label: $LL.Admin.Gallery.StatusDropdown.ManuallySubmitted(),
							value: 'manually_submitted'
						},
						{ label: $LL.Admin.Gallery.StatusDropdown.Approved(), value: 'approved' },
						{ label: $LL.Admin.Gallery.StatusDropdown.Rejected(), value: 'rejected' },
						...(isSuperAdmin($userSummary?.roles || [])
							? [
									{
										label: $LL.Admin.Gallery.StatusDropdown.Private(),
										value: 'not_submitted'
									}
							  ]
							: [])
					]}
					bind:value={$adminGalleryCurrentFilter}
				>
					<div slot="title" class="p-3.5 flex items-center justify-center">
						<IconFunnel class="w-6 h-6 text-c-on-bg/35" />
					</div>
				</TabLikeDropdown>
			</div>
			<div slot="search-and-filter" class="w-full">
				<SearchAndFilterBar
					bind:searchString={$adminGallerySearchString}
					bind:modelIdFilters={$adminGalleryModelIdFilters}
					bind:aspectRatioFilters={$adminGalleryAspectRatioFilters}
					bind:searchInputIsFocused
				/>
			</div>
		</GalleryLikeTitleSection>
		<!-- Edit bar -->
		<div
			class="w-full flex flex-col items-center justify-start px-1 sticky top-1 z-30 {$isAdminGalleryEditActive
				? 'mt-3'
				: 'mt-0'}"
		>
			<div class="w-full max-w-3xl">
				{#if $isAdminGalleryEditActive}
					<BatchEditBar type="admin-gallery" />
				{/if}
			</div>
		</div>
		<GalleryLikeGridWrapper>
			{#if allUserGenerationFullOutputsQuery === undefined || $allUserGenerationFullOutputsQuery === undefined || $allUserGenerationFullOutputsQuery.isInitialLoading}
				<div
					class="w-full flex flex-col text-c-on-bg/60 flex-1 py-6 px-4 justify-center items-center text-center"
				>
					<IconAnimatedSpinner class="w-12 h-12" />
					<p class="mt-2 opacity-0">{$LL.Gallery.SearchingTitle()}</p>
					<div class="h-[2vh]" />
				</div>
			{:else if $allUserGenerationFullOutputsQuery?.data?.pages?.length === 1 && $allUserGenerationFullOutputsQuery.data.pages[0].outputs.length === 0}
				<div class="w-full flex-1 flex flex-col items-center py-8 px-5">
					<div class="flex flex-col my-auto items-center gap-2 text-c-on-bg/50 text-center">
						<IconTick class="w-16 h-16" />
						<p>{$LL.Admin.Gallery.NoGenerationsToReview()}</p>
						<div class="h-[1vh]" />
					</div>
				</div>
			{:else if $allUserGenerationFullOutputsQuery.isError}
				<div class="w-full flex-1 flex flex-col items-center py-8 px-5">
					<div class="flex flex-col my-auto items-center gap-2">
						<IconSadFace class="w-16 h-16 text-c-on-bg/50" />
						<p class="text-c-on-bg/50">{$LL.Error.SomethingWentWrong()}</p>
					</div>
				</div>
			{:else}
				<GenerationGridInfinite
					generationsQuery={allUserGenerationFullOutputsQuery}
					cardType="admin-gallery"
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
			{/if}
		</GalleryLikeGridWrapper>
	{/if}
</GalleryLikePageWrapper>

{#if $activeGeneration}
	<GenerationFullScreen
		onLeftButtonClicked={leftIndex !== -1 ? () => goToSide('left') : undefined}
		onRightButtonClicked={rightIndex !== -1 ? () => goToSide('right') : undefined}
		generation={$activeGeneration}
		{prevGeneration}
		{nextGeneration}
		modalType="admin-gallery"
		outputsLength={outputs?.length}
		{outputIndex}
		on:requestNavigation={onRequestNavigation}
	/>
{/if}
