<script lang="ts">
	import GenerationImage from '$components/generationImage/GenerationImage.svelte';
	import type { TGenerationImageCardType } from '$components/generationImage/types';
	import ImagePlaceholder from '$components/ImagePlaceholder.svelte';
	import type { CreateInfiniteQueryResult } from '@tanstack/svelte-query';
	import IconAnimatedSpinner from '$components/icons/IconAnimatedSpinner.svelte';
	import type { TGenerationFullOutput } from '$ts/stores/user/generation';
	import GenerationAnimation from '$components/grids/GenerationAnimation.svelte';
	import { fade } from 'svelte/transition';
	import { quadIn, quadOut } from 'svelte/easing';
	import type { TUserGenerationFullOutputsPage } from '$ts/queries/userGenerations';
	import LL from '$i18n/i18n-svelte';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import GenerateHorizontalListPlaceholder from '$components/generate/GenerateHorizontalListPlaceholder.svelte';
	import IconEyeSlashOutline from '$components/icons/IconEyeSlashOutline.svelte';
	import IconSadFaceOutline from '$components/icons/IconSadFaceOutline.svelte';
	import type { Readable } from 'svelte/store';
	import { createVirtualizer, type SvelteVirtualizer } from '@tanstack/svelte-virtual';
	import { windowHeight, windowWidth } from '$ts/stores/window';
	import { removeRepeatingOutputs } from '$ts/helpers/removeRepeatingOutputs';

	export let generationsQuery: CreateInfiniteQueryResult<TUserGenerationFullOutputsPage, unknown>;
	export let pinnedFullOutputs: TGenerationFullOutput[] | undefined = undefined;
	export let cardType: TGenerationImageCardType;
	export let listScrollContainer: HTMLDivElement;
	export let paddingX = 0;
	export let paddingY = 0;

	let listVirtualizer: Readable<SvelteVirtualizer<HTMLDivElement, Element>> | undefined;
	let placeholderInnerContainerHeight: number;

	$: onlyOutputs = $generationsQuery.data?.pages.flatMap((page) => page.outputs);
	let outputs: TGenerationFullOutput[] | undefined;
	$: [onlyOutputs, pinnedFullOutputs], setOutputs();

	const defaultAspectRatio = 0.66;
	let estimatedItemHeight: number;
	const setEstimatedItemHeight = () => {
		estimatedItemHeight = (listScrollContainer.clientHeight || 0) - paddingY * 2;
	};
	$: [$windowWidth, paddingY], setEstimatedItemHeight();
	$: estimatedItemHeight = (listScrollContainer.clientHeight || 0) - paddingY * 2;
	$: estimatedItemWidth = estimatedItemHeight ? estimatedItemHeight * defaultAspectRatio : 0;
	$: estimatedItemCountInAWindow = estimatedItemWidth
		? Math.ceil(listScrollContainer.clientWidth / estimatedItemWidth)
		: 10;
	$: overscanCount = Math.round(estimatedItemCountInAWindow * 3) || 25;
	const overscanMultiplierForNextPage = 0.25;

	$: [listScrollContainer, outputs, overscanCount], initiallySetListVirtualizer();
	$: outputs, onOutputsChanged();
	$: $listVirtualizer, onListVirtualizerChanged();
	$: listAtStart = $listVirtualizer ? $listVirtualizer.scrollOffset === 0 : true;
	$: listAtEnd =
		$listVirtualizer && listScrollContainer.scrollWidth && listScrollContainer.clientWidth
			? $listVirtualizer.scrollOffset >=
			  listScrollContainer.scrollWidth - listScrollContainer.clientWidth
			: false;

	let shouldMeasureTimeout: NodeJS.Timeout;
	const shouldMeasureDebounceTime = 100;

	$: [$windowWidth, $windowHeight], shouldMeasureWithDebounce();

	function shouldMeasureWithDebounce() {
		if (shouldMeasureTimeout) clearTimeout(shouldMeasureTimeout);
		if (!outputs) return;
		if (!$windowWidth) return;
		if (!$windowHeight) return;
		if (!$listVirtualizer) return;
		$listVirtualizer.measure();
		shouldMeasureTimeout = setTimeout(() => {
			if (!$listVirtualizer) return;
			$listVirtualizer.measure();
		}, shouldMeasureDebounceTime);
	}

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

	function onOutputsChanged() {
		if (!outputs) return;
		if ($listVirtualizer === undefined) return;
		$listVirtualizer.setOptions({
			count: outputs?.length ?? 0
		});
		$listVirtualizer.measure();
	}

	function onListVirtualizerChanged() {
		if (!outputs) return;
		if (!$listVirtualizer) return;
		if (!$generationsQuery.hasNextPage) return;
		if ($generationsQuery.isFetchingNextPage) return;
		const lastItemIndex = $listVirtualizer.getVirtualItems().reverse()[0].index;
		const isLastItemVisible =
			lastItemIndex >= outputs.length - 1 - overscanCount * overscanMultiplierForNextPage;
		if (!isLastItemVisible) return;
		$generationsQuery.fetchNextPage();
	}

	function initiallySetListVirtualizer() {
		if (outputs === undefined) return;
		if (!overscanCount) return;
		if ($listVirtualizer) return;
		listVirtualizer = createVirtualizer({
			count: outputs.length,
			overscan: overscanCount,
			paddingStart: paddingX,
			paddingEnd: paddingX,
			horizontal: true,
			getScrollElement: () => listScrollContainer,
			estimateSize: (i) => {
				const height = listScrollContainer.clientHeight - paddingY * 2;
				return (height * outputs![i].generation.width) / outputs![i].generation.height;
			}
		});
	}
</script>

{#if $generationsQuery.isInitialLoading}
	<div class="w-full h-full">
		<div
			bind:clientHeight={placeholderInnerContainerHeight}
			class="w-full h-full flex flex-row items-center justify-center"
		>
			<ImagePlaceholder
				containerHeight={placeholderInnerContainerHeight}
				width={512}
				height={512}
				class="opacity-0"
			/>
			<div
				class="w-full h-full absolute flex flex-col text-c-on-bg/60 justify-center items-center text-center overflow-hidden z-0"
			>
				<IconAnimatedSpinner class="w-7 h-7" />
			</div>
		</div>
	</div>
{:else if $generationsQuery.isSuccess && outputs !== undefined && outputs.length === 0}
	<GenerateHorizontalListPlaceholder text={$LL.Generate.Grid.NoGeneration.Paragraph()} />
{:else if $generationsQuery.isSuccess && outputs !== undefined && outputs.length > 0}
	{#if listScrollContainer && $listVirtualizer}
		<div style="width: {$listVirtualizer.getTotalSize()}px" class="h-full relative">
			{#each $listVirtualizer.getVirtualItems() as virtualItem (virtualItem.key)}
				{@const output = outputs[virtualItem.index]}
				<div
					key={virtualItem.index}
					class="absolute"
					style="
						height: calc(100% - {paddingY * 2}px);
						width: {virtualItem.size}px;
						left: 0;
						top: {paddingY}px;
						transform: translateX({virtualItem.start}px);
					"
				>
					<div class="w-full h-full p-px">
						<div class="w-full h-full relative group">
							<ImagePlaceholder width={output.generation.width} height={output.generation.height} />
							<div
								class="absolute left-0 top-0 w-full h-full bg-c-bg-secondary transition
										z-0 rounded-md border overflow-hidden border-c-bg-secondary {!$isTouchscreen &&
								output.status !== 'failed' &&
								output.status !== 'failed-nsfw'
									? 'hover:border-c-primary'
									: ''}"
							>
								{#if output.generation.outputs !== undefined}
									{#if output.status !== 'failed' && output.status !== 'failed-nsfw'}
										{#if output.status !== undefined && output.status !== 'succeeded' && output.animation !== undefined}
											<div
												out:fade|local={{ duration: 3000, easing: quadIn }}
												class="w-full h-full absolute left-0 top-0"
											>
												<GenerationAnimation animation={output.animation} />
											</div>
										{/if}
										{#if output.status === undefined || output.status === 'succeeded'}
											<GenerationImage
												{cardType}
												useUpscaledImage={false}
												generation={{
													...output.generation,
													selected_output: output
												}}
											/>
										{/if}
									{:else}
										{@const sizeClasses =
											output.generation.height > output.generation.width
												? cardType === 'generate'
													? 'h-full max-h-[2rem] w-auto'
													: 'h-full max-h-[3rem] w-auto'
												: cardType === 'generate'
												? 'w-full max-w-[2rem] h-auto'
												: 'w-full max-w-[3rem] h-auto'}
										<div
											in:fade|local={{ duration: 200, easing: quadOut }}
											class="w-full h-full flex items-center bg-c-bg-secondary justify-center relative p-1"
										>
											{#if output.status === 'failed-nsfw'}
												<IconEyeSlashOutline class="{sizeClasses} text-c-on-bg/50" />
											{:else}
												<IconSadFaceOutline class="{sizeClasses} text-c-on-bg/50" />
											{/if}
										</div>
									{/if}
								{/if}
							</div>
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
	<div
		class="absolute left-0 top-0 w-16 h-full bg-gradient-to-r from-c-bg to-c-bg/0 transition
      duration-100 pointer-events-none {listAtStart ? 'opacity-0' : 'opacity-100'}"
	/>
	<div
		class="absolute right-0 top-0 w-16 h-full bg-gradient-to-l from-c-bg to-c-bg/0 transition
			duration-100 pointer-events-none {listAtEnd ? 'opacity-0' : 'opacity-100'}"
	/>
{/if}
