<script lang="ts">
	import AnchorOrDiv from '$components/AnchorOrDiv.svelte';
	import CopyButton from '$components/buttons/CopyButton.svelte';
	import DownloadGenerationButton from '$components/buttons/DownloadGenerationButton.svelte';
	import GenerateButton from '$components/buttons/GenerateButton.svelte';
	import type { TGenerationImageCardType } from '$components/generationImage/types';
	import IconChatBubbleCancel from '$components/icons/IconChatBubbleCancel.svelte';
	import IconTrashcan from '$components/icons/IconTrashcan.svelte';
	import { doesContainTarget } from '$ts/helpers/doesContainTarget';
	import { mLogGalleryGenerationOpened } from '$ts/helpers/loggers';
	import { advancedModeApp } from '$ts/stores/advancedMode';
	import { userSummary } from '$ts/stores/user/summary';
	import { activeGeneration, type TGenerationWithSelectedOutput } from '$userStores/generation';
	import { quadOut } from 'svelte/easing';
	import { fade, scale } from 'svelte/transition';

	export let generation: TGenerationWithSelectedOutput;
	export let useUpscaledImage = true;
	export let scrollPrompt = false;
	export let cardType: TGenerationImageCardType;

	let promptCopied = false;
	let promptCopiedTimeout: NodeJS.Timeout;
	let rightButtonContainer: HTMLDivElement;

	let isImageLoaded = false;
	const onImageLoaded = () => (isImageLoaded = true);

	$: logProps = {
		'SC - Generation Id': generation.id || generation.ui_id,
		'SC - Plan': $userSummary?.product_id,
		'SC - Advanced Mode': $advancedModeApp
	};
</script>

{#if generation.selected_output.is_deleted}
	<div class="w-full h-full absolute left-0 top-0 flex items-center justify-center p-4 z-20">
		<div in:scale={{ duration: 300, easing: quadOut, opacity: 0, start: 0.5 }}>
			<IconTrashcan class="text-c-danger w-12 h-12" />
		</div>
	</div>
	<div
		in:fade={{ duration: 300, easing: quadOut }}
		class="w-full h-full absolute left-0 top-0 bg-c-bg-secondary/85 z-10"
	/>
{/if}
<img
	on:load={onImageLoaded}
	loading="lazy"
	class="w-full h-full absolute left-0 top-0 duration-300 transition {isImageLoaded
		? 'opacity-100'
		: 'opacity-0'}"
	src={useUpscaledImage && generation.selected_output.upscaled_image_url
		? generation.selected_output.upscaled_image_url
		: generation.selected_output.image_url}
	alt={generation.prompt.text}
	width={generation.width}
	height={generation.height}
/>
{#if !generation.selected_output.is_deleted}
	<AnchorOrDiv
		href={cardType === 'gallery' ? '/gallery?generation={generation.id}' : undefined}
		anchorPreventDefault={cardType === 'gallery'}
		onClick={(e) => {
			if (doesContainTarget(e.target, [rightButtonContainer])) {
				return;
			}
			mLogGalleryGenerationOpened(logProps);
			activeGeneration.set(generation);
			if (cardType === 'gallery') {
				window.history.replaceState({}, '', `/gallery?generation=${generation.id}`);
			}
		}}
		class="w-full h-full absolute left-0 top-0 flex flex-col justify-between items-end overflow-hidden gap-4"
	>
		<div class="w-full flex justify-between items-start gap-8">
			<div
				class="flex-1 min-w-0 overflow-hidden flex flex-row flex-wrap items-start justify-start gap-1 transition transform 
				-translate-x-full group-focus-within:translate-x-0 group-hover:translate-x-0 p-1.5"
			/>
			<div
				bind:this={rightButtonContainer}
				class="flex flex-row items-end justify-start transition transform 
			translate-x-full group-focus-within:translate-x-0 group-hover:translate-x-0"
			>
				{#if cardType !== 'admin-gallery'}
					<CopyButton
						class="p-1.5"
						stringToCopy={generation.prompt.text}
						bind:copied={promptCopied}
						bind:copiedTimeout={promptCopiedTimeout}
					/>
				{/if}
				{#if cardType === 'generate' || cardType === 'history'}
					<DownloadGenerationButton
						class="p-1.5 -ml-1.5"
						url={generation.selected_output.upscaled_image_url
							? generation.selected_output.upscaled_image_url
							: generation.selected_output.image_url}
						isUpscaled={generation.selected_output.upscaled_image_url !== undefined}
						prompt={generation.prompt.text}
						seed={generation.seed}
						guidanceScale={generation.guidance_scale}
						inferenceSteps={generation.inference_steps}
					/>
				{:else if cardType === 'gallery'}
					<GenerateButton {generation} class="p-1.5 -ml-1.5" />
				{/if}
			</div>
		</div>
		<div
			class="w-full max-h-[max(4rem,min(35%,5.3rem))] transition bg-c-bg/90 text-xs relative z-0 overflow-hidden
		translate-y-full group-focus-within:translate-y-0 group-hover:translate-y-0 pointer-events-none"
		>
			<div
				class="{scrollPrompt
					? 'overflow-auto'
					: 'overflow-hidden'} w-full max-h-full list-fade px-4 py-3 flex flex-col gap-2 cursor-default"
			>
				<p class="w-full font-medium leading-normal transition text-c-on-bg transform">
					{generation.prompt.text}
				</p>
				{#if generation.negative_prompt !== undefined && generation.negative_prompt.text !== ''}
					<div class="w-full flex items-start justify-start gap-1.5">
						<IconChatBubbleCancel class="text-c-danger h-4 w-4 mt-0.25" />
						<div class="flex-1 min-w-0">
							<p class="w-full text-c-danger">
								{generation.negative_prompt.text}
							</p>
						</div>
					</div>
				{/if}
			</div>
		</div>
	</AnchorOrDiv>
{/if}

<style>
	.list-fade {
		mask-image: linear-gradient(to top, transparent, transparent 0.35rem, black 1.1rem);
	}
</style>
