<script lang="ts">
	import IconAnimatedSpinner from '$components/icons/IconAnimatedSpinner.svelte';
	import AudioPlayer from '$components/voiceover/audioPlayer/AudioPlayer.svelte';
	import { PUBLIC_BUCKET_URL, PUBLIC_BUCKET_VOICEOVER_URL } from '$env/static/public';
	import LL from '$i18n/i18n-svelte';
	import type { TUserVoiceoverFullOutputsPage } from '$ts/queries/userVoiceovers';
	import { windowHeight, windowWidth } from '$ts/stores/window';
	import type { CreateInfiniteQueryResult } from '@tanstack/svelte-query';
	import { createVirtualizer, type SvelteVirtualizer } from '@tanstack/svelte-virtual';
	import type { Readable } from 'svelte/store';

	export let query: CreateInfiniteQueryResult<TUserVoiceoverFullOutputsPage, unknown>;
	export let listScrollContainer: HTMLElement | undefined = undefined;
	export let listScrollContainerHeight: number | undefined = undefined;
	export let paddingLeft = 0;
	export let paddingRight = 0;
	export let paddingTop = 0;
	export let paddingBottom = 0;

	let listVirtualizer: Readable<SvelteVirtualizer<HTMLDivElement, Element>> | undefined;

	$: horizontalPadding = paddingLeft + paddingRight;

	$: outputs = $query?.data?.pages?.flatMap((p) => p.outputs);

	$: estimatedItemHeight = 90;
	$: estimatedItemCountInAWindow =
		estimatedItemHeight && listScrollContainerHeight
			? listScrollContainerHeight / estimatedItemHeight
			: undefined;
	$: overscanCount = estimatedItemCountInAWindow
		? Math.round(estimatedItemCountInAWindow * 2)
		: undefined;

	const overscanMultiplierForNextPage = 0.25;

	$: [
		listScrollContainer,
		listScrollContainerHeight,
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
			paddingStart: paddingTop,
			paddingEnd: paddingBottom,
			lanes: 1
		};

		listVirtualizer = createVirtualizer({
			...params,
			getScrollElement: () => listScrollContainer as HTMLDivElement,
			estimateSize: (i) => estimatedItemHeight
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

	function onParamsChanged() {
		if (!$listVirtualizer) return;
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
	}
</script>

{#if $query.isInitialLoading}
	<div
		class="w-full h-full flex-1 flex flex-col text-c-on-bg/60 py-6 px-4 justify-center items-center text-center"
	>
		<IconAnimatedSpinner class="w-12 h-12" />
		<p class="mt-2 opacity-0">{$LL.Gallery.SearchingTitle()}</p>
	</div>
{:else if $query.isSuccess && outputs !== undefined && outputs.length === 0}
	<div>No outputs</div>
{:else if $query.isSuccess && $query.data.pages.length > 0 && outputs !== undefined}
	{#if $listVirtualizer}
		<div style="height: {$listVirtualizer.getTotalSize()}px" class="w-full relative">
			{#each $listVirtualizer.getVirtualItems() as virtualItem (virtualItem.index + outputs[virtualItem.index].id)}
				{@const output = outputs[virtualItem.index]}
				<div
					key={virtualItem.index}
					style="
						width: calc((100% - {horizontalPadding}px));
						left: {horizontalPadding / 2}px;
						height: {virtualItem.size}px;
						transform: translateY({virtualItem.start}px);
						top: 0;
					"
					class="w-full group absolute"
				>
					<div class="w-full h-full">
						<AudioPlayer
							label={output.voiceover.prompt.text}
							title={output.voiceover.prompt.text}
							src={output.audio_file_url.replace(PUBLIC_BUCKET_URL, PUBLIC_BUCKET_VOICEOVER_URL)}
						/>
					</div>
				</div>
			{/each}
		</div>
	{/if}
{/if}
