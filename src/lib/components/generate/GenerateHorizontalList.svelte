<script lang="ts">
	import GenerationImage from '$components/generationImage/GenerationImage.svelte';
	import type { TGenerationImageCardType } from '$components/generationImage/types';
	import ImagePlaceholder from '$components/utils/image/ImagePlaceholder.svelte';
	import type { CreateInfiniteQueryResult, InfiniteData } from '@tanstack/svelte-query';
	import IconAnimatedSpinner from '$components/icons/IconAnimatedSpinner.svelte';
	import type { TGenerationFullOutput } from '$ts/stores/user/generation';
	import GenerationAnimation from '$components/generate/GenerationAnimation.svelte';
	import { fade } from 'svelte/transition';
	import { quadIn, quadOut } from 'svelte/easing';
	import LL from '$i18n/i18n-svelte';
	import GenerateHorizontalListPlaceholder from '$components/generate/GenerateHorizontalListPlaceholder.svelte';
	import IconEyeSlashOutline from '$components/icons/IconEyeSlashOutline.svelte';
	import IconSadFaceOutline from '$components/icons/IconSadFaceOutline.svelte';
	import type { Readable } from 'svelte/store';
	import { createVirtualizer, type SvelteVirtualizer } from '@tanstack/svelte-virtual';
	import { windowHeight, windowWidth } from '$ts/stores/window';
	import { removeRepeatingOutputs } from '$ts/helpers/removeRepeatingOutputs';
	import IconNsfwPrompt from '$components/icons/IconNSFWPrompt.svelte';
	import type { TGalleryFullOutputsPage } from '$ts/queries/galleryLike/types';

	export let generationsQuery:
		| CreateInfiniteQueryResult<InfiniteData<TGalleryFullOutputsPage, unknown>, Error>
		| undefined;
	export let pinnedFullOutputs: TGenerationFullOutput[] | undefined = undefined;
	export let cardType: TGenerationImageCardType;
	export let listScrollContainer: HTMLDivElement | undefined;
	export let listScrollContainerHeight: number | undefined;
	export let listScrollContainerWidth: number | undefined;
	export let paddingX = 0;
	export let paddingY = 0;

	let listVirtualizer: Readable<SvelteVirtualizer<HTMLDivElement, Element>> | undefined;
	let placeholderInnerContainerHeight: number;

	$: onlyOutputs = $generationsQuery?.data?.pages
		.flatMap((page) => page.outputs)
		.filter((i) => i !== undefined);
	let outputs: TGenerationFullOutput[] | undefined;
	$: [onlyOutputs, pinnedFullOutputs], setOutputs();

	const defaultAspectRatio = 0.66;
	$: estimatedItemHeight =
		listScrollContainer && listScrollContainerHeight && $windowWidth && $windowHeight
			? listScrollContainerHeight - paddingY * 2
			: undefined;
	$: estimatedItemWidth = estimatedItemHeight
		? estimatedItemHeight * defaultAspectRatio
		: undefined;
	$: estimatedItemCountInAWindow =
		estimatedItemWidth && listScrollContainerWidth
			? Math.ceil(listScrollContainerWidth / estimatedItemWidth)
			: undefined;
	$: overscanCount = estimatedItemCountInAWindow
		? Math.round(estimatedItemCountInAWindow * 3)
		: undefined;
	const overscanMultiplierForNextPage = 0.25;

	$: [listScrollContainer, outputs, overscanCount], initiallySetListVirtualizer();
	$: $listVirtualizer, onListVirtualizerChanged();
	$: [outputs, overscanCount], onParamsChanged();

	$: listAtStart =
		$listVirtualizer && $listVirtualizer.scrollOffset !== null
			? $listVirtualizer.scrollOffset <= 0
			: true;
	$: listAtEnd =
		$listVirtualizer && listScrollContainerWidth && $listVirtualizer.scrollOffset !== null
			? $listVirtualizer.scrollOffset >= $listVirtualizer.getTotalSize() - listScrollContainerWidth
			: false;

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

	function onParamsChanged() {
		if ($listVirtualizer === undefined) return;
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

	function onListVirtualizerChanged() {
		if (
			!outputs ||
			!$listVirtualizer ||
			!$generationsQuery?.hasNextPage ||
			$generationsQuery.isFetchingNextPage ||
			overscanCount === undefined
		)
			return;
		const items = $listVirtualizer.getVirtualItems();
		if (!items || items.length < 1) return;
		const lastItemIndex = items[items.length - 1].index;
		const isLastItemVisible =
			lastItemIndex >= outputs.length - 1 - overscanCount * overscanMultiplierForNextPage;
		if (!isLastItemVisible) return;
		$generationsQuery.fetchNextPage();
	}

	function initiallySetListVirtualizer() {
		if ($listVirtualizer || outputs === undefined || !overscanCount) return;
		if (listScrollContainer === undefined) return;
		if (listScrollContainerHeight === undefined) return;
		listVirtualizer = createVirtualizer({
			count: outputs.length,
			overscan: overscanCount,
			paddingStart: paddingX,
			paddingEnd: paddingX,
			horizontal: true,
			getScrollElement: () => listScrollContainer as HTMLDivElement,
			estimateSize: (i) => {
				const height = (listScrollContainerHeight as number) - paddingY * 2;
				return (height * outputs![i].generation.width) / outputs![i].generation.height;
			}
		});
	}
</script>

{#if $generationsQuery?.isLoading}
	<div class="h-full w-full">
		<div
			bind:clientHeight={placeholderInnerContainerHeight}
			class="flex h-full w-full flex-row items-center justify-center"
		>
			<ImagePlaceholder
				containerHeight={placeholderInnerContainerHeight}
				width={512}
				height={512}
				class="opacity-0"
			/>
			<div
				class="absolute z-0 flex h-full w-full flex-col items-center justify-center overflow-hidden text-center text-c-on-bg/60"
			>
				<IconAnimatedSpinner class="h-7 w-7" />
			</div>
		</div>
	</div>
{:else if $generationsQuery?.isSuccess && outputs !== undefined && outputs.length === 0}
	<GenerateHorizontalListPlaceholder text={$LL.Generate.Grid.NoGeneration.Paragraph()} />
{:else if $generationsQuery?.isSuccess && outputs !== undefined && outputs.length > 0}
	{#if listScrollContainer && $listVirtualizer}
		<div
			style="width: {$listVirtualizer.getTotalSize() +
				($generationsQuery.hasNextPage ? $windowWidth : 0)}px"
			class="relative h-full"
		>
			{#each $listVirtualizer.getVirtualItems() as virtualItem (virtualItem.index + outputs[virtualItem.index].id)}
				{@const output = outputs[virtualItem.index]}
				<div
					class="absolute"
					style="
						height: calc(100% - {paddingY * 2}px);
						width: {virtualItem.size}px;
						left: 0;
						top: {paddingY}px;
						transform: translateX({virtualItem.start}px);
					"
				>
					<div class="h-full w-full p-px">
						<div class="group relative h-full w-full">
							<ImagePlaceholder width={output.generation.width} height={output.generation.height} />
							<div
								class="absolute left-0 top-0 z-0 h-full w-full overflow-hidden
										rounded-md border border-c-bg-secondary bg-c-bg-secondary transition {output.status !== 'failed' &&
								output.status !== 'failed-nsfw' &&
								output.status !== 'failed-nsfw-prompt'
									? 'not-touch:hover:border-c-primary'
									: ''}"
							>
								{#if output.generation.outputs !== undefined}
									{#if output.status !== 'failed' && output.status !== 'failed-nsfw' && output.status !== 'failed-nsfw-prompt'}
										{#if output.status !== undefined && output.status !== 'succeeded' && output.animation !== undefined}
											<div
												out:fade={{ duration: 3000, easing: quadIn }}
												class="absolute left-0 top-0 h-full w-full"
											>
												<GenerationAnimation animation={output.animation} />
											</div>
										{/if}
										{#if output.status === undefined || output.status === 'succeeded'}
											<GenerationImage
												{cardType}
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
													? 'h-full max-h-[1.75rem] xl:max-h-[2rem] w-auto'
													: 'h-full max-h-[2rem] xl:max-h-[2.5rem] w-auto'
												: cardType === 'generate'
													? 'w-full max-w-[1.75rem] xl:max-w-[2rem] h-auto'
													: 'w-full max-w-[2rem] xl:max-w-[2.5rem] h-auto'}
										<div
											in:fade={{ duration: 200, easing: quadOut }}
											class="relative flex h-full w-full items-center justify-center bg-c-bg-secondary p-1"
										>
											{#if output.status === 'failed-nsfw'}
												<IconEyeSlashOutline class="{sizeClasses} text-c-on-bg/50" />
											{:else if output.status === 'failed-nsfw-prompt'}
												<IconNsfwPrompt class="{sizeClasses} text-c-on-bg/50" />
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
		class="pointer-events-none absolute left-0 top-0 h-full w-12 bg-gradient-to-r from-c-bg to-c-bg/0
      transition duration-100 {listAtStart ? 'opacity-0' : 'opacity-100'}"
	/>
	<div
		class="pointer-events-none absolute right-0 top-0 h-full w-12 bg-gradient-to-l from-c-bg to-c-bg/0
			transition duration-100 {listAtEnd ? 'opacity-0' : 'opacity-100'}"
	/>
{/if}
