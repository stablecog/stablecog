<script lang="ts">
	import IconAnimatedSpinner from '$components/icons/IconAnimatedSpinner.svelte';
	import VoiceoverListPlaceholder from '$components/voiceover/lists/VoiceoverListPlaceholder.svelte';
	import AudioPlayerListItem from '$components/voiceover/audioPlayer/AudioPlayerListItem.svelte';
	import LL from '$i18n/i18n-svelte';
	import type { TUserVoiceoverFullOutputsPage } from '$ts/queries/userVoiceovers';
	import { windowHeight, windowWidth } from '$ts/stores/window';
	import type { CreateInfiniteQueryResult } from '@tanstack/svelte-query';
	import { createVirtualizer, type SvelteVirtualizer } from '@tanstack/svelte-virtual';
	import type { Readable } from 'svelte/store';
	import {
		listItemHeight,
		listItemHeightLg,
		listItemWidth
	} from '$components/voiceover/lists/constants';
	import type { TVoiceoverFullOutput } from '$ts/stores/user/voiceovers';
	import { removeRepeatingOutputsForVoiceover } from '$ts/helpers/removeRepeatingOutputs';

	export let query: CreateInfiniteQueryResult<TUserVoiceoverFullOutputsPage, unknown>;
	export let pinnedFullOutputs: TVoiceoverFullOutput[] | undefined;
	export let horizontal = false;
	export let listScrollContainer: HTMLElement | undefined = undefined;
	export let listScrollContainerWidth: number | undefined = undefined;
	export let listScrollContainerHeight: number | undefined = undefined;
	export let paddingLeft = 0;
	export let paddingRight = 0;
	export let paddingTop = 0;
	export let paddingBottom = 0;
	export let itemHeight = listItemHeight;
	export let itemWidth = listItemWidth;
	export let gap = 0;

	let listVirtualizer: Readable<SvelteVirtualizer<HTMLDivElement, Element>> | undefined;

	$: onlyOutputs = $query.data?.pages.flatMap((page) => page.outputs);
	let outputs: TVoiceoverFullOutput[] | undefined = undefined;
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
		outputs = removeRepeatingOutputsForVoiceover({
			outputsPinned: pinnedFullOutputs,
			outputs: onlyOutputs
		});
	}

	$: paddingX = paddingLeft + paddingRight;
	$: paddingY = paddingTop + paddingBottom;
	$: listScrollContainerSize = horizontal ? listScrollContainerWidth : listScrollContainerHeight;

	$: estimatedItemSize =
		(horizontal
			? itemWidth
			: $windowWidth >= 1024 && $windowWidth < 1280
			? listItemHeightLg
			: itemHeight) + gap;
	$: estimatedItemCountInAWindow =
		estimatedItemSize && listScrollContainerSize
			? listScrollContainerSize / estimatedItemSize
			: undefined;
	$: overscanCount = estimatedItemCountInAWindow
		? Math.round(estimatedItemCountInAWindow * 2)
		: undefined;

	$: listAtStart = $listVirtualizer ? $listVirtualizer.scrollOffset <= 0 : true;
	$: listAtEnd = horizontal
		? $listVirtualizer && listScrollContainerWidth
			? $listVirtualizer.scrollOffset >= $listVirtualizer.getTotalSize() - listScrollContainerWidth
			: false
		: $listVirtualizer && listScrollContainerHeight
		? $listVirtualizer.scrollOffset >= $listVirtualizer.getTotalSize() - listScrollContainerHeight
		: false;

	const overscanMultiplierForNextPage = 0.5;

	$: [
		listScrollContainer,
		listScrollContainerSize,
		outputs,
		overscanCount,
		$windowWidth,
		$windowHeight
	],
		initiallySetListVirtualizer();
	$: $listVirtualizer, onListVirtualizerChanged();
	$: [outputs, overscanCount], onParamsChanged();

	function initiallySetListVirtualizer() {
		if ($listVirtualizer || outputs === undefined || overscanCount === undefined) return;
		if (!listScrollContainer) return;

		const params = {
			count: outputs.length,
			overscan: overscanCount,
			paddingStart: horizontal ? paddingLeft : paddingTop,
			paddingEnd: horizontal ? paddingRight : paddingBottom,
			lanes: 1,
			horizontal
		};

		listVirtualizer = createVirtualizer({
			...params,
			getScrollElement: () => listScrollContainer as HTMLDivElement,
			estimateSize: (i) => estimatedItemSize
		});
	}

	function onListVirtualizerChanged() {
		if (
			!outputs ||
			!$listVirtualizer ||
			!$query.hasNextPage ||
			$query.isFetchingNextPage ||
			overscanCount === undefined
		)
			return;
		const items = $listVirtualizer.getVirtualItems();
		if (!items || items.length < 1) return;
		const lastItemIndex = items[items.length - 1].index;
		const isLastItemVisible =
			lastItemIndex >= outputs.length - 1 - overscanCount * overscanMultiplierForNextPage;
		if (!isLastItemVisible) return;
		$query.fetchNextPage();
	}

	let lastMeasuredFirstItemId: string | undefined = undefined;

	function onParamsChanged() {
		if (!$listVirtualizer) return;
		const prevOverscan = $listVirtualizer.options.overscan;
		let optionsToSet: { [key: string]: string | number } = {};
		if (outputs) {
			optionsToSet.count = outputs.length;
		}
		if (overscanCount) {
			optionsToSet.overscan = overscanCount;
		}
		if (Object.keys(optionsToSet).length > 0) {
			$listVirtualizer.setOptions(optionsToSet);
		}
		if (
			prevOverscan !== overscanCount ||
			(outputs && outputs.length > 0 && lastMeasuredFirstItemId !== outputs[0].id)
		) {
			$listVirtualizer.measure();
			if (outputs && outputs.length > 0) lastMeasuredFirstItemId = outputs[0].id;
		}
	}
</script>

{#if $query.isInitialLoading}
	<div
		class="w-full h-full flex-1 flex flex-col text-c-on-bg/60 py-6 px-4 justify-center items-center text-center"
	>
		<IconAnimatedSpinner class="w-12 h-12" />
		<p class="mt-2 opacity-0 {horizontal ? 'hidden' : ''}">{$LL.Gallery.SearchingTitle()}</p>
	</div>
{:else if $query.isSuccess && outputs !== undefined && outputs.length === 0}
	<VoiceoverListPlaceholder {horizontal} text={$LL.Voiceover.List.NoVoiceovers.Paragraph()} />
{:else if $query.isSuccess && $query.data.pages.length > 0 && outputs !== undefined}
	{#if $listVirtualizer}
		<div
			style="{horizontal ? 'width' : 'height'}: {$listVirtualizer.getTotalSize()}px"
			class="{horizontal ? 'h-full' : 'w-full'} relative"
		>
			{#each $listVirtualizer.getVirtualItems() as virtualItem (virtualItem.index + outputs[virtualItem.index].id)}
				{@const output = outputs[virtualItem.index]}
				<div
					key={virtualItem.index}
					style={horizontal
						? `
							height: calc(100% - ${paddingY}px);
							width: ${virtualItem.size}px;
							left: 0;
							top: ${paddingY / 2}px;
							transform: translateX(${virtualItem.start}px);
						`
						: `
							width: calc((100% - ${paddingX}px));
							left: ${paddingX / 2}px;
							height: ${virtualItem.size}px;
							transform: translateY(${virtualItem.start}px);
							top: 0;`}
					class="absolute"
				>
					<div
						class={horizontal ? 'h-full' : 'w-full'}
						style={horizontal ? `width: ${listItemWidth}px` : ''}
					>
						<AudioPlayerListItem {output} inHorizontal={horizontal} />
					</div>
				</div>
			{/each}
		</div>
		{#if horizontal}
			<div
				class="absolute left-0 top-0 w-16 h-full bg-gradient-to-r from-c-bg to-c-bg/0 transition
				duration-100 pointer-events-none {listAtStart ? 'opacity-0' : 'opacity-100'}"
			/>
			<div
				class="absolute right-0 top-0 w-16 h-full bg-gradient-to-l from-c-bg to-c-bg/0 transition
				duration-100 pointer-events-none {listAtEnd ? 'opacity-0' : 'opacity-100'}"
			/>
		{/if}
	{/if}
{/if}
