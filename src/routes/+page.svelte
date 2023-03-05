<script lang="ts">
	import GenerateBar from '$components/generateBar/GenerateBar.svelte';
	import MetaTag from '$components/MetaTag.svelte';
	import { expandCollapse } from '$ts/animation/transitions';
	import {
		canonicalUrl,
		guidanceScaleDefault,
		inferenceStepsDefault,
		maxSeed
	} from '$ts/constants/main';
	import { onDestroy } from 'svelte';
	import ImagePlaceholder from '$components/ImagePlaceholder.svelte';
	import GenerationImage from '$components/generationImage/GenerationImage.svelte';
	import { advancedModeApp } from '$ts/stores/advancedMode';
	import {
		logGeneration,
		logGenerationPropsFromGeneration,
		uLogGeneration
	} from '$ts/helpers/loggers';
	import {
		activeGeneration,
		generations,
		queueInitialGenerationRequest,
		type TInitialGenerationRequest
	} from '$userStores/generation';
	import type { THomePageData } from '$routes/+page.server';
	import { isValue } from '$ts/helpers/isValue';
	import { shouldSubmitToGallery } from '$ts/stores/shouldSubmitToGallery';
	import SubmitToGallery from '$components/SubmitToGallery.svelte';
	import LL, { locale } from '$i18n/i18n-svelte';
	import GenerationFullScreen from '$components/generationFullScreen/GenerationFullScreen.svelte';
	import {
		generationGuidanceScale,
		generationHeight,
		generationInferenceSteps,
		generationModelId,
		generationNumOutputs,
		generationSchedulerId,
		generationSeed,
		generationWidth,
		negativePromptInputValue,
		promptInputValue
	} from '$ts/stores/generationSettings';
	import { page } from '$app/stores';
	import { homePageContainer } from '$ts/stores/homePageContainer';
	import Button from '$components/buttons/Button.svelte';
	import IconConfetti from '$components/icons/IconConfetti.svelte';
	import { schedulerIdDefault } from '$ts/constants/schedulers';
	import { sseId } from '$userStores/sse';
	import { generateSSEId } from '$ts/helpers/generateSSEId';
	import { imageTransitionProps } from '$ts/animation/constants';
	import { fly } from 'svelte/transition';
	import { userSummary } from '$ts/stores/user/summary';
	import LowOnCreditsCard from '$components/LowOnCreditsCard.svelte';

	export let data: THomePageData;

	let nowInterval: NodeJS.Timeout | undefined;

	async function queueGeneration() {
		if (!$promptInputValue) {
			console.log("No prompt, can't create generation");
			return;
		}
		if (!$sseId) {
			console.log("No SSE ID, can't create generation");
			return;
		}
		const initialRequestProps: TInitialGenerationRequest = {
			prompt: {
				id: 'prompt',
				text: $promptInputValue
			},
			negative_prompt:
				($advancedModeApp || isValue(data.negative_prompt)) && $negativePromptInputValue
					? {
							id: 'negative_prompt',
							text: $negativePromptInputValue
					  }
					: undefined,
			model_id: $generationModelId,
			scheduler_id:
				$advancedModeApp || data.scheduler_id ? $generationSchedulerId : schedulerIdDefault,
			width: Number($generationWidth),
			height: Number($generationHeight),
			guidance_scale: Number(
				$advancedModeApp || data.guidance_scale ? $generationGuidanceScale : guidanceScaleDefault
			),
			inference_steps: Number(
				$advancedModeApp || data.num_inference_steps
					? $generationInferenceSteps
					: inferenceStepsDefault
			),
			seed:
				$generationSeed !== undefined &&
				$generationSeed !== null &&
				$generationSeed !== '' &&
				($advancedModeApp || isValue(data.seed))
					? Number($generationSeed)
					: Math.round(Math.random() * maxSeed),
			num_outputs: Number($generationNumOutputs),
			output_image_extension: 'jpeg',
			process_type: 'generate',
			stream_id: $sseId,
			ui_id: generateSSEId(),
			submit_to_gallery: $shouldSubmitToGallery ?? false
		};
		uLogGeneration('Started');
		logGeneration(
			'Started',
			logGenerationPropsFromGeneration({
				generation: initialRequestProps,
				advancedModeApp: $advancedModeApp,
				locale: $locale,
				stripeProductId: $userSummary?.product_id
			})
		);
		queueInitialGenerationRequest(initialRequestProps);
	}

	function onKeyDown({ key }: KeyboardEvent) {
		if ($activeGeneration !== undefined) {
			if (key === 'Escape') {
				activeGeneration.set(undefined);
			}
		}
	}

	const lowCreditsThreshold = 10;

	onDestroy(() => {
		clearInterval(nowInterval);
	});
</script>

<MetaTag
	title="Stablecog"
	description="Free, easy to use, multilingual and open-source AI image generator using Stable Diffusion."
	imageUrl="{canonicalUrl}/previews/home.png"
	canonical={canonicalUrl}
/>

<svelte:window on:keydown={onKeyDown} />

<div
	bind:this={$homePageContainer}
	class="w-full flex flex-col items-center flex-1 justify-center px-3 md:pt-4"
>
	<div class="w-full flex flex-col items-center justify-center">
		<div class="w-[calc(100%+2rem)] flex flex-col justify-start items-center z-0 -mx-4">
			{#if $page.data.session?.user.id && $userSummary && $userSummary.total_remaining_credits < lowCreditsThreshold}
				<div
					transition:expandCollapse|local={{ duration: 300 }}
					class="w-full flex flex-col justify-start items-center px-4 md:px-8"
				>
					<div class="px-1 pt-1 pb-4">
						<LowOnCreditsCard />
					</div>
				</div>
			{/if}
			<GenerateBar serverData={data} {queueGeneration} />
			{#if $generations.length > 0 && $generations[0].status === 'failed'}
				<div
					transition:expandCollapse|local={{ duration: 300 }}
					class="flex flex-col justify-start origin-top rounded-2xl"
				>
					{#if $generations[0].error === 'NEW_VERSION_AVAILABLE'}
						<div class="w-full max-w-md py-2 md:py-0 px-4">
							<div
								class="w-full flex flex-col items-center p-3 md:p-4 bg-c-primary/8 border-2 border-c-primary/8 rounded-2xl"
							>
								<div class="w-full flex justify-start items-center gap-3 -mt-0.5 md:-mt-1 px-2">
									<IconConfetti class="w-7 h-7 flex-shrink-0 text-c-primary" />
									<p class="flex-1 min-w-0 leading-normal text-c-primary text-left">
										{$LL.Error.NewVersionAvailable()}
									</p>
								</div>
								<Button onClick={() => document.location.reload()} size="sm" class="mt-4 w-full">
									{$LL.Shared.RefreshButton()}
								</Button>
							</div>
						</div>
					{:else}
						<p
							class="w-full max-w-2xl leading-relaxed text-c-on-bg/40 text-center py-4 md:py-2 px-6"
						>
							{#if $generations[0].error}
								{$generations[0].error === 'NSFW' ? $LL.Error.NSFW() : $generations[0].error}
							{:else}
								{$LL.Error.SomethingWentWrong()}
							{/if}
						</p>
					{/if}
				</div>
			{:else if $generations && $generations.length > 0 && $generations[0].outputs && $generations[0].status === 'succeeded'}
				<div
					transition:expandCollapse|local={{ duration: 300 }}
					class="w-full flex items-start justify-center rounded-xl origin-top relative z-0 px-3"
				>
					<div
						class="w-full max-w-7xl flex flex-wrap items-start justify-center md:px-4 py-3 md:pt-0"
					>
						{#each $generations[0].outputs as output}
							<div class="p-0.5 w-1/2 lg:w-1/4 max-w-xs lg:max-w-auto">
								<div class="w-full h-auto relative">
									<ImagePlaceholder width={$generations[0].width} height={$generations[0].height} />
									{#if $activeGeneration === undefined || $activeGeneration.selected_output.id !== output.id}
										<div
											class="absolute w-full h-full left-0 top-0 rounded-2xl bg-c-bg-secondary z-0 overflow-hidden border-4 
												shadow-lg shadow-c-shadow/[var(--o-shadow-normal)] border-c-bg-secondary group"
											transition:fly|local={imageTransitionProps}
										>
											<GenerationImage
												generation={{ ...$generations[0], selected_output: output }}
												useUpscaledImage
												cardType="generate"
											/>
										</div>
									{/if}
								</div>
							</div>
						{/each}
					</div>
				</div>
			{/if}
			{#if $generations.length > 0 && $generations[0].status === 'succeeded' && $shouldSubmitToGallery === undefined}
				<SubmitToGallery />
			{/if}
		</div>
	</div>
</div>

{#if $activeGeneration}
	<GenerationFullScreen generation={$activeGeneration} modalType="generate" />
{/if}
