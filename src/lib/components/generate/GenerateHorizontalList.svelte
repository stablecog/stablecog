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
	import { VariableSizeList as List, styleString as sty } from 'svelte-window';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';

	export let generationsQuery: CreateInfiniteQueryResult<TUserGenerationFullOutputsPage, unknown>;
	export let pinnedFullOutputs: TGenerationFullOutput[] | undefined = undefined;
	export let cardType: TGenerationImageCardType;

	let scroll = 0;
	let listElement: HTMLDivElement;
	let listComponent: List;
	const listPadding = 6;
	let wrapperWidth: number;
	let wrapperHeight: number;
	let containerHeight: number;
	let placeholderInnerContainerHeight: number;

	$: onlyOutputs = $generationsQuery.data?.pages.flatMap((page) => page.outputs);
	$: onlyOutputsIdsMap = onlyOutputs
		? new Map<string, boolean>(onlyOutputs.map((output) => [output.id, true]))
		: new Map<string, boolean>([]);

	let outputs: TGenerationFullOutput[] | undefined;

	$: [onlyOutputs, pinnedFullOutputs], setOutputs();

	const overscanPagesCount = 5;
	const overscanColsCount = 10;
	$: listWidth =
		wrapperHeight !== undefined
			? outputs?.reduce((acc, output) => {
					return acc + (wrapperHeight * output.generation.width) / output.generation.height;
			  }, 0)
			: 0;
	$: listEndReached =
		listWidth !== undefined && wrapperWidth !== undefined && scroll !== undefined
			? scroll + wrapperWidth >= listWidth + listPadding
			: false;
	$: listAtStart = scroll <= 0;
	$: totalPages =
		listWidth !== undefined && wrapperWidth !== undefined
			? Math.floor((listWidth - wrapperWidth) / wrapperWidth)
			: 0;
	$: currentPage = totalPages !== undefined ? Math.floor(scroll / wrapperWidth) : 0;
	$: hasMore = $generationsQuery.hasNextPage ?? false;

	$: currentPage, onPageChanged();

	function onPageChanged() {
		if (!hasMore) return;
		if (currentPage === 0) return;
		if ($generationsQuery.isFetchingNextPage) return;
		if (currentPage + overscanPagesCount >= totalPages) {
			console.log('fetching next page');
			$generationsQuery.fetchNextPage();
		}
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
		let filteredPinnedOutputs: TGenerationFullOutput[] = [];
		pinnedFullOutputs.forEach((o) => {
			if (!onlyOutputsIdsMap.has(o.id)) {
				filteredPinnedOutputs.push(o);
			}
		});

		let newOutputs = [...onlyOutputs];
		filteredPinnedOutputs.forEach((filteredOutput) => {
			const newerThanIndex = newOutputs.findIndex(
				(newOutput) =>
					new Date(filteredOutput.generation.created_at).getTime() >
					new Date(newOutput.generation.created_at).getTime()
			);
			if (newerThanIndex === -1) {
				newOutputs.unshift(filteredOutput);
			} else {
				newOutputs.splice(newerThanIndex, 0, filteredOutput);
			}
		});
		outputs = newOutputs;
	}

	let firstOutputId: string | undefined = undefined;
	$: [outputs], onOutputsChanged();

	function onOutputsChanged() {
		if (!browser) return;
		if (!outputs) return;
		if (firstOutputId === undefined) {
			firstOutputId = outputs[0].id;
			return;
		}
		if (firstOutputId !== outputs[0].id) {
			firstOutputId = outputs[0].id;
			listComponent.instance.resetAfterIndex(0);
		}
	}
</script>

{#if $generationsQuery.isInitialLoading}
	<div class="w-full h-full pt-1.5 md:pb-1.5">
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
{:else if $generationsQuery.isSuccess && $generationsQuery.data.pages.length > 0 && outputs !== undefined && outputs !== undefined}
	<div
		class="w-full h-full z-0 flex flex-row justify-start items-center overflow-hidden relative pt-1.5 md:pb-1.5"
	>
		<div bind:clientWidth={wrapperWidth} bind:clientHeight={wrapperHeight} class="w-full h-full">
			{#if browser && outputs !== undefined && wrapperWidth !== undefined && wrapperHeight !== undefined}
				<List
					bind:this={listComponent}
					innerRef={listElement}
					overscanCount={overscanColsCount}
					direction="horizontal"
					width={wrapperWidth}
					height={wrapperHeight}
					itemCount={outputs.length}
					onScroll={(p) => (scroll = p.scrollOffset)}
					itemSize={(i) => {
						// @ts-ignore
						const output = outputs[i];
						return (wrapperHeight * output.generation.width) / output.generation.height;
					}}
					let:items
					className="hide-scrollbar pr-3"
				>
					{#each items as it (it.key)}
						{@const output = outputs[it.index]}
						{@const status = output.status}
						{@const animation = output.animation}
						<div
							style={sty({
								...it.style,
								left: (it.style.left ?? 0) + listPadding
							})}
						>
							<div class="w-full h-full p-2px">
								<div class="w-full h-full relative group">
									<ImagePlaceholder
										{containerHeight}
										width={output.generation.width}
										height={output.generation.height}
									/>
									<div
										class="absolute left-0 top-0 w-full h-full bg-c-bg-secondary transition 
										z-0 rounded-md border overflow-hidden border-c-bg-secondary {!$isTouchscreen &&
										status !== 'failed' &&
										status !== 'failed-nsfw'
											? 'hover:border-c-primary'
											: ''}"
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
													{#if status === 'failed-nsfw'}
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
				</List>
			{/if}
			<!-- <div
				bind:clientWidth={containerWidth}
				class="h-full flex flex-row justify-start gap-1 {containerClasses}"
			>
				<div bind:clientHeight={containerHeight} class="h-full flex flex-row justify-start gap-1">
					{#each outputs as output}
						{@const status = output.status}
						{@const animation = output.animation}
						<div class="relative group">
							<ImagePlaceholder
								{containerHeight}
								width={output.generation.width}
								height={output.generation.height}
							/>
							<div
								class="absolute left-0 top-0 w-full h-full bg-c-bg-secondary transition 
								z-0 rounded-md border overflow-hidden border-c-bg-secondary {!$isTouchscreen &&
								status !== 'failed' &&
								status !== 'failed-nsfw'
									? 'hover:border-c-primary'
									: ''}"
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
											{#if status === 'failed-nsfw'}
												<IconEyeSlashOutline class="{sizeClasses} text-c-on-bg/50" />
											{:else}
												<IconSadFaceOutline class="{sizeClasses} text-c-on-bg/50" />
											{/if}
										</div>
									{/if}
								{/if}
							</div>
						</div>
					{/each}
				</div>
			</div> -->
		</div>
		<div
			class="absolute left-0 top-0 w-16 h-full bg-gradient-to-r from-c-bg to-c-bg/0 transition 
      duration-100 pointer-events-none {listAtStart ? 'opacity-0' : 'opacity-100'}"
		/>
		<div
			class="absolute right-0 top-0 w-16 h-full bg-gradient-to-l from-c-bg to-c-bg/0 transition 
			duration-100 pointer-events-none {listEndReached ? 'opacity-0' : 'opacity-100'}"
		/>
	</div>
{/if}
