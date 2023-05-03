<script lang="ts">
	import Button from '$components/buttons/Button.svelte';
	import GenerationImage from '$components/generationImage/GenerationImage.svelte';
	import type { TGenerationImageCardType } from '$components/generationImage/types';
	import ImagePlaceholder from '$components/ImagePlaceholder.svelte';
	import LL from '$i18n/i18n-svelte';
	import {
		generationsPerPage,
		type TUserGenerationFullOutputsPage
	} from '$ts/queries/userGenerations';
	import type { CreateInfiniteQueryResult } from '@tanstack/svelte-query';
	import { MasonryInfiniteGrid } from '@egjs/svelte-infinitegrid';
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
	import { windowHeight } from '$ts/stores/window';
	import GenerateGridPlaceholder from '$components/generate/GenerateGridPlaceholder.svelte';
	import IconEyeSlashOutline from '$components/icons/IconEyeSlashOutline.svelte';
	import IconSadFaceOutline from '$components/icons/IconSadFaceOutline.svelte';
	import { removeRepeatingOutputs } from '$ts/helpers/removeRepeatingOutputs';
	export let generationsQuery: CreateInfiniteQueryResult<TUserGenerationFullOutputsPage, unknown>;
	export let pinnedFullOutputs: TGenerationFullOutput[] | undefined = undefined;
	export let rerenderKey: string;
	export let cardType: TGenerationImageCardType;
	export let gridClasses = 'w-full flex-1';
	export let cardWidthClasses = 'w-1/2 sm:w-1/3 lg:w-1/4 xl:w-1/5 2xl:w-1/6 3xl:w-1/7';
	export let gridScrollContainer: HTMLElement | undefined = undefined;
	export let noLoadingSpinnerAlignmentAdjustment = false;
	export let hasPlaceholder = false;
	export let bottomElementClass: string | undefined = undefined;

	let _gridScrollContainer: HTMLElement;
	let selectedScrollContainer: HTMLElement;

	$: selectedScrollContainer = gridScrollContainer ?? _gridScrollContainer;

	let lastRerenderKey = rerenderKey;

	$: onlyOutputs = $generationsQuery.data?.pages.flatMap((page) => page.outputs);

	let outputs: TGenerationFullOutput[] | undefined;

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

	$: items = outputs?.map((output, index) => ({
		key: index,
		id: output.id,
		groupKey: Math.floor(index / generationsPerPage)
	}));

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

	let ig: MasonryInfiniteGrid;

	$: rerenderKey, rerenderGrid();
	function rerenderGrid() {
		if (!ig) return;
		if (lastRerenderKey !== rerenderKey) {
			ig.updateItems();
			lastRerenderKey = rerenderKey;
		}
	}
</script>

{#if $generationsQuery.isInitialLoading}
	<div
		class="w-full flex flex-col text-c-on-bg/60 flex-1 py-6 px-4 justify-center items-center text-center"
	>
		<IconAnimatedSpinner class="w-12 h-12" />
		<p class="mt-2 opacity-0">{$LL.Gallery.SearchingTitle()}</p>
		<div class="h-[2vh] {noLoadingSpinnerAlignmentAdjustment ? 'hidden' : ''}" />
	</div>
{:else if hasPlaceholder && $generationsQuery.isSuccess && outputs !== undefined && outputs.length === 0}
	<GenerateGridPlaceholder text={$LL.Generate.Grid.NoGeneration.Paragraph()} />
{:else if $generationsQuery.isSuccess && $generationsQuery.data.pages.length > 0 && outputs !== undefined && items !== undefined}
	<div class={gridClasses} bind:this={_gridScrollContainer}>
		<MasonryInfiniteGrid
			resizeDebounce={200}
			scrollContainer={selectedScrollContainer}
			bind:this={ig}
			{items}
			let:visibleItems
			align="center"
			threshold={($windowHeight || 1000) * 5}
			on:requestAppend={({ detail: e }) => {
				e.wait();
				if ($generationsQuery.isFetchingNextPage || !$generationsQuery.hasNextPage) {
					e.ready();
					return;
				}
				$generationsQuery.fetchNextPage().finally(() => e.ready());
			}}
		>
			{#each visibleItems as item (item.key)}
				{@const output = outputs[item.key]}
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
				{@const status = output.status}
				{@const animation = output.animation}
				<div style="position: absolute;left: -9999px;top: -9999px;" class="{cardWidthClasses} p-px">
					<div class="w-full relative group">
						<ImagePlaceholder width={output.generation.width} height={output.generation.height} />
						<div
							class="absolute left-0 top-0 w-full h-full bg-c-bg-secondary transition overflow-hidden 
							z-0 shadow-lg shadow-c-shadow/[var(--o-shadow-normal)] {cardType === 'generate'
								? output.image_url && !output.is_deleted
									? 'border-2 rounded-lg hover:border-c-primary'
									: 'border-2 rounded-lg'
								: 'border-2 rounded-xl'} {isOutputSelected
								? 'border-c-primary'
								: 'border-c-bg-secondary'} {isOutputHoverable ? 'hover:border-c-primary/75' : ''}"
						>
							{#if output.generation.outputs !== undefined}
								{#if status !== 'failed' && status !== 'failed-nsfw'}
									{#if status !== undefined && status !== 'succeeded' && animation !== undefined}
										<div
											out:fade|local={{ duration: 3000, easing: quadIn }}
											class="w-full h-full absolute left-0 top-0"
										>
											<GenerationAnimation {animation} />
										</div>
									{/if}
									{#if status === undefined || status === 'succeeded'}
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
											{#if status === 'failed-nsfw'}
												<IconEyeSlashOutline class="{sizeClasses} text-c-on-bg/50" />
											{:else}
												<IconSadFaceOutline class="{sizeClasses} text-c-on-bg/50" />
											{/if}
										{:else}
											<p class="text-sm text-c-on-bg/50 px-5 py-3 text-center leading-relaxed">
												{status === 'failed-nsfw'
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
		</MasonryInfiniteGrid>
	</div>
	{#if $generationsQuery.hasNextPage}
		<div class="w-full flex flex-row items-center justify-center mt-6">
			<Button
				withSpinner
				size="sm"
				loading={$generationsQuery.isFetchingNextPage}
				onClick={() => $generationsQuery.fetchNextPage()}
			>
				{$LL.Shared.LoadMoreButton()}
			</Button>
		</div>
	{/if}
	{#if bottomElementClass}
		<div class={bottomElementClass} />
	{/if}
{/if}
