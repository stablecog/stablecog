<script lang="ts">
	import GenerateBar from '$components/GenerateBar.svelte';
	import MetaTag from '$components/MetaTag.svelte';
	import { expandCollapse } from '$ts/animation/transitions';
	import {
		canonicalUrl,
		estimatedDurationBufferRatio,
		estimatedDurationDefault,
		guidanceScaleDefault,
		inferenceStepsDefault,
		type TAvailableHeights,
		type TAvailableInferenceSteps,
		type TAvailableWidths
	} from '$ts/constants/main';
	import { urlFromBase64 } from '$ts/helpers/base64';
	import { addGenerationToDb } from '$ts/queries/indexedDb';
	import { generateImage } from '$ts/queries/generateImage';
	import { computeRatePerSec } from '$ts/stores/computeRatePerSec';
	import { serverUrl } from '$ts/stores/serverUrl';
	import type { TGenerationUI, TStatus } from '$ts/types/main';
	import { onDestroy, onMount } from 'svelte';
	import ImagePlaceholder from '$components/ImagePlaceholder.svelte';
	import GenerationImage from '$components/GenerationImage.svelte';
	import { advancedMode } from '$ts/stores/advancedMode';
	import { serverHealth } from '$ts/stores/serverHealth';
	import SetServerModal from '$components/SetServerModal.svelte';

	let status: TStatus = 'idle';
	let promptInputValue: string | undefined;
	let negativePromptInputValue: string | undefined;
	let nowInterval: NodeJS.Timeout | undefined;
	let startTimestamp: number | undefined;
	let endTimestamp: number | undefined;
	let lastGeneration: TGenerationUI | undefined;
	let generationWidth: TAvailableWidths;
	let generationHeight: TAvailableHeights;
	let generationInferenceSteps: TAvailableInferenceSteps;
	let generationGuidanceScale: number;
	let generationSeed: number;
	let generationError: string | undefined;
	let estimatedDuration = estimatedDurationDefault;

	$: [generationWidth, generationHeight, generationInferenceSteps], setEstimatedDuration();

	async function setEstimatedDuration() {
		if (isCheckComplete) {
			if ($computeRatePerSec && generationWidth && generationHeight) {
				const rate = getComputeRate(
					Number(generationWidth),
					Number(generationHeight),
					Number(generationInferenceSteps)
				);
				estimatedDuration = Math.ceil(
					(rate / $computeRatePerSec) * (1 + estimatedDurationBufferRatio)
				);
			} else {
				estimatedDuration = estimatedDurationDefault;
			}
		}
	}

	async function onCreate() {
		if (!$serverUrl || !promptInputValue) {
			!promptInputValue && console.log('no input');
			!$serverUrl && console.log('no server url');
			return;
		}
		generationError = undefined;
		lastGeneration = {
			server_url: $serverUrl,
			prompt: promptInputValue,
			negative_prompt:
				$serverHealth.features?.includes('negative_prompt') &&
				negativePromptInputValue !== '' &&
				negativePromptInputValue !== undefined
					? negativePromptInputValue
					: undefined,
			width: Number(generationWidth),
			height: Number(generationHeight),
			guidance_scale: Number($advancedMode ? generationGuidanceScale : guidanceScaleDefault),
			num_inference_steps: Number($advancedMode ? generationInferenceSteps : inferenceStepsDefault),
			seed:
				generationSeed !== undefined && generationSeed !== null && $advancedMode
					? generationSeed
					: Math.floor(Math.random() * Math.pow(10, 15))
		};
		console.log('generation', lastGeneration);
		console.log('estimatedDuration', estimatedDuration);
		status = 'loading';
		endTimestamp = undefined;
		startTimestamp = Date.now();
		try {
			let res = await generateImage({
				server_url: lastGeneration.server_url,
				prompt: lastGeneration.prompt,
				negative_prompt: lastGeneration.negative_prompt,
				width: lastGeneration.width,
				height: lastGeneration.height,
				seed: lastGeneration.seed,
				guidance_scale: lastGeneration.guidance_scale,
				num_inference_steps: lastGeneration.num_inference_steps
			});
			let { data, error } = res;
			if (data && data.imageDataB64 && !error) {
				if ($serverHealth.status !== 'healthy') {
					serverHealth.set({ status: 'healthy', features: $serverHealth.features });
				}
				lastGeneration.duration_ms = data.duration_ms;
				try {
					await addGenerationToDb({
						...lastGeneration,
						imageDataB64: data.imageDataB64
					});
				} catch (error) {
					console.log('indexedDB error', error);
				}
				const imageUrl = urlFromBase64(data.imageDataB64);
				const img = new Image();
				img.src = imageUrl;
				img.onload = () => {
					if (lastGeneration) {
						lastGeneration.imageUrl = imageUrl;
						lastGeneration = lastGeneration;
					}
					if (lastGeneration && startTimestamp !== undefined) {
						const rate = getComputeRate(
							Number(generationWidth),
							Number(generationHeight),
							Number(generationInferenceSteps)
						);
						lastGeneration.computeRatePerSec = Math.ceil(
							rate / ((Date.now() - startTimestamp) / 1000)
						);
						computeRatePerSec.set(lastGeneration.computeRatePerSec);
						setEstimatedDuration();
					}
					status = 'success';
					console.log('image loaded for:', `"${lastGeneration?.prompt}"`);
				};
			} else {
				generationError = error;
				throw new Error(error);
			}
		} catch (error) {
			status = 'error';
			console.log(error);
		} finally {
			endTimestamp = Date.now();
			console.log('generation duration:', (endTimestamp - startTimestamp) / 1000, 's');
		}
	}

	const getComputeRate = (w: number, h: number, s: number) => {
		const area = Number(generationWidth) * Number(generationHeight);
		const steps = Number(generationInferenceSteps);
		const rate = area * Math.pow(steps, 1 / 2);
		return rate;
	};

	let isCheckComplete = false;
	onMount(async () => {
		setEstimatedDuration();
		isCheckComplete = true;
	});

	onDestroy(() => {
		clearInterval(nowInterval);
	});
</script>

<MetaTag
	title="Stablecog"
	description="Free & easy to use AI image generator using Stable Diffusion cogs. Connect your own instance or use one of the default servers."
	imageUrl="{canonicalUrl}/previews/home.png"
	canonical={canonicalUrl}
/>

<div class="w-full flex flex-col items-center flex-1 justify-center px-4">
	<div class="w-full flex flex-col items-center justify-center">
		{#if isCheckComplete && !$serverUrl}
			<SetServerModal isOnBarrier={false} />
		{:else}
			<div
				transition:expandCollapse|local={{ duration: 300 }}
				class="w-[calc(100%+2rem)] flex flex-col justify-start items-center overflow-hidden z-0 -mx-4"
			>
				<GenerateBar
					bind:promptInputValue
					bind:negativePromptInputValue
					bind:generationWidth
					bind:generationHeight
					bind:generationInferenceSteps
					bind:generationGuidanceScale
					bind:generationSeed
					{status}
					{onCreate}
					{startTimestamp}
					{estimatedDuration}
				/>
				{#if status === 'error'}
					<div
						transition:expandCollapse|local={{}}
						class="flex flex-col justify-start origin-top px-4"
					>
						<p class="w-full max-w-lg text-c-on-bg/40 text-center py-4">
							{generationError ?? 'Something went wrong :('}
						</p>
					</div>
				{:else if status === 'success' && lastGeneration && lastGeneration.imageUrl}
					{@const aspectRatio = lastGeneration.width / lastGeneration.height}
					<div
						transition:expandCollapse|local={{}}
						class="max-w-full overflow-hidden flex flex-col items-center justify-start rounded-xl origin-top relative z-0 px-4"
					>
						<div class="max-w-full flex flex-col items-center md:px-5 gap-4 pt-4 pb-6">
							<div
								class="{aspectRatio >= 3 / 2
									? 'w-140'
									: aspectRatio >= 4 / 3
									? 'w-128'
									: aspectRatio >= 1 / 1
									? 'w-112'
									: aspectRatio >= 3 / 4
									? 'w-92'
									: aspectRatio >= 2 / 3
									? 'w-84'
									: 'w-72'} max-w-full h-auto rounded-2xl bg-c-bg-secondary relative z-0 overflow-hidden border-4 
								shadow-lg shadow-c-shadow/[var(--o-shadow-normal)] border-c-bg-secondary group"
							>
								<ImagePlaceholder width={lastGeneration.width} height={lastGeneration.height} />
								<GenerationImage generation={lastGeneration} src={lastGeneration.imageUrl} />
							</div>
						</div>
					</div>
				{/if}
			</div>
		{/if}
	</div>
</div>
