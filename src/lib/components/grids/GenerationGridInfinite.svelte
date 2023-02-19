<script lang="ts">
	import Button from '$components/buttons/Button.svelte';
	import GenerationImage from '$components/generationImage/GenerationImage.svelte';
	import IconLoadingSlim from '$components/icons/IconLoadingSlim.svelte';
	import ImagePlaceholder from '$components/ImagePlaceholder.svelte';
	import LL from '$i18n/i18n-svelte';
	import { elementreceive, elementsend } from '$ts/animation/transitions';
	import type { TUserGenerationFullOutputsPage } from '$ts/queries/userGenerations';
	import { activeGeneration } from '$ts/stores/generation';
	import type { CreateInfiniteQueryResult } from '@tanstack/svelte-query';
	import Masonry from 'svelte-bricks';
	import IntersectionObserver from 'svelte-intersection-observer';

	export let generationsQuery: CreateInfiniteQueryResult<TUserGenerationFullOutputsPage, unknown>;
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

{#if $generationsQuery.isLoading}
	<div class="w-full flex flex-col flex-1 items-center justify-center py-12">
		<IconLoadingSlim class="animate-spin-faster w-12 h-12 text-c-on-bg/50" />
	</div>
{:else if $generationsQuery.data?.pages.length === 0}
	<div class="w-full flex-1 flex flex-col justify-center items-center py-8 px-5 gap-6">
		<p class="text-c-on-bg/50">{$LL.History.NoGenerationsYet()}</p>
		<Button href="/">{$LL.Shared.StartGeneratingButton()}</Button>
		<div class="h-[1vh]" />
	</div>
{:else if $generationsQuery.isSuccess}
	{#if $generationsQuery.data.pages.length === 1 && $generationsQuery.data.pages[0].outputs.length === 0}
		<div class="w-full flex-1 flex flex-col justify-center items-center py-8 px-5 gap-6">
			<p class="text-c-on-bg/50">{$LL.History.NoGenerationsYet()}</p>
			<Button href="/">{$LL.Shared.StartGeneratingButton()}</Button>
			<div class="h-[1vh]" />
		</div>
	{:else}
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
							in:elementreceive|local={{
								key: output.id
							}}
							out:elementsend|local={{
								key: output.id
							}}
							class="absolute left-0 top-0 w-full h-full rounded-xl bg-c-bg-secondary z-0 overflow-hidden border-4 
										shadow-lg shadow-c-shadow/[var(--o-shadow-normal)] border-c-bg-secondary"
						>
							{#if output.generation.outputs !== undefined}
								<GenerationImage generation={{ ...output.generation, selected_output: output }} />
							{/if}
						</div>
					{/if}
				</div>
			</div>
		</Masonry>
		<IntersectionObserver on:intersect={autoFetchNextPage} rootMargin="100%" element={bottomDiv}>
			<div bind:this={bottomDiv} class="w-full flex flex-row items-center justify-center mt-6">
				{#if $generationsQuery.hasNextPage}
					<Button
						withSpinner
						size="sm"
						loading={$generationsQuery.isFetchingNextPage}
						onClick={() => $generationsQuery.fetchNextPage()}
					>
						{$LL.Shared.LoadMoreButton()}
					</Button>
				{/if}
			</div>
		</IntersectionObserver>
	{/if}
{/if}
