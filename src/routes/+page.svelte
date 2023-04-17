<script lang="ts">
	import GenerateBar from '$components/generateBar/GenerateBar.svelte';
	import MetaTag from '$components/MetaTag.svelte';
	import { expandCollapse } from '$ts/animation/transitions';
	import {
		canonicalUrl,
		guidanceScaleDefault,
		inferenceStepsDefault,
		maxSeed,
		numOutputsDefault
	} from '$ts/constants/main';
	import { onDestroy, onMount } from 'svelte';
	import ImagePlaceholder from '$components/ImagePlaceholder.svelte';
	import GenerationImage from '$components/generationImage/GenerationImage.svelte';
	import { advancedModeApp } from '$ts/stores/advancedMode';
	import {
		activeGeneration,
		generations,
		queueInitialGenerationRequest,
		type TInitialGenerationRequest
	} from '$userStores/generation';
	import type { THomePageData } from '$routes/+page.server';
	import { isValue } from '$ts/helpers/isValue';
	import LL from '$i18n/i18n-svelte';
	import GenerationFullScreen from '$components/generationFullScreen/GenerationFullScreen.svelte';
	import {
		generationGuidanceScale,
		generationHeight,
		generationInferenceSteps,
		generationInitImageFiles,
		generationInitImageStrength,
		generationInitImageUrl,
		generationModelId,
		generationSchedulerId,
		generationSeed,
		generationWidth,
		generationNegativePrompt,
		generationPrompt
	} from '$ts/stores/generationSettings';
	import { page } from '$app/stores';
	import { homePageContainer } from '$ts/stores/homePageContainer';
	import { sseId } from '$userStores/sse';
	import { generateSSEId } from '$ts/helpers/generateSSEId';
	import { userSummary } from '$ts/stores/user/summary';
	import LowOnCreditsCard from '$components/LowOnCreditsCard.svelte';
	import { appVersion, serverVersion } from '$ts/stores/appVersion';
	import { goto } from '$app/navigation';
	import UpdateAvailableCard from '$components/UpdateAvailableCard.svelte';

	export let data: THomePageData;

	let nowInterval: NodeJS.Timeout | undefined;

	async function queueGeneration() {
		if (!$generationPrompt) {
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
				text: $generationPrompt
			},
			negative_prompt:
				($advancedModeApp || isValue(data.negative_prompt)) && $generationNegativePrompt
					? {
							id: 'negative_prompt',
							text: $generationNegativePrompt
					  }
					: undefined,
			model_id: $generationModelId,
			scheduler_id: $generationSchedulerId,
			width: Number($generationWidth),
			height: Number($generationHeight),
			init_image_url: $generationInitImageUrl,
			init_image_file: $generationInitImageFiles,
			prompt_strength:
				$generationInitImageUrl && $generationInitImageStrength
					? 1 - $generationInitImageStrength
					: undefined,
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
			num_outputs: numOutputsDefault,
			output_image_extension: 'jpeg',
			process_type: 'generate',
			stream_id: $sseId,
			ui_id: generateSSEId(),
			submit_to_gallery: false
		};
		queueInitialGenerationRequest(initialRequestProps);
	}

	function onKeyDown({ key }: KeyboardEvent) {
		if ($activeGeneration === undefined) return;
		if (key === 'Escape') {
			activeGeneration.set(undefined);
			return;
		}
		if (key === 'ArrowLeft' || key === 'ArrowRight') {
			const outputs = $activeGeneration.outputs;
			const index = outputs.findIndex((g) => g.id === $activeGeneration?.selected_output.id);
			if (index === -1) return;
			const addition = key === 'ArrowLeft' ? -1 : 1;
			const newIndex =
				(index + addition + $activeGeneration.outputs.length) % $activeGeneration.outputs.length;
			activeGeneration.set({
				...$activeGeneration,
				selected_output: $activeGeneration.outputs[newIndex]
			});
		}
	}

	const lowCreditsThreshold = 10;

	const confirmOtherEmailHash =
		'#message=Confirmation+link+accepted.+Please+proceed+to+confirm+link+sent+to+the+other+email';

	onMount(async () => {
		if ($page.url.hash === confirmOtherEmailHash) {
			await goto('/account/change-email?confirm_other_email=true');
		}
	});

	onDestroy(() => {
		clearInterval(nowInterval);
	});
</script>

<MetaTag
	title="Synthica"
	description="Free, easy to use, multilingual and open-source AI image generator using Stable Diffusion."
	imageUrl="{canonicalUrl}/previews/home.png"
	canonical={canonicalUrl}
/>

<svelte:window on:keydown={onKeyDown} />

<div
	bind:this={$homePageContainer}
	class="w-full flex flex-col items-center flex-1 justify-center md:pt-4"
>
	<div class="w-full flex flex-col justify-start items-center z-0">
		{#if Number($serverVersion) > Number($appVersion)}
			<div class="w-full flex flex-col flex-1 items-center justify-center">
				<UpdateAvailableCard />
			</div>
		{:else}
			{#if $page.data.session?.user.id && $userSummary && $userSummary.total_remaining_credits < lowCreditsThreshold}
				<div
					transition:expandCollapse|local={{ duration: 200 }}
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
					<p class="w-full max-w-2xl leading-relaxed text-c-on-bg/40 text-center py-4 md:py-2 px-6">
						{#if $generations[0].error}
							{$generations[0].error === 'NSFW' ? $LL.Error.NSFW() : $generations[0].error}
						{:else}
							{$LL.Error.SomethingWentWrong()}
						{/if}
					</p>
				</div>
			{:else if $generations && $generations.length > 0 && $generations[0].outputs && $generations[0].status === 'succeeded'}
				<div
					transition:expandCollapse|local={{ duration: 300 }}
					class="w-full flex items-start justify-center rounded-xl origin-top relative z-0 px-1"
				>
					<div
						class="w-full max-w-7xl flex flex-wrap items-start justify-center md:px-4 py-3 md:pt-0"
					>
						{#each $generations[0].outputs as output}
							<div class="p-0.5 w-1/2 lg:w-1/4 max-w-xs lg:max-w-auto">
								<div class="w-full h-auto relative">
									<ImagePlaceholder width={$generations[0].width} height={$generations[0].height} />

									<div
										class="absolute w-full h-full left-0 top-0 rounded-2xl bg-c-bg-secondary z-0 overflow-hidden border-4
											shadow-lg shadow-c-shadow/[var(--o-shadow-normal)] border-c-bg-secondary group"
									>
										{#if output.status === 'failed' || output.status === 'failed-nsfw'}
											<div class="w-full h-full flex items-center justify-center">
												<p class="text-sm text-c-on-bg/50 px-5 py-3 text-center leading-relaxed">
													{output.status === 'failed-nsfw'
														? $LL.Error.ImageWasNSFW()
														: $LL.Error.SomethingWentWrong()}
												</p>
											</div>
										{:else}
											<GenerationImage
												generation={{ ...$generations[0], selected_output: output }}
												useUpscaledImage
												cardType="generate"
											/>
										{/if}
									</div>
								</div>
							</div>
						{/each}
						{#if $generations[0].outputs.length !== 0 && $generations[0].outputs.length < $generations[0].num_outputs}
							{#each [...Array($generations[0].num_outputs - $generations[0].outputs.length).keys()] as _}
								<div class="p-0.5 w-1/2 lg:w-1/4 max-w-xs lg:max-w-auto">
									<div class="w-full h-auto relative">
										<ImagePlaceholder
											width={$generations[0].width}
											height={$generations[0].height}
										/>
										<div
											class="absolute w-full h-full flex items-center justify-center left-0 top-0 rounded-2xl bg-c-bg-secondary z-0 overflow-hidden border-4
											shadow-lg shadow-c-shadow/[var(--o-shadow-normal)] border-c-bg-secondary group"
										>
											<div class="w-full h-full flex items-center justify-center">
												<p class="text-sm text-c-on-bg/50 px-5 py-3 text-center leading-relaxed">
													{$LL.Error.ImageWasNSFW()}
												</p>
											</div>
										</div>
									</div>
								</div>
							{/each}
						{/if}
					</div>
				</div>
			{/if}
		{/if}
	</div>
</div>

{#if $activeGeneration}
	<GenerationFullScreen generation={$activeGeneration} modalType="generate" />
{/if}
