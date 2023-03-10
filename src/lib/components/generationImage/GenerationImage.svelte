<script lang="ts">
	import AnchorOrDiv from '$components/AnchorOrDiv.svelte';
	import CopyButton from '$components/buttons/CopyButton.svelte';
	import DownloadGenerationButton from '$components/buttons/DownloadGenerationButton.svelte';
	import GenerateButton from '$components/buttons/GenerateButton.svelte';
	import type { TGenerationImageCardType } from '$components/generationImage/types';
	import IconCancelCircle from '$components/icons/IconCancelCircle.svelte';
	import IconChatBubbleCancel from '$components/icons/IconChatBubbleCancel.svelte';
	import IconNoImage from '$components/icons/IconNoImage.svelte';
	import IconTick from '$components/icons/IconTick.svelte';
	import IconTrashcan from '$components/icons/IconTrashcan.svelte';
	import { doesContainTarget } from '$ts/helpers/doesContainTarget';
	import { logGalleryGenerationOpened } from '$ts/helpers/loggers';
	import {
		adminGalleryActionableItems,
		adminGalleryFilter,
		isAdminGalleryEditActive,
		adminGalleryScheduledIds
	} from '$ts/stores/admin/gallery';
	import { advancedModeApp } from '$ts/stores/advancedMode';
	import { userSummary } from '$ts/stores/user/summary';
	import { activeGeneration, type TGenerationWithSelectedOutput } from '$userStores/generation';
	import { quadOut } from 'svelte/easing';
	import { fade, fly, scale } from 'svelte/transition';

	export let generation: TGenerationWithSelectedOutput;
	export let useUpscaledImage = true;
	export let scrollPrompt = false;
	export let cardType: TGenerationImageCardType;

	let promptCopied = false;
	let promptCopiedTimeout: NodeJS.Timeout;
	let rightButtonContainer: HTMLDivElement;

	let isImageLoaded = false;
	const onImageLoaded = () => (isImageLoaded = true);

	$: inAdminGalleryScheduledIds = $isAdminGalleryEditActive
		? $adminGalleryScheduledIds.includes(generation.selected_output.id)
		: false;

	const addToAdminGalleryActionableItems = (id: string) => {
		if (inAdminGalleryScheduledIds) return;
		adminGalleryActionableItems.set([
			...$adminGalleryActionableItems,
			{
				id,
				filter: $adminGalleryFilter
			}
		]);
	};

	const removeFromAdminGalleryActionableItems = (id: string) => {
		adminGalleryActionableItems.set($adminGalleryActionableItems.filter((i) => i.id !== id));
	};

	$: showAdminGalleryBarrier =
		cardType === 'admin-gallery' &&
		$isAdminGalleryEditActive &&
		((generation.selected_output.gallery_status === 'approved' &&
			$adminGalleryFilter !== 'approved') ||
			(generation.selected_output.gallery_status === 'rejected' &&
				$adminGalleryFilter !== 'rejected'));

	$: logProps = {
		'SC - Output Id': generation.selected_output.id,
		'SC - Product Id': $userSummary?.product_id,
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
{#if showAdminGalleryBarrier}
	<div class="w-full h-full absolute left-0 top-0 flex items-center justify-center p-4 z-20">
		<div in:scale={{ duration: 300, easing: quadOut, opacity: 0, start: 0.5 }}>
			{#if generation.selected_output.gallery_status === 'approved'}
				<IconTick class="text-c-success w-12 h-12" />
			{:else}
				<IconCancelCircle class="text-c-danger w-12 h-12" />
			{/if}
		</div>
	</div>
	<div
		in:fade={{ duration: 300, easing: quadOut }}
		class="w-full h-full absolute left-0 top-0 bg-c-bg-secondary/85 z-10"
	/>
{/if}
{#if cardType === 'admin-gallery' && $isAdminGalleryEditActive}
	<button
		on:click={(e) => {
			inAdminGalleryScheduledIds
				? removeFromAdminGalleryActionableItems(generation.selected_output.id)
				: addToAdminGalleryActionableItems(generation.selected_output.id);
			e.currentTarget.blur();
		}}
		class="w-full h-full absolute left-0 top-0 flex flex-col justify-start items-start z-30"
	>
		<div class="w-full flex items-center justify-between transform transition p-1.5">
			<div />
			<div
				transition:fly|local={{ duration: 200, easing: quadOut, y: -50 }}
				class="rounded-full ring-2 ring-c-primary w-6 h-6 transition p-0.75 {inAdminGalleryScheduledIds
					? 'scale-100 opacity-100'
					: 'scale-0 opacity-0'}"
			>
				<div class="w-full h-full rounded-full bg-c-primary" />
			</div>
		</div>
	</button>
{/if}
{#if generation.selected_output.image_url.includes('placeholder')}
	<svg
		class="w-full h-full absolute left-0 top-0 text-c-bg-secondary"
		width={generation.width}
		height={generation.height}
		viewBox="0 0 {generation.width} {generation.height}"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<rect width={generation.width} height={generation.height} fill="currentColor" />
	</svg>
	<div class="w-full h-full absolute left-0 top-0 p-5 flex items-center justify-center">
		<IconNoImage class="w-12 h-12 text-c-on-bg/40" />
	</div>
{:else}
	<img
		on:load={onImageLoaded}
		loading="lazy"
		class="w-full h-full absolute left-0 top-0 duration-300 transition transform {isImageLoaded
			? 'opacity-100'
			: 'opacity-0'} {$isAdminGalleryEditActive && inAdminGalleryScheduledIds
			? 'translate-y-10'
			: 'translate-0'}"
		src={useUpscaledImage && generation.selected_output.upscaled_image_url
			? generation.selected_output.upscaled_image_url
			: generation.selected_output.image_url}
		alt={generation.prompt.text}
		width={generation.width}
		height={generation.height}
	/>
{/if}
{#if !generation.selected_output.is_deleted}
	<AnchorOrDiv
		href={cardType === 'gallery' ? `/gallery?output=${generation.selected_output.id}` : undefined}
		anchorPreventDefault={cardType === 'gallery'}
		onClick={(e) => {
			if (doesContainTarget(e.target, [rightButtonContainer])) {
				return;
			}
			activeGeneration.set(generation);
			if (cardType === 'gallery') {
				logGalleryGenerationOpened(logProps);
				window.history.replaceState({}, '', `/gallery?output=${generation.selected_output.id}`);
			}
		}}
		class="w-full h-full absolute left-0 top-0 flex flex-col justify-between items-end overflow-hidden gap-4"
	>
		<div class="w-full h-16" />
		<div
			class="w-full max-h-[max(4rem,min(35%,5.3rem))] transition bg-c-bg/90 text-xs relative z-0 overflow-hidden
			translate-y-full group-focus-within:translate-y-0 group-hover:translate-y-0 pointer-events-none"
		>
			<div
				class="{scrollPrompt
					? 'overflow-auto'
					: 'overflow-hidden'} w-full max-h-full list-fade px-3 md:px-4 py-3 flex flex-col gap-2 cursor-default"
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
<div class="w-full h-full absolute left-0 top-0 pointer-events-none">
	<div class="w-full flex justify-end items-start">
		<div
			bind:this={rightButtonContainer}
			class="flex flex-row items-end justify-start transition transform 
			translate-x-full group-focus-within:translate-x-0 group-hover:translate-x-0 pointer-events-auto"
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
	<div />
</div>

<style>
	.list-fade {
		mask-image: linear-gradient(to top, transparent, transparent 0.35rem, black 1.1rem);
	}
</style>
