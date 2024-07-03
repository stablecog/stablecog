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
		getAdminFullOutputsQueryKey,
		getAdminFullOutputsQueryProps,
		adminGalleryUsernameFilters
	} from '$routes/(app)/admin/gallery/constants';
	import type { TRequestNavigationEventParams } from '$routes/(app)/admin/gallery/types.js';
	import { canonicalUrl } from '$ts/constants/main';
	import { previewImageVersion } from '$ts/constants/previewImageVersion';
	import { isSuperAdmin } from '$ts/helpers/admin/roles';
	import {
		adminGalleryCurrentFilter,
		adminFullOutputsQueryKey,
		isAdminGalleryEditActive
	} from '$ts/stores/admin/gallery';
	import { hydrated, updateHydrated } from '$ts/stores/hydrated.js';
	import { userSummary } from '$ts/stores/user/summary';
	import { windowWidth } from '$ts/stores/window';
	import {
		activeGeneration,
		type TGalleryStatus,
		type TGenerationWithSelectedOutput
	} from '$userStores/generation';
	import { createInfiniteQuery, type CreateInfiniteQueryResult } from '@tanstack/svelte-query';
	import { onMount } from 'svelte';
	import { sessionStore } from '$ts/constants/supabase';
	import GenerationGridInfiniteWrapper from '$components/grids/GenerationGridInfiniteWrapper.svelte';
	import type { TGalleryFullOutputsPage } from '$ts/queries/galleryLike/types.js';

	export let data;

	if (!hydrated) {
		adminGalleryModelIdFilters.set(data.modelIdFilters);
		adminGalleryAspectRatioFilters.set(data.aspectRatioFilters);
		adminGalleryCurrentFilter.set(data.view);
		adminGallerySearchString.set(data.searchString);
		adminGalleryUsernameFilters.set(data.usernameFilters);
	}

	let totalOutputs: number;
	let searchInputIsFocused = false;
	let prevGeneration: TGenerationWithSelectedOutput | undefined = undefined;
	let nextGeneration: TGenerationWithSelectedOutput | undefined = undefined;

	let adminFullOutputsQuery:
		| CreateInfiniteQueryResult<TGalleryFullOutputsPage, unknown>
		| undefined;

	$: adminFullOutputsQueryKey.set(
		getAdminFullOutputsQueryKey({
			adminGalleryCurrentFilter: $adminGalleryCurrentFilter,
			searchString: $adminGallerySearchString,
			modelIdFilters: $adminGalleryModelIdFilters,
			aspectRatioFilters: $adminGalleryAspectRatioFilters,
			usernameFilters: $adminGalleryUsernameFilters
		})
	);

	$: adminFullOutputsQuery =
		browser && $sessionStore?.user.id
			? createInfiniteQuery(
					getAdminFullOutputsQueryProps({
						adminGalleryCurrentFilter: $adminGalleryCurrentFilter,
						session: $sessionStore,
						modelIdFilters: $adminGalleryModelIdFilters,
						aspectRatioFilters: $adminGalleryAspectRatioFilters,
						searchString: $adminGallerySearchString,
						usernameFilters: $adminGalleryUsernameFilters
					})
				)
			: undefined;

	$: $adminFullOutputsQuery?.data?.pages, onPagesChanged();

	$: outputs = $adminFullOutputsQuery?.data?.pages
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

	let adminGalleryFilters: { label: string; value: TGalleryStatus }[];
	let adminGallerySuperAdminFilters: { label: string; value: TGalleryStatus }[];
	$: adminGallerySuperAdminFilters = isSuperAdmin($userSummary?.roles)
		? [
				{
					label: $LL.Admin.Gallery.StatusDropdown.Private(),
					value: 'not_submitted'
				}
			]
		: ([] as { label: string; value: TGalleryStatus }[]);
	$: adminGalleryFilters = [
		{
			label: $LL.Admin.Gallery.StatusDropdown.SubmittedBest(),
			value: 'submitted_best'
		},
		{ label: $LL.Admin.Gallery.StatusDropdown.Submitted(), value: 'submitted' },
		{
			label: $LL.Admin.Gallery.StatusDropdown.WaitingForApproval(),
			value: 'waiting_for_approval'
		},
		{
			label: $LL.Admin.Gallery.StatusDropdown.ManuallySubmitted(),
			value: 'manually_submitted'
		},
		{ label: $LL.Admin.Gallery.StatusDropdown.Approved(), value: 'approved' },
		{ label: $LL.Admin.Gallery.StatusDropdown.Rejected(), value: 'rejected' },
		...adminGallerySuperAdminFilters
	];

	const onPagesChanged = () => {
		if (!$sessionStore?.user.id || !$adminFullOutputsQuery) return;
		if (!$adminFullOutputsQuery.data?.pages) return;
		for (let i = 0; i < $adminFullOutputsQuery.data.pages.length; i++) {
			let page = $adminFullOutputsQuery.data.pages[i];
			if (page.total !== undefined) {
				totalOutputs = page.total;
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
		const outputs = $adminFullOutputsQuery?.data?.pages
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
		<div class="flex w-full max-w-5xl flex-1 justify-center px-2 py-4 md:py-2">
			<div class="my-auto flex flex-col">
				<SignInCard redirectTo="/history" />
				<div class="h-[1vh] w-full" />
			</div>
		</div>
	{:else}
		<GalleryLikeTitleSection
			title={$LL.History.GenerationsTitle()}
			titleSecondary={`(${
				totalOutputs !== undefined ? totalOutputs.toLocaleString($locale) : '...'
			})`}
		>
			<div slot="view" class="flex w-full justify-end">
				<TabLikeDropdown
					class="min-w-0 flex-1 md:max-w-[15rem]"
					name="Filter"
					items={adminGalleryFilters}
					bind:value={$adminGalleryCurrentFilter}
				>
					<div slot="title" class="flex items-center justify-center p-3.5">
						<IconFunnel class="h-6 w-6 text-c-on-bg/35" />
					</div>
				</TabLikeDropdown>
			</div>
			<div slot="search-and-filter" class="relative z-40 w-full">
				<SearchAndFilterBar
					type="admin-gallery"
					bind:searchString={$adminGallerySearchString}
					bind:modelIdFilters={$adminGalleryModelIdFilters}
					bind:aspectRatioFilters={$adminGalleryAspectRatioFilters}
					bind:usernameFilters={$adminGalleryUsernameFilters}
					bind:searchInputIsFocused
				/>
			</div>
		</GalleryLikeTitleSection>
		<!-- Edit bar -->
		{#if $isAdminGalleryEditActive}
			<div
				class="sticky top-1 z-30 w-full max-w-3xl px-1 {$isAdminGalleryEditActive
					? 'mt-3'
					: 'mt-0'}"
			>
				<BatchEditBar type="admin-gallery" />
			</div>
		{/if}
		<GalleryLikeGridWrapper>
			{#if adminFullOutputsQuery === undefined || $adminFullOutputsQuery === undefined || $adminFullOutputsQuery.isInitialLoading}
				<div
					class="flex w-full flex-1 flex-col items-center justify-center px-4 py-6 text-center text-c-on-bg/60"
				>
					<IconAnimatedSpinner class="h-12 w-12" />
					<p class="mt-2 opacity-0">{$LL.Gallery.SearchingTitle()}</p>
					<div class="h-[2vh]" />
				</div>
			{:else if $adminFullOutputsQuery?.data?.pages?.length === 1 && $adminFullOutputsQuery.data.pages[0].outputs.length === 0}
				<div class="flex w-full flex-1 flex-col items-center px-5 py-8">
					<div class="my-auto flex flex-col items-center gap-2 text-center text-c-on-bg/50">
						<IconTick class="h-16 w-16" />
						<p>{$LL.Admin.Gallery.NoGenerationsToReview()}</p>
						<div class="h-[1vh]" />
					</div>
				</div>
			{:else if $adminFullOutputsQuery.isError}
				<div class="flex w-full flex-1 flex-col items-center px-5 py-8">
					<div class="my-auto flex flex-col items-center gap-2">
						<IconSadFace class="h-16 w-16 text-c-on-bg/50" />
						<p class="text-c-on-bg/50">{$LL.Error.SomethingWentWrong()}</p>
					</div>
				</div>
			{:else}
				<GenerationGridInfiniteWrapper
					key={$adminGallerySearchString +
						$adminGalleryModelIdFilters.join(',') +
						$adminGalleryAspectRatioFilters.join(',')}
				>
					<GenerationGridInfinite
						generationsQuery={adminFullOutputsQuery}
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
				</GenerationGridInfiniteWrapper>
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
