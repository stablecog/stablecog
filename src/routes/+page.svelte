<script lang="ts">
	import GenerateBar from '$components/GenerateBar.svelte';
	import MetaTag from '$components/MetaTag.svelte';
	import { elementreceive, elementsend, expandCollapse } from '$ts/animation/transitions';
	import {
		canonicalUrl,
		estimatedDurationBufferRatio,
		estimatedDurationDefault,
		guidanceScaleDefault,
		inferenceStepsDefault,
		maxSeed,
		type TAvailableHeights,
		type TAvailableInferenceSteps,
		type TAvailableWidths
	} from '$ts/constants/main';
	import { urlFromBase64 } from '$ts/helpers/base64';
	import {
		addGenerationToDb,
		isStorageAvailableIfNotPrune,
		updateGenerationInDb
	} from '$ts/queries/indexedDb';
	import { generateImage } from '$ts/queries/generateImage';
	import { computeRatePerSec } from '$ts/stores/computeRatePerSec';
	import { serverUrl } from '$ts/stores/serverUrl';
	import type { TGenerationUI, TStatus, TUpscaleStatus } from '$ts/types/main';
	import { onDestroy, onMount, tick } from 'svelte';
	import ImagePlaceholder from '$components/ImagePlaceholder.svelte';
	import GenerationImage from '$components/GenerationImage.svelte';
	import { advancedMode } from '$ts/stores/advancedMode';
	import SetServerModal from '$components/SetServerModal.svelte';
	import { pLogGeneration, uLogGeneration } from '$ts/helpers/loggers';
	import ServerOfflineBanner from '$components/ServerOfflineBanner.svelte';
	import { currentServer, currentServerHealthStatus } from '$ts/stores/serverHealth';
	import GenerationFullScreen from '$components/generationFullScreen/GenerationFullScreen.svelte';
	import { activeGeneration } from '$ts/stores/activeGeneration';
	import type { THomePageData } from '$routes/+page.server';
	import { isValue } from '$ts/helpers/isValue';

	export let data: THomePageData;

	let status: TStatus = 'idle';
	let promptInputValue: string | undefined;
	let negativePromptInputValue: string | undefined;
	let nowInterval: NodeJS.Timeout | undefined;
	let startTimestamp: number | undefined;
	let endTimestamp: number | undefined;
	let lastGeneration: TGenerationUI;
	let generationWidth: TAvailableWidths;
	let generationHeight: TAvailableHeights;
	let generationInferenceSteps: TAvailableInferenceSteps;
	let generationGuidanceScale: number;
	let generationSeed: number;
	let generationError: string | undefined;
	let estimatedDuration = estimatedDurationDefault;
	let upscaleStatus: TUpscaleStatus;

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
		pLogGeneration('Started');
		uLogGeneration('Started');
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
				$currentServer.features?.includes('negative_prompt') &&
				negativePromptInputValue !== '' &&
				negativePromptInputValue !== undefined &&
				($advancedMode || data.negative_prompt)
					? negativePromptInputValue
					: undefined,
			width: Number(generationWidth),
			height: Number(generationHeight),
			guidance_scale: Number(
				$advancedMode || data.guidance_scale ? generationGuidanceScale : guidanceScaleDefault
			),
			num_inference_steps: Number(
				$advancedMode || data.num_inference_steps ? generationInferenceSteps : inferenceStepsDefault
			),
			seed:
				(isValue(generationSeed) && $advancedMode) || data.seed
					? generationSeed
					: Math.round(Math.random() * maxSeed),
			imageDataB64: ''
		};
		console.log('generation', lastGeneration);
		console.log('estimatedDuration', estimatedDuration);
		status = 'idle';
		await tick();
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
				pLogGeneration('Succeeded');
				uLogGeneration('Succeeded');
				lastGeneration.imageDataB64 = data.imageDataB64;
				if (
					$currentServer.lastHealthStatus !== 'healthy' ||
					$currentServerHealthStatus !== 'healthy'
				) {
					currentServer.set({
						lastHealthStatus: 'healthy',
						features: $currentServer.features ?? undefined
					});
					currentServerHealthStatus.set('healthy');
				}
				lastGeneration.duration_ms = data.duration_ms;
				let id: number | undefined = undefined;
				try {
					const canWrite = await isStorageAvailableIfNotPrune();
					if (canWrite) {
						const resId = await addGenerationToDb({
							...lastGeneration,
							imageDataB64: data.imageDataB64
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
			pLogGeneration('Failed');
			uLogGeneration('Failed');
			status = 'error';
			console.log(error);
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

	let isCheckComplete = false;

	onMount(() => {
		setEstimatedDuration();
		isCheckComplete = true;
		console.log(
			'currentServer:',
			$currentServer,
			'lastServerHealth:',
			'currentServerHealthStatus',
			$currentServerHealthStatus
		);
	});

	onDestroy(() => {
		clearInterval(nowInterval);
	});
</script>

<MetaTag
	title="Stablecog"
	description="Free & easy to use AI image generator using Stable Diffusion cogs. Use one of the default servers or connect to your own."
	imageUrl="{canonicalUrl}/previews/home.png"
	canonical={canonicalUrl}
/>

<svelte:window on:keydown={onKeyDown} />

<div class="w-full flex flex-col items-center flex-1 justify-center px-4 pt-4">
	<div class="w-full flex flex-col items-center justify-center">
		{#if isCheckComplete && !$serverUrl}
			<SetServerModal isOnBarrier={false} />
		{:else}
			{#if isCheckComplete && ($currentServerHealthStatus === 'unhealthy' || $currentServerHealthStatus === 'unknown' || $currentServer.lastHealthStatus === 'unhealthy')}
				<ServerOfflineBanner />
			{/if}
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
					serverData={data}
					{status}
					{onCreate}
					{startTimestamp}
					{estimatedDuration}
				/>
				{#if status === 'error'}
					<div
						transition:expandCollapse|local={{ duration: 300 }}
						class="flex flex-col justify-start origin-top px-8"
					>
						<p class="w-full max-w-lg leading-relaxed text-c-on-bg/40 text-center py-4">
							{generationError ?? 'Something went wrong :('}
						</p>
					</div>
				{:else if status === 'success' && lastGeneration && lastGeneration.imageUrl}
					{@const aspectRatio = lastGeneration.width / lastGeneration.height}
					<div
						transition:expandCollapse|local={{ duration: 300 }}
						class="max-w-full flex flex-col items-center justify-start rounded-xl origin-top relative z-0 px-4"
					>
						<div class="max-w-full flex flex-col items-center md:px-5 gap-4 py-4">
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
			</div>
		{/if}
	</div>
</div>

{#if $activeGeneration}
	<GenerationFullScreen bind:upscaleStatus on:upscale={onUpscale} generation={$activeGeneration} />
{/if}
