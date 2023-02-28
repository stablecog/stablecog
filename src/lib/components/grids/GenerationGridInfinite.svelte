<script lang="ts">
	import Button from '$components/buttons/Button.svelte';
	import GenerationImage from '$components/generationImage/GenerationImage.svelte';
	import type { TGenerationImageCardType } from '$components/generationImage/types';
	import IconLoadingSlim from '$components/icons/IconLoadingSlim.svelte';
	import ImagePlaceholder from '$components/ImagePlaceholder.svelte';
	import LL from '$i18n/i18n-svelte';
	import { imageTransitionProps } from '$ts/animation/constants';
	import type { TUserGenerationFullOutputsPage } from '$ts/queries/userGenerations';
	import { activeGeneration } from '$userStores/generation';
	import type { CreateInfiniteQueryResult } from '@tanstack/svelte-query';
	import Masonry from 'svelte-bricks';
	import IntersectionObserver from 'svelte-intersection-observer';
	import { fly } from 'svelte/transition';

	export let generationsQuery: CreateInfiniteQueryResult<TUserGenerationFullOutputsPage, unknown>;
	export let cardType: TGenerationImageCardType;
	let bottomDiv: HTMLDivElement;

	let canAutoFetch = true;
	let canAutoFetchTimeout: NodeJS.Timeout;
	const autoFetchNextPage = () => {
		if (!canAutoFetch || $generationsQuery.isFetchingNextPage) return;
		clearTimeout(canAutoFetchTimeout);
		canAutoFetch = false;
		$generationsQuery.fetchNextPage();
		canAutoFetchTimeout = setTimeout(() => {
			canAutoFetch = true;
		}, 1000);
	};
</script>

{#if $generationsQuery.isInitialLoading}
	<div
		class="w-full flex flex-col text-c-on-bg/60 flex-1 py-6 px-4 justify-center items-center text-center"
	>
		<div class="w-16 h-16">
			<IconLoadingSlim class="animate-spin-faster w-full h-full" />
		</div>
		<p class="mt-2 opacity-0">{$LL.Gallery.SearchingTitle()}</p>
		<div class="h-[2vh]" />
	</div>
{:else if $generationsQuery.isSuccess && $generationsQuery.data.pages.length > 0}
	<Masonry
		items={$generationsQuery.data.pages.flatMap((page) => page.outputs)}
		let:item={output}
		minColWidth={300}
		maxColWidth={600}
		gap={0}
		animate={false}
	>
		<div class="w-full p-0.5">
			<div class="w-full relative group">
				<ImagePlaceholder width={output.generation.width} height={output.generation.height} />
				{#if $activeGeneration === undefined || $activeGeneration.selected_output.id !== output.id}
					<div
						transition:fly|local={imageTransitionProps}
						class="absolute left-0 top-0 w-full h-full rounded-xl bg-c-bg-secondary transition border-4
										border-c-bg-secondary z-0 overflow-hidden shadow-lg shadow-c-shadow/[var(--o-shadow-normal)]"
					>
						{#if output.generation.outputs !== undefined}
							<GenerationImage
								{cardType}
								useUpscaledImage={false}
								generation={{ ...output.generation, selected_output: output }}
							/>
						{/if}
					</div>
				{/if}
			</div>
		</div>
	</Masonry>
	{#if $generationsQuery.hasNextPage}
		<IntersectionObserver on:intersect={autoFetchNextPage} rootMargin="100%" element={bottomDiv}>
			<div bind:this={bottomDiv} class="w-full flex flex-row items-center justify-center mt-6">
				<Button
					withSpinner
					size="sm"
					loading={$generationsQuery.isFetchingNextPage}
					onClick={() => $generationsQuery.fetchNextPage()}
				>
					{$LL.Shared.LoadMoreButton()}
				</Button>
			</div>
		</IntersectionObserver>
	{/if}
{/if}
