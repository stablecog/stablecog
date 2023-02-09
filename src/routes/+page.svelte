<script lang="ts">
	import GenerateBar from '$components/generateBar/GenerateBar.svelte';
	import MetaTag from '$components/MetaTag.svelte';
	import { elementreceive, elementsend, expandCollapse } from '$ts/animation/transitions';
	import {
		canonicalUrl,
		estimatedDurationBufferRatio,
		estimatedDurationDefault,
		guidanceScaleDefault,
		inferenceStepsDefault,
		maxSeed
	} from '$ts/constants/main';
	import { updateGenerationInDb } from '$ts/queries/indexedDb';
	import { computeRatePerSec } from '$ts/stores/computeRatePerSec';
	import type { TUpscaleStatus } from '$ts/types/main';
	import { onDestroy, onMount } from 'svelte';
	import ImagePlaceholder from '$components/ImagePlaceholder.svelte';
	import GenerationImage from '$components/generationImage/GenerationImage.svelte';
	import { advancedModeApp } from '$ts/stores/advancedMode';
	import { activeGeneration, activeOutput } from '$ts/stores/activeGeneration';
	import type { THomePageData } from '$routes/+page.server';
	import { isValue } from '$ts/helpers/isValue';
	import { shouldSubmitToGallery } from '$ts/stores/shouldSubmitToGallery';
	import SubmitToGallery from '$components/SubmitToGallery.svelte';
	import LL from '$i18n/i18n-svelte';
	import GenerationFullScreen from '$components/generationFullScreen/GenerationFullScreen.svelte';
	import {
		generationGuidanceScale,
		generationHeight,
		generationInferenceSteps,
		generationModelId,
		generationSchedulerId,
		generationSeed,
		generationWidth,
		negativePromptInputValue,
		promptInputValue
	} from '$ts/stores/generationSettings';
	import { homePageContainer } from '$ts/stores/homePageContainer';
	import Button from '$components/buttons/Button.svelte';
	import IconConfetti from '$components/icons/IconConfetti.svelte';
	import { streamId } from '$ts/stores/sse';
	import { generations, queueGeneration } from '$ts/stores/generation';
	import { schedulerIdDefault } from '$ts/constants/schedulers';

	export let data: THomePageData;

	let nowInterval: NodeJS.Timeout | undefined;
	let endTimestamp: number | undefined;
	let generationError: Error | undefined;
	let estimatedDuration = estimatedDurationDefault;
	let upscaleStatus: TUpscaleStatus;

	$: [$generationWidth, $generationHeight, $generationInferenceSteps], setEstimatedDuration();

	async function setEstimatedDuration() {
		if (!mounted) return;
		if (!$computeRatePerSec || !$generationWidth || !$generationHeight) {
			estimatedDuration = estimatedDurationDefault;
			return;
		}
		const rate = getComputeRate(
			Number($generationWidth),
			Number($generationHeight),
			Number($generationInferenceSteps)
		);
		estimatedDuration = Math.ceil((rate / $computeRatePerSec) * (1 + estimatedDurationBufferRatio));
	}

	async function onCreate() {
		if (!$streamId) {
			console.log('No stream id, cannot create generation');
			return;
		}
		if (!$promptInputValue) {
			!$promptInputValue && console.log('no input');
			return;
		}
		queueGeneration({
			prompt: $promptInputValue,
			negative_prompt:
				($advancedModeApp || isValue(data.negative_prompt)) && $negativePromptInputValue
					? $negativePromptInputValue
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
			num_outputs: 4
		});
	}

	const getComputeRate = (w: number, h: number, s: number) => {
		const area = Number(w) * Number(h);
		const steps = Number(s);
		const rate = area * Math.pow(steps, 1 / 2);
		return rate;
	};

	function onKeyDown({ key }: KeyboardEvent) {
		if ($activeGeneration !== undefined && upscaleStatus !== 'loading') {
			if (key === 'Escape') {
				activeGeneration.set(undefined);
			}
		}
	}

	async function onUpscale(event: CustomEvent<{ generation: TGenerationUI }>) {
		const { generation } = event.detail;
		const { imageUrl, upscaledImageUrl, computeRatePerSec, ...rest } = generation;
		try {
			await updateGenerationInDb(rest);
		} catch (error) {
			console.log('IndexDB error', error);
		}
		/* lastGeneration.upscaledImageDataB64 = rest.upscaledImageDataB64;
		if (rest.upscaledImageDataB64) {
			lastGeneration.upscaledImageUrl = urlFromBase64(rest.upscaledImageDataB64);
		}
		if ($activeGeneration) {
			activeGeneration.set(lastGeneration);
		} */
	}

	function onDelete(event: CustomEvent<{ generation: TGeneration }>) {
		const { generation } = event.detail;
		console.log('Deleted', generation);
		/* generationStatus = 'idle'; */
	}

	let mounted = false;

	onMount(() => {
		mounted = true;
		setEstimatedDuration();
	});

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
	class="w-full flex flex-col items-center flex-1 justify-center px-4 md:pt-4"
>
	<div class="w-full flex flex-col items-center justify-center">
		<div class="w-[calc(100%+2rem)] flex flex-col justify-start items-center z-0 -mx-4">
			<GenerateBar serverData={data} {onCreate} {estimatedDuration} />
			{#if $generations && $generations[0].status === 'failed'}
				<div
					transition:expandCollapse|local={{ duration: 300 }}
					class="flex flex-col justify-start origin-top rounded-2xl"
				>
					{#if generationError && generationError.message === 'NEW_VERSION_AVAILABLE'}
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
							{generationError
								? generationError.message === 'NSFW'
									? $LL.Error.NSFW()
									: generationError.message
								: $LL.Error.SomethingWentWrong()}
						</p>
					{/if}
				</div>
			{:else if $generations && $generations[0].id && $generations[0].status === 'succeeded' && $generations[0].outputs}
				<div
					transition:expandCollapse|local={{ duration: 300 }}
					class="w-full flex flex-row items-start justify-center rounded-xl origin-top relative z-0 px-4"
				>
					<div
						class="w-full max-w-7xl flex flex-row items-start justify-center md:px-5 gap-1 py-3 md:pt-0"
					>
						{#each $generations[0].outputs as output}
							<div class="max-w-[25%] w-full h-auto relative">
								<ImagePlaceholder width={$generations[0].width} height={$generations[0].height} />
								{#if !($activeGeneration && $activeOutput && $activeGeneration.id === $generations[0].id && $activeOutput.id === output.id)}
									<div
										class="absolute w-full h-full left-0 top-0 rounded-2xl bg-c-bg-secondary z-0 overflow-hidden border-4 
										shadow-lg shadow-c-shadow/[var(--o-shadow-normal)] border-c-bg-secondary group"
										in:elementreceive|local={{ key: $generations[0].id }}
										out:elementsend|local={{ key: $generations[0].id }}
									>
										<GenerationImage generation={$generations[0]} {output} />
									</div>
								{/if}
							</div>
						{/each}
					</div>
				</div>
			{/if}
			{#if $generations && $generations[0].status === 'succeeded' && $shouldSubmitToGallery === undefined}
				<SubmitToGallery />
			{/if}
		</div>
	</div>
</div>

{#if $activeGeneration && $activeOutput}
	<GenerationFullScreen
		bind:upscaleStatus
		on:delete={onDelete}
		on:upscale={onUpscale}
		output={$activeOutput}
		generation={$activeGeneration}
	/>
{/if}
