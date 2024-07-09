<script lang="ts">
	import { browser } from '$app/environment';
	import GenerateGridPlaceholder from '$components/generate/GenerateGridPlaceholder.svelte';
	import { mdBreakpoint } from '$components/generationFullScreen/constants';
	import type { TGenerationImageCardType } from '$components/generationImage/types';
	import GridCard from '$components/grids/GridCard.svelte';
	import { gridScrollPositions } from '$components/grids/scrollPosition';
	import IconAnimatedSpinner from '$components/icons/IconAnimatedSpinner.svelte';
	import IconArrowRight from '$components/icons/IconArrowRight.svelte';
	import ButtonHoverEffect from '$components/primitives/buttons/ButtonHoverEffect.svelte';
	import LL from '$i18n/i18n-svelte';
	import { removeRepeatingOutputs } from '$ts/helpers/removeRepeatingOutputs';
	import type { TGalleryFullOutputsPage } from '$ts/queries/galleryLike/types';
	import {
		adminGalleryActionableItems,
		adminGalleryCurrentFilter,
		isAdminGalleryEditActive
	} from '$ts/stores/admin/gallery';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import { loadedImages } from '$ts/stores/loadedImages';
	import {
		isUserGalleryEditActive,
		userGalleryActionableItems,
		userGalleryCurrentView
	} from '$ts/stores/user/gallery';
	import type { TGenerationFullOutput } from '$ts/stores/user/generation';
	import { windowHeight, windowWidth } from '$ts/stores/window';
	import type { CreateInfiniteQueryResult, InfiniteData } from '@tanstack/svelte-query';
	import {
		createVirtualizer,
		createWindowVirtualizer,
		type SvelteVirtualizer
	} from '@tanstack/svelte-virtual';
	import { onMount, tick } from 'svelte';
	import { quadOut } from 'svelte/easing';
	import type { Readable } from 'svelte/store';
	import { scale } from 'svelte/transition';

	export let generationsQuery:
		| CreateInfiniteQueryResult<InfiniteData<TGalleryFullOutputsPage, unknown>, unknown>
		| undefined;
	export let hasGridScrollContainer = false;
	export let gridScrollContainer: HTMLDivElement | undefined = undefined;
	export let gridScrollContainerHeight: number | undefined = undefined;
	export let gridScrollContainerWidth: number | undefined = undefined;
	export let pinnedFullOutputs: TGenerationFullOutput[] | undefined = undefined;
	export let cardType: TGenerationImageCardType;
	export let noLoadingSpinnerAlignmentAdjustment = false;
	export let hasPlaceholder = false;
	export let cols = 6;
	export let paddingLeft = 0;
	export let paddingRight = 0;
	export let paddingTop = 0;
	export let paddingBottom = 0;
	export let setSearchQuery: ((query: string) => void) | undefined = undefined;
	export let hasExtraPadding = false;

	$: horizontalPadding = paddingLeft + paddingRight;
	let isInitialScrollPositionSet = false;
	let mounted = false;
	let gridVirtualizer:
		| Readable<SvelteVirtualizer<HTMLDivElement, Element>>
		| Readable<SvelteVirtualizer<Window, Element>>
		| undefined;

	let extraHeight = 0;

	$: onlyOutputs = $generationsQuery?.data?.pages
		.flatMap((page) => page.outputs)
		.filter((i) => i !== undefined);
	let outputs: TGenerationFullOutput[] | undefined = undefined;
	$: [onlyOutputs, pinnedFullOutputs], setOutputs();

	function setOutputs() {
		if (!onlyOutputs) {
			outputs = undefined;
			return;
		}
		if (!pinnedFullOutputs) {
			outputs = [...onlyOutputs];
			return;
		}
		outputs = removeRepeatingOutputs({ outputsPinned: pinnedFullOutputs, outputs: onlyOutputs });
	}

	$: selectedItems =
		cardType === 'history' && $isUserGalleryEditActive
			? $userGalleryActionableItems
					.filter((i) => i.view === $userGalleryCurrentView)
					.map((i) => i.output_id)
			: cardType === 'admin-gallery' && $isAdminGalleryEditActive
				? $adminGalleryActionableItems
						.filter((i) => i.filter === $adminGalleryCurrentFilter)
						.map((i) => i.output_id)
				: [];

	$: isHoverAllowed =
		(cardType === 'history' && $isUserGalleryEditActive) ||
		(cardType === 'admin-gallery' && $isAdminGalleryEditActive);

	$: isGalleryEditActive =
		(cardType === 'admin-gallery' && $isAdminGalleryEditActive) ||
		(cardType === 'history' && $isUserGalleryEditActive);

	const defaultAspectRatio = 1;
	$: extraHeightForInfo =
		cardType === 'gallery' || cardType === 'admin-gallery'
			? $windowWidth < mdBreakpoint
				? 73
				: 82
			: 0;

	$: estimatedItemWidth = hasGridScrollContainer
		? gridScrollContainer && gridScrollContainerWidth
			? (gridScrollContainerWidth - horizontalPadding) / cols
			: undefined
		: $windowWidth
			? ($windowWidth - horizontalPadding) / cols
			: undefined;
	$: estimatedItemHeight = estimatedItemWidth
		? estimatedItemWidth * (1 / defaultAspectRatio) + extraHeightForInfo
		: undefined;
	$: estimatedItemCountInAWindow =
		estimatedItemWidth && estimatedItemHeight
			? hasGridScrollContainer
				? gridScrollContainer && gridScrollContainerHeight
					? ((gridScrollContainerHeight || $windowHeight) / estimatedItemHeight) * cols
					: undefined
				: $windowHeight
					? ($windowHeight / estimatedItemHeight) * cols
					: undefined
			: undefined;

	$: overscanCount = estimatedItemCountInAWindow
		? Math.round(estimatedItemCountInAWindow * 1.5)
		: undefined;

	const overscanMultiplierForGettingNextPage = 0.5;

	$: [
		gridScrollContainer,
		gridScrollContainerWidth,
		gridScrollContainerHeight,
		outputs,
		overscanCount,
		$windowWidth,
		$windowHeight
	],
		initiallySetGridVirtualizer();
	$: $gridVirtualizer, onGridVirtualizerChanged();
	$: [outputs, overscanCount, cols], onParamsChanged();
	$: cardWidth = browser ? ($windowWidth - horizontalPadding) / cols : undefined;

	async function onGridVirtualizerChanged() {
		if (!$gridVirtualizer || $gridVirtualizer.scrollOffset === null) return;
		const href = window.location.href;
		if (isInitialScrollPositionSet && mounted) {
			gridScrollPositions.set(href, $gridVirtualizer.scrollOffset);
		}
		if (!isInitialScrollPositionSet && !$gridVirtualizer.isScrolling && mounted) {
			const position = gridScrollPositions.get(href);
			if (position) {
				$gridVirtualizer.scrollToOffset(position, { behavior: 'auto' });
			}
			isInitialScrollPositionSet = true;
		}
		if (
			!outputs ||
			!$generationsQuery ||
			!$generationsQuery.hasNextPage ||
			$generationsQuery.isFetchingNextPage ||
			overscanCount === undefined
		)
			return;
		const items = $gridVirtualizer.getVirtualItems();
		if (!items || items.length < 1) return;
		const lastItemIndex = items[items.length - 1].index;
		const shouldGetNextPage =
			lastItemIndex + overscanCount * overscanMultiplierForGettingNextPage >= outputs.length - 1;
		if (!shouldGetNextPage) return;
		$generationsQuery.fetchNextPage();
	}

	let measureTimeout: NodeJS.Timeout | undefined = undefined;
	let measureTimeoutDelay = 20;

	let lastMeasuredFirstItemId: string | undefined = undefined;

	let now = Date.now();

	async function onParamsChanged() {
		if (!$gridVirtualizer) return;
		let optionsToSet: { [key: string]: string | number } = {};
		const prevOverscan = $gridVirtualizer.options.overscan;
		if (outputs) {
			optionsToSet.count = outputs.length;
		}
		if (overscanCount) {
			optionsToSet.overscan = overscanCount;
		}
		if (cols) {
			optionsToSet.lanes = cols;
		}
		if (Object.keys(optionsToSet).length > 0) {
			$gridVirtualizer.setOptions(optionsToSet);
		}
		if (
			prevOverscan !== overscanCount ||
			(outputs && outputs.length > 0 && outputs[0].id !== lastMeasuredFirstItemId)
		) {
			if (measureTimeout) clearTimeout(measureTimeout);
			measureTimeout = setTimeout(async () => {
				await tick();
				$gridVirtualizer?.measure();
				if (outputs && outputs.length > 0) lastMeasuredFirstItemId = outputs[0].id;
			}, measureTimeoutDelay);
		}
	}

	function initiallySetGridVirtualizer() {
		if ($gridVirtualizer || outputs === undefined || overscanCount === undefined) return;
		if (hasGridScrollContainer && !gridScrollContainer) return;
		if (hasGridScrollContainer && !gridScrollContainerWidth) return;
		const params = {
			count: outputs.length,
			overscan: overscanCount,
			lanes: cols,
			paddingStart: paddingTop,
			paddingEnd: paddingBottom
		};
		gridVirtualizer = hasGridScrollContainer
			? createVirtualizer({
					...params,
					getScrollElement: () => gridScrollContainer as HTMLDivElement,
					estimateSize: (i) => {
						const width = ((gridScrollContainerWidth as number) - horizontalPadding) / cols;
						const height = (width * outputs![i].generation.height) / outputs![i].generation.width;
						return height;
					}
				})
			: createWindowVirtualizer({
					...params,
					estimateSize: (i) => {
						const width = (window.innerWidth - horizontalPadding) / cols;
						const height = (width * outputs![i].generation.height) / outputs![i].generation.width;
						return height;
					}
				});
	}

	onMount(() => {
		mounted = true;
	});
</script>

{#if $generationsQuery?.isLoading}
	<div
		class="flex h-full w-full flex-1 flex-col items-center justify-center px-4 py-6 text-center text-c-on-bg/60"
	>
		<IconAnimatedSpinner class="h-12 w-12" />
		<p class="mt-2 opacity-0">{$LL.Gallery.SearchingTitle()}</p>
		<div class="h-[2vh] {noLoadingSpinnerAlignmentAdjustment ? 'hidden' : ''}" />
	</div>
{:else if hasPlaceholder && $generationsQuery?.isSuccess && outputs !== undefined && outputs.length === 0}
	<GenerateGridPlaceholder text={$LL.Generate.Grid.NoGeneration.Paragraph()} />
{:else if $generationsQuery?.isSuccess && $generationsQuery.data.pages.length > 0 && outputs !== undefined}
	{#if $gridVirtualizer}
		{@const showScrollToTopChevron =
			$gridVirtualizer &&
			$gridVirtualizer.scrollOffset !== null &&
			($gridVirtualizer.scrollOffset > $windowHeight * 2 ||
				$gridVirtualizer.scrollOffset > $gridVirtualizer.getTotalSize() - $windowHeight)}
		{@const isGridLongEnoughForScrollToTopChevron =
			$gridVirtualizer && $gridVirtualizer.getTotalSize() > $windowHeight * 1.5}
		<div class="relative w-full">
			<div
				style="height: {$gridVirtualizer.getTotalSize() +
					($generationsQuery.hasNextPage ? $windowHeight : extraHeight)}px"
				class="relative w-full"
			>
				{#each $gridVirtualizer.getVirtualItems() as virtualItem (virtualItem.index + outputs[virtualItem.index].id)}
					{@const output = outputs[virtualItem.index]}
					{@const isSelected = selectedItems.includes(output.id)}
					{@const didLoadBefore = loadedImages[output.image_url + cardType] === true}
					{@const isHoverable =
						isHoverAllowed &&
						!isSelected &&
						!$isTouchscreen &&
						!(
							cardType === 'history' &&
							$isUserGalleryEditActive &&
							$userGalleryCurrentView === 'favorites' &&
							!output.is_favorited
						) &&
						!output.is_deleted &&
						output.status !== 'failed' &&
						output.status !== 'failed-nsfw' &&
						output.status !== 'failed-nsfw-prompt'}
					<div
						style="
							width: calc(((100% - {horizontalPadding}px) / {cols});
							left: calc({horizontalPadding / 2}px + ((100% - {horizontalPadding}px) * {virtualItem.lane /
							cols}));
							height: {virtualItem.size}px;
							transform: translateY({virtualItem.start}px);
							top: 0;
						"
						class="absolute p-px"
					>
						<GridCard
							{output}
							{cardType}
							{isHoverable}
							{isSelected}
							{didLoadBefore}
							{cardWidth}
							{isGalleryEditActive}
							{setSearchQuery}
							{now}
						/>
					</div>
				{/each}
			</div>
			{#if !$generationsQuery.hasNextPage && $gridVirtualizer.getTotalSize() >= $windowHeight}
				<div
					transition:scale={{ duration: 200, easing: quadOut, opacity: 0, start: 0.5 }}
					class="mt-8 flex w-full items-center justify-center px-2 font-medium text-c-on-bg/75"
				>
					<div
						class="flex max-w-full items-center justify-center gap-1
						rounded-lg border-1.5 border-c-on-bg/15 bg-c-bg-tertiary px-2 py-1"
					>
						<p class="min-w-0 flex-shrink overflow-hidden overflow-ellipsis text-center text-sm">
							{$LL.Shared.ReachedTheEndTitle()}
						</p>
					</div>
				</div>
			{/if}
			{#if isGridLongEnoughForScrollToTopChevron}
				<div
					class="z-20 {showScrollToTopChevron
						? 'translate-y-0'
						: 'translate-y-full'} pointer-events-none sticky bottom-0 left-0
					flex w-full transform items-center justify-center
					px-2 pt-8 transition duration-300
					md:px-3 md:pt-8 {hasExtraPadding
						? 'pb-[calc(2rem+env(safe-area-inset-bottom))] md:pb-[calc(3rem+env(safe-area-inset-bottom))]'
						: 'pb-[calc(0.5rem+env(safe-area-inset-bottom))] md:pb-[calc(1rem+env(safe-area-inset-bottom))]'}"
				>
					<button
						disabled={!showScrollToTopChevron}
						aria-label="Scroll to top"
						on:click={() =>
							$gridVirtualizer?.scrollToOffset(0, {
								behavior: 'smooth'
							})}
						class="group relative rounded-lg
						before:absolute before:left-1/2 before:top-1/2
						before:h-full before:min-h-[56px] before:w-full before:min-w-[56px]
						before:-translate-x-1/2 before:-translate-y-1/2 before:rounded-lg
						{showScrollToTopChevron ? 'pointer-events-auto before:pointer-events-auto' : ''}"
					>
						<div
							class="relative h-full w-full rounded-full border-2 border-c-on-bg/15
							bg-c-bg-tertiary p-2.5 shadow-lg shadow-c-shadow/[var(--o-shadow-strongest)]"
						>
							<ButtonHoverEffect color="on-bg" noPadding fullRounding />
							<IconArrowRight class="h-5 w-5 -rotate-90 transform" />
						</div>
					</button>
				</div>
			{/if}
		</div>
	{/if}
{/if}
