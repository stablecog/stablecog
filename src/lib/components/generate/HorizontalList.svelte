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

	export let generationsQuery: CreateInfiniteQueryResult<TUserGenerationFullOutputsPage, unknown>;
	export let pinnedFullOutputs: TGenerationFullOutput[] | undefined = undefined;
	export let cardType: TGenerationImageCardType;
	export let imageHeight: number;
	let scroll: number;
	let wrapperWidth: number;
	let containerWidth: number;

	$: outputs = $generationsQuery.data?.pages
		? [
				...(pinnedFullOutputs ?? []),
				...$generationsQuery.data?.pages.flatMap((page) => page.outputs)
		  ]
		: undefined;
</script>

{#if $generationsQuery.isInitialLoading}
	<div class="w-full px-2 pt-2 flex flex-row items-center justify-center">
		<div
			style="height: {imageHeight}px;"
			class="w-full flex flex-col text-c-on-bg/60 justify-center items-center text-center overflow-hidden relative z-0"
		>
			<IconAnimatedSpinner class="w-7 h-7" />
		</div>
	</div>
{:else if $generationsQuery.isSuccess && $generationsQuery.data.pages.length > 0 && outputs !== undefined && outputs !== undefined}
	<div class="w-full z-0 flex flex-row justify-start items-center overflow-hidden relative">
		<div
			bind:clientWidth={wrapperWidth}
			on:scroll={(e) => {
				scroll = e.currentTarget.scrollLeft;
			}}
			class="overflow-y-hidden overflow-x-auto flex flex-row overflow-auto 
      items-center justify-start hide-scrollbar list-fade-horizontal"
		>
			<div bind:clientWidth={containerWidth} class="flex flex-row gap-1 px-2 pt-2">
				{#each outputs as output}
					{@const status = output.status}
					{@const animation = output.animation}
					<div
						style="height: {imageHeight}px; width: {(output.generation.width /
							output.generation.height) *
							imageHeight}px;"
						class="relative group flex-shrink-0"
					>
						<ImagePlaceholder width={output.generation.width} height={output.generation.height} />
						<div
							class="absolute left-0 top-0 w-full h-full bg-c-bg-secondary transition 
              z-0 rounded-md border overflow-hidden border-c-bg-secondary {!$isTouchscreen
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
									<div
										in:fade|local={{ duration: 200, easing: quadOut }}
										class="w-full h-full flex items-center bg-c-bg-secondary justify-center relative"
									>
										<p class="text-sm text-c-on-bg/50 px-5 py-3 text-center leading-relaxed">
											{status === 'failed-nsfw'
												? $LL.Error.ImageWasNSFW()
												: $LL.Error.SomethingWentWrong()}
										</p>
									</div>
								{/if}
							{/if}
						</div>
					</div>
				{/each}
			</div>
		</div>
		<div
			class="absolute left-0 top-0 w-16 h-full bg-gradient-to-r from-c-bg to-c-bg/0 transition 
      duration-100 pointer-events-none {scroll > 0 ? 'opacity-100' : 'opacity-0'}"
		/>
		<div
			class="absolute right-0 top-0 w-16 h-full bg-gradient-to-l from-c-bg to-c-bg/0 transition duration-100 pointer-events-none {!containerWidth ||
			!wrapperWidth ||
			!scroll ||
			scroll < containerWidth - wrapperWidth
				? 'opacity-100'
				: 'opacity-0'}"
		/>
	</div>
{/if}
