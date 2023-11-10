<script lang="ts">
	import { browser } from '$app/environment';
	import GenerateGridPlaceholder from '$components/generate/GenerateGridPlaceholder.svelte';
	import { mdBreakpoint } from '$components/generationFullScreen/constants';
	import type { TGenerationImageCardType } from '$components/generationImage/types';
	import GridCard from '$components/grids/GridCard.svelte';
	import { gridScrollPositions } from '$components/grids/scrollPosition';
	import IconAnimatedSpinner from '$components/icons/IconAnimatedSpinner.svelte';
	import LL from '$i18n/i18n-svelte';
	import { removeRepeatingOutputs } from '$ts/helpers/removeRepeatingOutputs';
	import type { TUserGenerationFullOutputsPage } from '$ts/queries/userGenerations';
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
	import type { CreateInfiniteQueryResult } from '@tanstack/svelte-query';
	import {
		createVirtualizer,
		createWindowVirtualizer,
		type SvelteVirtualizer
	} from '@tanstack/svelte-virtual';
	import { onMount, tick } from 'svelte';
	import type { Readable } from 'svelte/store';

	export let generationsQuery: CreateInfiniteQueryResult<TUserGenerationFullOutputsPage, unknown>;
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
	export let onLikesChanged:
		| (({
				newLikeCount,
				newIsLikedByUser,
				action
		  }: {
				newLikeCount: number;
				newIsLikedByUser: boolean;
				action: 'like' | 'unlike';
		  }) => void)
		| undefined = undefined;

	$: horizontalPadding = paddingLeft + paddingRight;
	let isInitialScrollPositionSet = false;
	let mounted = false;
	let gridVirtualizer:
		| Readable<SvelteVirtualizer<HTMLDivElement, Element>>
		| Readable<SvelteVirtualizer<Window, Element>>
		| undefined;

	$: onlyOutputs = $generationsQuery.data?.pages
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
		if (!$gridVirtualizer) return;
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

	function onParamsChanged() {
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
						return height + extraHeightForInfo;
					}
			  })
			: createWindowVirtualizer({
					...params,
					estimateSize: (i) => {
						const width = (window.innerWidth - horizontalPadding) / cols;
						const height = (width * outputs![i].generation.height) / outputs![i].generation.width;
						return height + extraHeightForInfo;
					}
			  });
	}

	onMount(() => {
		mounted = true;
	});
</script>

{#if $generationsQuery.isInitialLoading}
	<div
		class="w-full h-full flex-1 flex flex-col text-c-on-bg/60 py-6 px-4 justify-center items-center text-center"
	>
		<IconAnimatedSpinner class="w-12 h-12" />
		<p class="mt-2 opacity-0">{$LL.Gallery.SearchingTitle()}</p>
		<div class="h-[2vh] {noLoadingSpinnerAlignmentAdjustment ? 'hidden' : ''}" />
	</div>
{:else if hasPlaceholder && $generationsQuery.isSuccess && outputs !== undefined && outputs.length === 0}
	<GenerateGridPlaceholder text={$LL.Generate.Grid.NoGeneration.Paragraph()} />
{:else if $generationsQuery.isSuccess && $generationsQuery.data.pages.length > 0 && outputs !== undefined}
	{#if $gridVirtualizer}
		<div
			style="height: {$gridVirtualizer.getTotalSize() +
				($generationsQuery.hasNextPage ? $windowHeight : 0)}px"
			class="w-full relative"
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
						{onLikesChanged}
						{setSearchQuery}
						{now}
					/>
				</div>
			{/each}
		</div>
	{/if}
{/if}
