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
		maxSeed,
		serverUrl
	} from '$ts/constants/main';
	import { urlFromBase64 } from '$ts/helpers/base64';
	import {
		addGenerationToDb,
		isStorageAvailableIfNotPrune,
		updateGenerationInDb
	} from '$ts/queries/indexedDb';
	import { generateImage } from '$ts/queries/generateImage';
	import { computeRatePerSec } from '$ts/stores/computeRatePerSec';
	import type { TGenerationUI, TStatus, TUpscaleStatus } from '$ts/types/main';
	import { onDestroy, onMount, tick } from 'svelte';
	import ImagePlaceholder from '$components/ImagePlaceholder.svelte';
	import GenerationImage from '$components/generationImage/GenerationImage.svelte';
	import { advancedModeApp } from '$ts/stores/advancedMode';
	import { mLogGeneration, uLogGeneration } from '$ts/helpers/loggers';
	import { activeGeneration } from '$ts/stores/activeGeneration';
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
		generationSchedulerId,
		generationSeed,
		generationWidth,
		negativePromptInputValue,
		promptInputValue
	} from '$ts/stores/generationSettings';
	import { page } from '$app/stores';
	import { homePageContainer } from '$ts/stores/homePageContainer';
	import { appVersion } from '$ts/stores/appVersion';
	import Button from '$components/buttons/Button.svelte';
	import IconConfetti from '$components/icons/IconConfetti.svelte';
	import { schedulerIdDefault } from '$ts/constants/schedulers';

	export let data: THomePageData;

	let status: TStatus = 'idle';
	let nowInterval: NodeJS.Timeout | undefined;
	let startTimestamp: number | undefined;
	let endTimestamp: number | undefined;
	let lastGeneration: TGenerationUI;
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
		if (!$promptInputValue) {
			!$promptInputValue && console.log('no input');
			return;
		}
		generationError = undefined;
		lastGeneration = {
			server_url: serverUrl,
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
			num_inference_steps: Number(
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
			imageDataB64: ''
		};
		const generationMinimal = {
			'SC - Width': lastGeneration.width,
			'SC - Height': lastGeneration.height,
			'SC - Inference Steps': lastGeneration.num_inference_steps,
			'SC - Guidance Scale': lastGeneration.guidance_scale,
			'SC - Model Id': lastGeneration.model_id,
			'SC - Scheduler Id': lastGeneration.scheduler_id,
			'SC - Advanced Mode': $advancedModeApp,
			'SC - Locale': $locale,
			'SC - Submit to Gallery': $shouldSubmitToGallery ?? false,
			'SC - Plan': $page.data.plan
		};
		uLogGeneration('Started');
		mLogGeneration('Started', generationMinimal);
		console.log('generation', lastGeneration);
		console.log('estimatedDuration', estimatedDuration);
		status = 'idle';
		await tick();
		setTimeout(() => {
			if (status !== 'error') {
				status = 'loading';
			}
		}, 10);
		endTimestamp = undefined;
		startTimestamp = Date.now();
		try {
			let res = await generateImage({
				server_url: lastGeneration.server_url,
				prompt: lastGeneration.prompt,
				negative_prompt: lastGeneration.negative_prompt,
				model_id: lastGeneration.model_id,
				scheduler_id: lastGeneration.scheduler_id,
				width: lastGeneration.width,
				height: lastGeneration.height,
				seed: lastGeneration.seed,
				guidance_scale: lastGeneration.guidance_scale,
				num_inference_steps: lastGeneration.num_inference_steps,
				should_submit_to_gallery:
					$shouldSubmitToGallery === undefined ? false : $shouldSubmitToGallery,
				access_token: $page.data.session?.access_token,
				app_version: $appVersion
			});
			let { data, error } = res;
			if (data && data.image_b64 && !error) {
				uLogGeneration('Succeeded');
				mLogGeneration('Succeeded', { ...generationMinimal, 'SC - Duration': data.duration_ms });
				lastGeneration.imageDataB64 = data.image_b64;
				lastGeneration.duration_ms = data.duration_ms;
				let id: number | undefined = undefined;
				try {
					const canWrite = await isStorageAvailableIfNotPrune();
					if (canWrite) {
						const resId = await addGenerationToDb({
							...lastGeneration,
							imageDataB64: data.image_b64
						});
						if (resId !== undefined && resId !== null) {
							id = Number(resId);
						}
					}
				} catch (error) {
					console.log('indexedDB error', error);
				}
				if (id === undefined) {
					lastGeneration.id = Math.round(Math.random() * Math.pow(10, 15));
				} else {
					lastGeneration.id = id;
				}
				const imageUrl = urlFromBase64(data.image_b64);
				const img = new Image();
				img.src = imageUrl;
				img.onload = () => {
					if (lastGeneration) {
						lastGeneration.imageUrl = imageUrl;
						lastGeneration = lastGeneration;
					}
					if (lastGeneration && startTimestamp !== undefined) {
						const rate = getComputeRate(
							Number($generationWidth),
							Number($generationHeight),
							Number($generationInferenceSteps)
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
				throw new Error(error);
			}
		} catch (error) {
			const _error = error as Error;
			uLogGeneration(_error.message === 'NSFW' ? 'Failed-NSFW' : 'Failed');
			mLogGeneration(_error.message === 'NSFW' ? 'Failed-NSFW' : 'Failed', generationMinimal);
			status = 'error';
			generationError = _error;
			console.log('Generation error', _error);
		} finally {
			endTimestamp = Date.now();
			console.log('generation duration:', (endTimestamp - startTimestamp) / 1000, 's');
		}
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
		lastGeneration.upscaledImageDataB64 = rest.upscaledImageDataB64;
		if (rest.upscaledImageDataB64) {
			lastGeneration.upscaledImageUrl = urlFromBase64(rest.upscaledImageDataB64);
		}
		if ($activeGeneration) {
			activeGeneration.set(lastGeneration);
		}
	}

	function onDelete(event: CustomEvent<{ generation: TGenerationUI }>) {
		const { generation } = event.detail;
		console.log('Deleted', generation);
		status = 'idle';
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
			<GenerateBar serverData={data} {status} {onCreate} {startTimestamp} {estimatedDuration} />
			{#if status === 'error'}
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
			{:else if status === 'success' && lastGeneration && lastGeneration.imageUrl}
				{@const aspectRatio = lastGeneration.width / lastGeneration.height}
				<div
					transition:expandCollapse|local={{ duration: 300 }}
					class="max-w-full flex flex-col items-center justify-start rounded-xl origin-top relative z-0 px-4"
				>
					<div class="max-w-full flex flex-col items-center md:px-5 gap-4 py-3 md:pt-0">
						<div
							class="{aspectRatio >= 6 / 2
								? 'w-180'
								: aspectRatio >= 4 / 2
								? 'w-160'
								: aspectRatio >= 3 / 2
								? 'w-140'
								: aspectRatio >= 4 / 3
								? 'w-128'
								: aspectRatio >= 1 / 1
								? 'w-112'
								: aspectRatio >= 3 / 4
								? 'w-92'
								: aspectRatio >= 2 / 3
								? 'w-84'
								: 'w-72'} max-w-full h-auto relative"
						>
							<ImagePlaceholder width={lastGeneration.width} height={lastGeneration.height} />
							{#if !($activeGeneration && $activeGeneration.id === lastGeneration.id)}
								<div
									class="absolute w-full h-full left-0 top-0 rounded-2xl bg-c-bg-secondary z-0 overflow-hidden border-4 
											shadow-lg shadow-c-shadow/[var(--o-shadow-normal)] border-c-bg-secondary group"
									in:elementreceive|local={{ key: lastGeneration.id }}
									out:elementsend|local={{ key: lastGeneration.id }}
								>
									<GenerationImage generation={lastGeneration} prioritizeUpscaled={true} />
								</div>
							{/if}
						</div>
					</div>
				</div>
			{/if}
			{#if status === 'success' && $shouldSubmitToGallery === undefined}
				<SubmitToGallery />
			{/if}
		</div>
	</div>
</div>

{#if $activeGeneration}
	<GenerationFullScreen
		bind:upscaleStatus
		on:delete={onDelete}
		on:upscale={onUpscale}
		generation={$activeGeneration}
	/>
{/if}
