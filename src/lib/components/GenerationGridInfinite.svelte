<script lang="ts">
	import Button from '$components/buttons/Button.svelte';
	import GenerationImage from '$components/generationImage/GenerationImage.svelte';
	import IconLoadingSlim from '$components/icons/IconLoadingSlim.svelte';
	import ImagePlaceholder from '$components/ImagePlaceholder.svelte';
	import LL from '$i18n/i18n-svelte';
	import { elementreceive, elementsend } from '$ts/animation/transitions';
	import {
		activeGeneration,
		activeGenerationOutputId,
		activeGenerationOutputIndex,
		type TGeneration,
		type TGenerationOutputWithGeneration
	} from '$ts/stores/generation';
	import { MasonryInfiniteGrid } from '@egjs/svelte-infinitegrid';

	export let generationOutputsWithGeneration: TGenerationOutputWithGeneration[] | undefined =
		undefined;
	export let loading = true;

	const batchSize = 50;
	$: items =
		generationOutputsWithGeneration?.slice(0, batchSize).map((_, i) => ({
			groupKey: 0,
			key: i
		})) || Array.from({ length: batchSize }, (_, i) => ({ groupKey: 0, key: i }));

	function getItems(nextGroupKey: number) {
		const nextItems = [];
		for (let i = 0; i < batchSize; ++i) {
			const nextKey = nextGroupKey * batchSize + i;
			nextItems.push({ groupKey: nextGroupKey, key: nextKey });
		}
		return nextItems;
	}

	const getOutputIndex = (id: string, generation: TGeneration) => {
		const index = generation.outputs.findIndex((output) => output.id === id);
		return index === -1 ? 0 : index;
	};
</script>

{#if generationOutputsWithGeneration && generationOutputsWithGeneration.length > 0}
	<MasonryInfiniteGrid
		align="center"
		resizeDebounce={1}
		gap={0}
		column={0}
		threshold={1000}
		{items}
		let:visibleItems
	>
		{#each visibleItems as item (item.key)}
			<div class="w-full sm:w-1/2 md:w-1/3 lg:w-1/4 p-0.5">
				<div class="w-full relative group">
					<ImagePlaceholder
						width={generationOutputsWithGeneration
							? generationOutputsWithGeneration[item.key].generation.width
							: 512}
						height={generationOutputsWithGeneration
							? generationOutputsWithGeneration[item.key].generation.height
							: 512}
					/>
					{#if !$activeGeneration || $activeGenerationOutputIndex === undefined || $activeGenerationOutputId !== generationOutputsWithGeneration[item.key].id}
						<div
							in:elementreceive|local={{
								key: generationOutputsWithGeneration
									? generationOutputsWithGeneration[item.key].id
									: '1'
							}}
							out:elementsend|local={{
								key: generationOutputsWithGeneration
									? generationOutputsWithGeneration[item.key].id
									: '1'
							}}
							class="absolute left-0 top-0 w-full h-full rounded-xl bg-c-bg-secondary z-0 overflow-hidden border-4 
						shadow-lg shadow-c-shadow/[var(--o-shadow-normal)] border-c-bg-secondary"
						>
							{#if generationOutputsWithGeneration !== undefined}
								<GenerationImage
									generation={generationOutputsWithGeneration[item.key].generation}
									selectedOutputIndex={getOutputIndex(
										generationOutputsWithGeneration[item.key].id,
										generationOutputsWithGeneration[item.key].generation
									)}
								/>
							{/if}
						</div>
					{/if}
				</div>
			</div>
		{/each}
	</MasonryInfiniteGrid>
{:else if loading || !generationOutputsWithGeneration || items.length !== generationOutputsWithGeneration.length}
	<div class="w-full flex flex-col flex-1 items-center justify-center py-12">
		<IconLoadingSlim class="animate-spin-faster w-12 h-12 text-c-on-bg/50" />
	</div>
{:else}
	<div class="w-full flex-1 flex flex-col justify-center items-center pt-8 px-5 gap-6">
		<p class="text-c-on-bg/50">{$LL.History.NoGenerationsYet()}</p>
		<Button href="/">{$LL.Shared.StartGeneratingButton()}</Button>
		<div class="h-[1vh]" />
	</div>
{/if}
