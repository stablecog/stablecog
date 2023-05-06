<script lang="ts">
	import GenerationImage from '$components/generationImage/GenerationImage.svelte';
	import type { TGenerationImageCardType } from '$components/generationImage/types';
	import ImagePlaceholder from '$components/ImagePlaceholder.svelte';
	import LL from '$i18n/i18n-svelte';
	import type { CreateInfiniteQueryResult } from '@tanstack/svelte-query';
	import {
		adminGalleryActionableItems,
		adminGalleryCurrentFilter,
		isAdminGalleryEditActive
	} from '$ts/stores/admin/gallery';
	import IconAnimatedSpinner from '$components/icons/IconAnimatedSpinner.svelte';
	import {
		isUserGalleryEditActive,
		userGalleryActionableItems,
		userGalleryCurrentView
	} from '$ts/stores/user/gallery';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import type { TGenerationFullOutput } from '$ts/stores/user/generation';
	import GenerationAnimation from '$components/grids/GenerationAnimation.svelte';
	import { fade } from 'svelte/transition';
	import { quadIn, quadOut } from 'svelte/easing';
	import GenerateGridPlaceholder from '$components/generate/GenerateGridPlaceholder.svelte';
	import IconEyeSlashOutline from '$components/icons/IconEyeSlashOutline.svelte';
	import IconSadFaceOutline from '$components/icons/IconSadFaceOutline.svelte';
	import { removeRepeatingOutputs } from '$ts/helpers/removeRepeatingOutputs';
	import {
		createVirtualizer,
		createWindowVirtualizer,
		type SvelteVirtualizer
	} from '@tanstack/svelte-virtual';
	import type { TUserGenerationFullOutputsPage } from '$ts/queries/userGenerations';
	import type { Readable } from 'svelte/store';
	import { windowHeight, windowWidth } from '$ts/stores/window';

	export let generationsQuery: CreateInfiniteQueryResult<TUserGenerationFullOutputsPage, unknown>;
	export let gridScrollContainer: HTMLDivElement | undefined = undefined;
	export let pinnedFullOutputs: TGenerationFullOutput[] | undefined = undefined;
	export let cardType: TGenerationImageCardType;
	export let noLoadingSpinnerAlignmentAdjustment = false;
	export let hasPlaceholder = false;
	export let cols = 6;
	export let padding: number = 0;

	let gridVirtualizer:
		| Readable<SvelteVirtualizer<HTMLDivElement, Element>>
		| Readable<SvelteVirtualizer<Window, Element>>
		| undefined;

	$: onlyOutputs = $generationsQuery.data?.pages.flatMap((page) => page.outputs);
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

	$: outputs, onOutputsChanged();

	$: $gridVirtualizer, onGridVirtualizerChanged();

	const defaultAspectRatio = 1.5;
	let estimatedItemWidth: number;
	const setEstimatedItemWidth = () => {
		estimatedItemWidth = ((gridScrollContainer?.clientWidth || $windowWidth) - padding * 2) / cols;
	};
	$: [$windowWidth, padding, cols], setEstimatedItemWidth();
	$: estimatedItemHeight = estimatedItemWidth ? estimatedItemWidth * (1 / defaultAspectRatio) : 400;
	$: estimatedItemCountInAWindow = estimatedItemWidth
		? ((gridScrollContainer?.clientHeight || $windowHeight) / estimatedItemHeight) * cols
		: 50;

	$: overscanCount = Math.round(estimatedItemCountInAWindow * 2) || 25;
	const overscanMultiplierForNextPage = 0.25;
	$: [$windowWidth, $windowHeight, gridScrollContainer, outputs, overscanCount],
		setGridVirtualizer();
	$: cols, onColsChanged();

	let shouldMeasureTimeout: NodeJS.Timeout;
	const shouldMeasureDebounceTime = 100;

	$: [$windowWidth, $windowHeight], shouldMeasure();

	function shouldMeasure() {
		if (shouldMeasureTimeout) clearTimeout(shouldMeasureTimeout);
		if (!outputs) return;
		if (!$windowWidth) return;
		if (!$windowHeight) return;
		if (!$gridVirtualizer) return;
		if (!$gridVirtualizer) return;
		$gridVirtualizer.measure();
		shouldMeasureTimeout = setTimeout(() => {
			if (!$gridVirtualizer) return;
			$gridVirtualizer.measure();
		}, shouldMeasureDebounceTime);
	}

	function onGridVirtualizerChanged() {
		if (!outputs) return;
		if (!$gridVirtualizer) return;
		if (!$generationsQuery.hasNextPage) return;
		if ($generationsQuery.isFetchingNextPage) return;
		const lastItemIndex = $gridVirtualizer.getVirtualItems().reverse()[0].index;
		const isLastItemVisible =
			lastItemIndex >= outputs.length - 1 - overscanCount * overscanMultiplierForNextPage;
		if (!isLastItemVisible) return;
		$generationsQuery.fetchNextPage();
	}

	function onOutputsChanged() {
		if (!outputs) return;
		if ($gridVirtualizer === undefined) return;
		$gridVirtualizer.setOptions({
			count: outputs?.length ?? 0
		});
		$gridVirtualizer.measure();
	}

	function onColsChanged() {
		if ($gridVirtualizer === undefined) return;
		$gridVirtualizer.setOptions({
			lanes: cols
		});
	}

	function setGridVirtualizer() {
		if (outputs === undefined) return;
		const params = {
			count: outputs.length,
			overscan: overscanCount,
			lanes: cols,
			paddingStart: padding,
			paddingEnd: padding
		};
		gridVirtualizer =
			gridScrollContainer !== undefined && gridScrollContainer.offsetWidth
				? createVirtualizer({
						...params,
						getScrollElement: () => gridScrollContainer as HTMLDivElement,
						estimateSize: (i) => {
							const width = (gridScrollContainer!.offsetWidth - padding * 2) / cols;
							const height = (width * outputs![i].generation.height) / outputs![i].generation.width;
							return height;
						}
				  })
				: createWindowVirtualizer({
						...params,
						estimateSize: (i) => {
							const width = (window.innerWidth - padding * 2) / cols;
							const height = (width * outputs![i].generation.height) / outputs![i].generation.width;
							return height;
						}
				  });
	}
</script>

{#if $generationsQuery.isInitialLoading}
	<div
		class="w-full flex-1 flex flex-col text-c-on-bg/60 py-6 px-4 justify-center items-center text-center"
	>
		<IconAnimatedSpinner class="w-12 h-12" />
		<p class="mt-2 opacity-0">{$LL.Gallery.SearchingTitle()}</p>
		<div class="h-[2vh] {noLoadingSpinnerAlignmentAdjustment ? 'hidden' : ''}" />
	</div>
{:else if hasPlaceholder && $generationsQuery.isSuccess && outputs !== undefined && outputs.length === 0}
	<GenerateGridPlaceholder text={$LL.Generate.Grid.NoGeneration.Paragraph()} />
{:else if $generationsQuery.isSuccess && $generationsQuery.data.pages.length > 0 && outputs !== undefined}
	{#if $gridVirtualizer}
		<div style="height: {$gridVirtualizer.getTotalSize()}px" class="w-full relative">
			{#each $gridVirtualizer.getVirtualItems() as virtualItem (virtualItem.index)}
				{@const output = outputs[virtualItem.index]}
				{@const isOutputSelected = selectedItems.includes(output.id)}
				{@const isOutputHoverable =
					isHoverAllowed &&
					!isOutputSelected &&
					!$isTouchscreen &&
					!(
						cardType === 'history' &&
						$isUserGalleryEditActive &&
						$userGalleryCurrentView === 'favorites' &&
						!output.is_favorited
					) &&
					!output.is_deleted}
				<div
					key={virtualItem.index}
					style="
							width: calc(((100% - {padding * 2}px) / {cols});
							left: calc({padding}px + ((100% - {padding * 2}px) * {virtualItem.lane / cols}));
							height: {virtualItem.size}px;
							transform: translateY({virtualItem.start}px);
							top: 0;
						"
					class="w-full group absolute p-px"
				>
					<div class="w-full h-full relative">
						<ImagePlaceholder width={output.generation.width} height={output.generation.height} />
						<div
							class="absolute left-0 top-0 w-full h-full bg-c-bg-secondary transition overflow-hidden
								z-0 {cardType === 'generate'
								? output.image_url && !output.is_deleted
									? 'border-2 rounded-lg hover:border-c-primary'
									: 'border-2 rounded-lg'
								: 'border-2 rounded-xl'} {isOutputSelected
								? 'border-c-primary'
								: 'border-c-bg-secondary'} {isOutputHoverable ? 'hover:border-c-primary/75' : ''}"
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
											{isGalleryEditActive}
											useUpscaledImage={false}
											generation={{
												...output.generation,
												selected_output: output
											}}
										/>
									{/if}
								{:else}
									<div
										in:fade|local={{ duration: 200, easing: quadOut }}
										class="w-full h-full flex items-center bg-c-bg-secondary justify-center relative p-1"
									>
										{#if cardType === 'generate'}
											{@const sizeClasses =
												output.generation.height > output.generation.width
													? 'h-full max-h-[2rem] w-auto'
													: 'w-full max-w-[2rem] h-auto'}
											{#if output.status === 'failed-nsfw'}
												<IconEyeSlashOutline class="{sizeClasses} text-c-on-bg/50" />
											{:else}
												<IconSadFaceOutline class="{sizeClasses} text-c-on-bg/50" />
											{/if}
										{:else}
											<p class="text-sm text-c-on-bg/50 px-5 py-3 text-center leading-relaxed">
												{output.status === 'failed-nsfw'
													? $LL.Error.ImageWasNSFW()
													: $LL.Error.SomethingWentWrong()}
											</p>
										{/if}
									</div>
								{/if}
							{/if}
						</div>
					</div>
				</div>
			{/each}
		</div>
	{/if}
{/if}
