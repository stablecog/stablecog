<script lang="ts">
	import { browser } from '$app/environment';
	import Button from '$components/buttons/Button.svelte';
	import GenerationFullScreen from '$components/generationFullScreen/GenerationFullScreen.svelte';
	import GenerationImage from '$components/generationImage/GenerationImage.svelte';
	import IconAnimatedSpinner from '$components/icons/IconAnimatedSpinner.svelte';
	import ImagePlaceholder from '$components/ImagePlaceholder.svelte';
	import SettingsPanel from '$routes/create/SettingsPanel.svelte';
	import { maxSeed } from '$ts/constants/main';
	import { generateSSEId } from '$ts/helpers/generateSSEId';
	import { uLogGeneration } from '$ts/helpers/loggers';
	import {
		generationGuidanceScale,
		generationHeight,
		generationInferenceSteps,
		generationInitImageFiles,
		generationInitImageStrength,
		generationInitImageUrl,
		generationModelId,
		generationNumOutputs,
		generationSchedulerId,
		generationSeed,
		generationWidth,
		initImageStrength,
		negativePromptInputValue,
		promptInputValue
	} from '$ts/stores/generationSettings';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import { navbarHeight } from '$ts/stores/navbarHeight';
	import {
		activeGeneration,
		generations,
		queueInitialGenerationRequest,
		type TInitialGenerationRequest
	} from '$ts/stores/user/generation';
	import { sseId } from '$ts/stores/user/sse';
	import { windowHeight, windowWidth } from '$ts/stores/window';
	import { onDestroy, onMount } from 'svelte';

	let topbarHeight: number;
	let leftPanelHeight: number;

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
			negative_prompt: $negativePromptInputValue
				? {
						id: 'negative_prompt',
						text: $negativePromptInputValue
				  }
				: undefined,
			model_id: $generationModelId,
			scheduler_id: $generationSchedulerId,
			width: Number($generationWidth),
			height: Number($generationHeight),
			init_image_url: $generationInitImageUrl,
			init_image_file: $generationInitImageFiles,
			prompt_strength:
				$generationInitImageUrl && $generationInitImageStrength !== undefined
					? 1 - Number($generationInitImageStrength)
					: undefined,
			guidance_scale: Number($generationGuidanceScale),
			inference_steps: Number($generationInferenceSteps),
			seed:
				$generationSeed !== undefined && $generationSeed !== null && $generationSeed !== ''
					? Number($generationSeed)
					: Math.round(Math.random() * maxSeed),
			num_outputs: Number($generationNumOutputs),
			output_image_extension: 'jpeg',
			process_type: 'generate',
			stream_id: $sseId,
			ui_id: generateSSEId(),
			submit_to_gallery: false
		};
		uLogGeneration('Started');
		queueInitialGenerationRequest(initialRequestProps);
	}

	onMount(() => {
		if (!browser) return;
		document.body.style.overflow = 'hidden';
		document.body.style.height = '100%';
	});

	onDestroy(() => {
		if (!browser) return;
		document.body.style.overflow = 'auto';
		document.body.style.height = 'auto';
	});
</script>

<div
	style="height: {$windowHeight && $navbarHeight ? $windowHeight - $navbarHeight + 'px' : '100vh'}"
	class="w-full flex flex-row items-stretch overflow-hidden"
>
	<div bind:clientHeight={leftPanelHeight} class="flex-1 h-full flex flex-col px-5 relative">
		<form
			on:submit|preventDefault={queueGeneration}
			bind:clientHeight={topbarHeight}
			class="w-full flex items-center gap-3 sticky top-0 pt-2.5"
		>
			<input
				bind:value={$promptInputValue}
				placeholder="Portrait of a cat by Van Gogh"
				style="transition: height 0.1s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1), padding 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
				class="w-full bg-c-bg-secondary shadow-lg pr-12 md:pr-17 hide-scrollbar shadow-c-shadow/[var(--o-shadow-normal)] 
        scroll-smooth resize-none transition relative pl-5 md:pl-6 py-5 rounded-xl 
        focus:ring-2 focus:ring-c-primary/30 ring-0 ring-c-primary/20 placeholder:text-c-on-bg/40 {!$isTouchscreen
					? 'enabled:hover:ring-2'
					: ''} text-c-on-bg {!$isTouchscreen ? 'group-hover:ring-2' : ''}"
			/>
			<Button>Generate</Button>
		</form>
		<div style="height: {leftPanelHeight - topbarHeight}px" class="w-full flex flex-col py-5">
			<div
				class="w-full min-h-full rounded-3xl px-2 py-2 pb-6 flex flex-wrap overflow-auto bg-c-bg
        shadow-2xl shadow-c-shadow/[var(--o-shadow-strongest)] border-4 border-c-bg-secondary"
			>
				{#if $generations && $generations.length > 0}
					{#each $generations as generation}
						{#if !generation.completed_at}
							{#each Array(generation.num_outputs) as output, i}
								<div class="p-0.5 w-1/4">
									<div class="w-full h-auto relative">
										<ImagePlaceholder width={generation.width} height={generation.height} />
										<div
											class="absolute flex items-center justify-center w-full h-full left-0 top-0 rounded-2xl bg-c-bg-secondary z-0 overflow-hidden border-4 
											shadow-lg shadow-c-shadow/[var(--o-shadow-normal)] border-c-bg-secondary group"
										>
											<IconAnimatedSpinner class="text-c-on-bg/50 w-12 h-12" loading={true} />
										</div>
									</div>
								</div>
							{/each}
						{:else}
							{#each generation.outputs as output, i}
								<div class="p-0.5 w-1/4">
									<div class="w-full h-auto relative">
										<ImagePlaceholder width={generation.width} height={generation.height} />
										<div
											class="absolute w-full h-full left-0 top-0 rounded-2xl bg-c-bg-secondary z-0 overflow-hidden border-4 
											shadow-lg shadow-c-shadow/[var(--o-shadow-normal)] border-c-bg-secondary group"
										>
											<GenerationImage
												generation={{ ...generation, selected_output: output }}
												useUpscaledImage
												cardType="generate"
											/>
										</div>
									</div>
								</div>
							{/each}
						{/if}
					{/each}
				{:else}
					<div class="m-auto">Create a generation</div>
				{/if}
			</div>
		</div>
	</div>
	<div class="w-80 lg:w-96 h-full pr-5 pb-5 pt-2.5">
		<SettingsPanel />
	</div>
</div>

{#if $activeGeneration}
	<GenerationFullScreen generation={$activeGeneration} modalType="generate" />
{/if}
