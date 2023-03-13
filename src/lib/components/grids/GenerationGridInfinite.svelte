<script lang="ts">
	import Button from '$components/buttons/Button.svelte';
	import GenerationImage from '$components/generationImage/GenerationImage.svelte';
	import type { TGenerationImageCardType } from '$components/generationImage/types';
	import ImagePlaceholder from '$components/ImagePlaceholder.svelte';
	import LL from '$i18n/i18n-svelte';
	import { imageTransitionProps } from '$ts/animation/constants';
	import {
		generationsPerPage,
		type TUserGenerationFullOutputsPage
	} from '$ts/queries/userGenerations';
	import { activeGeneration } from '$userStores/generation';
	import type { CreateInfiniteQueryResult } from '@tanstack/svelte-query';
	import { MasonryInfiniteGrid } from '@egjs/svelte-infinitegrid';
	import { fly } from 'svelte/transition';
	import { adminGalleryActionableItems, isAdminGalleryEditActive } from '$ts/stores/admin/gallery';
	import IconAnimatedSpinner from '$components/icons/IconAnimatedSpinner.svelte';

	export let generationsQuery: CreateInfiniteQueryResult<TUserGenerationFullOutputsPage, unknown>;
	export let cardType: TGenerationImageCardType;

	$: outputs = $generationsQuery.data?.pages.flatMap((page) => page.outputs);
	$: items = outputs?.map((output, index) => ({
		key: index,
		id: output.id,
		groupKey: Math.floor(index / generationsPerPage)
	}));
</script>

{#if $generationsQuery.isInitialLoading}
	<div
		class="w-full flex flex-col text-c-on-bg/60 flex-1 py-6 px-4 justify-center items-center text-center"
	>
		<IconAnimatedSpinner class="w-12 h-12" />
		<p class="mt-2 opacity-0">{$LL.Gallery.SearchingTitle()}</p>
		<div class="h-[2vh]" />
	</div>
{:else if $generationsQuery.isSuccess && $generationsQuery.data.pages.length > 0 && outputs !== undefined && items !== undefined}
	<div class="w-full flex-1">
		<MasonryInfiniteGrid
			{items}
			let:visibleItems
			align="center"
			on:requestAppend={() => {
				if ($generationsQuery.isFetchingNextPage) return;
				if (!$generationsQuery.hasNextPage) return;
				$generationsQuery.fetchNextPage();
			}}
		>
			{#each visibleItems as item (item.key)}
				<div
					class="w-1/2 sm:w-1/3 lg:w-1/4 {cardType === 'history'
						? ''
						: 'xl:w-1/5 2xl:w-1/6 3xl:w-1/7'} p-0.5"
				>
					<div class="w-full relative group">
						<ImagePlaceholder
							width={outputs[item.key].generation.width}
							height={outputs[item.key].generation.height}
						/>
						{#if $activeGeneration === undefined || $activeGeneration.selected_output.id !== outputs[item.key].id}
							<div
								transition:fly|local={imageTransitionProps}
								class="absolute left-0 top-0 w-full h-full rounded-xl bg-c-bg-secondary transition border-4 {cardType ===
									'admin-gallery' &&
								$isAdminGalleryEditActive &&
								$adminGalleryActionableItems.map((i) => i.id).includes(outputs[item.key].id)
									? 'border-c-primary'
									: 'border-c-bg-secondary'}
										 z-0 overflow-hidden shadow-lg shadow-c-shadow/[var(--o-shadow-normal)]"
							>
								{#if outputs[item.key].generation.outputs !== undefined}
									<GenerationImage
										{cardType}
										useUpscaledImage={false}
										generation={{
											...outputs[item.key].generation,
											selected_output: outputs[item.key]
										}}
									/>
								{/if}
							</div>
						{/if}
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
{/if}
