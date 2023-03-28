<script lang="ts">
	import { page } from '$app/stores';
	import AnchorOrDiv from '$components/AnchorOrDiv.svelte';
	import CopyButton from '$components/buttons/CopyButton.svelte';
	import DownloadGenerationButton from '$components/buttons/DownloadGenerationButton.svelte';
	import FavoriteButton from '$components/buttons/FavoriteButton.svelte';
	import GenerateButton from '$components/buttons/GenerateButton.svelte';
	import IconButton from '$components/buttons/IconButton.svelte';
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
		adminGalleryCurrentFilter,
		isAdminGalleryEditActive,
		adminGallerySelectedOutputIds
	} from '$ts/stores/admin/gallery';
	import { advancedModeApp } from '$ts/stores/advancedMode';
	import { appVersion } from '$ts/stores/appVersion';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import { lastClickedOutputId } from '$ts/stores/lastClickedOutputId';
	import {
		isUserGalleryEditActive,
		userGalleryActionableItems,
		userGalleryCurrentView,
		userGallerySelectedOutputIds
	} from '$ts/stores/user/gallery';
	import { userSummary } from '$ts/stores/user/summary';
	import { activeGeneration, type TGenerationWithSelectedOutput } from '$userStores/generation';

	export let generation: TGenerationWithSelectedOutput;
	export let useUpscaledImage = true;
	export let scrollPrompt = false;
	export let cardType: TGenerationImageCardType;

	let promptCopied = false;
	let promptCopiedTimeout: NodeJS.Timeout;
	let rightButtonContainer: HTMLDivElement;
	let leftButtonContainer: HTMLDivElement;

	let isImageLoaded = false;
	const onImageLoaded = () => (isImageLoaded = true);

	$: isInGallerySelectedIds =
		$isUserGalleryEditActive && cardType === 'history'
			? $userGallerySelectedOutputIds.includes(generation.selected_output.id)
			: $isAdminGalleryEditActive && cardType === 'admin-gallery'
			? $adminGallerySelectedOutputIds.includes(generation.selected_output.id)
			: false;

	const addToGalleryActionableItems = ({
		output_id,
		generation_id
	}: {
		output_id: string;
		generation_id: string;
	}) => {
		if (isInGallerySelectedIds) return;
		if (cardType === 'history') {
			if (
				$userGalleryActionableItems.find(
					(i) => i.output_id === output_id && i.view === $userGalleryCurrentView
				)
			) {
				return;
			}
			userGalleryActionableItems.set([
				...$userGalleryActionableItems,
				{
					output_id,
					generation_id,
					view: $userGalleryCurrentView
				}
			]);
		} else if (cardType === 'admin-gallery') {
			if (
				$adminGalleryActionableItems.find(
					(i) => i.output_id === output_id && i.filter === $adminGalleryCurrentFilter
				)
			) {
				return;
			}
			adminGalleryActionableItems.set([
				...$adminGalleryActionableItems,
				{
					output_id,
					generation_id,
					filter: $adminGalleryCurrentFilter
				}
			]);
		}
	};

	const removeFromGalleryActionableItems = (output_id: string) => {
		if (cardType === 'history') {
			userGalleryActionableItems.set(
				$userGalleryActionableItems.filter((i) => i.output_id !== output_id)
			);
		} else if (cardType === 'admin-gallery') {
			adminGalleryActionableItems.set(
				$adminGalleryActionableItems.filter((i) => i.output_id !== output_id)
			);
		}
	};

	const toggleGalleryActionableItemsState = ({
		output_id,
		generation_id
	}: {
		output_id: string;
		generation_id: string;
	}) => {
		if (isInGallerySelectedIds) {
			removeFromGalleryActionableItems(output_id);
		} else {
			addToGalleryActionableItems({ output_id, generation_id });
		}
	};

	$: showAdminGalleryBarrier =
		cardType === 'admin-gallery' &&
		((generation.selected_output.gallery_status === 'approved' &&
			$adminGalleryCurrentFilter !== 'approved') ||
			(generation.selected_output.gallery_status === 'rejected' &&
				$adminGalleryCurrentFilter !== 'rejected'));

	$: isGalleryEditActive =
		(cardType === 'admin-gallery' && $isAdminGalleryEditActive) ||
		(cardType === 'history' && $isUserGalleryEditActive);

	$: modalShouldOpen = !$isTouchscreen || $lastClickedOutputId === generation.selected_output.id;

	$: overlayShouldShow = $isTouchscreen && $lastClickedOutputId === generation.selected_output.id;

	$: logProps = {
		'SC - Output Id': generation.selected_output.id,
		'SC - User Id': $page.data.session?.user.id,
		'SC - Stripe Product Id': $userSummary?.product_id,
		'SC - Advanced Mode': $advancedModeApp,
		'SC - App Version': $appVersion
	};

	async function onSelectButtonClicked(
		e: MouseEvent & {
			currentTarget: EventTarget & HTMLButtonElement;
		}
	) {
		toggleGalleryActionableItemsState({
			output_id: generation.selected_output.id,
			generation_id: generation.id || ''
		});
		e.currentTarget.blur();
	}
</script>

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
			: 'opacity-0'} {isInGallerySelectedIds ? 'scale-110' : 'scale-100'}"
		src={useUpscaledImage && generation.selected_output.upscaled_image_url
			? generation.selected_output.upscaled_image_url
			: generation.selected_output.image_url}
		alt={generation.prompt.text}
		width={generation.width}
		height={generation.height}
	/>
{/if}
<div
	class="w-full h-full absolute left-0 top-0 flex items-center justify-center transition pointer-events-none {overlayShouldShow
		? 'bg-c-bg/40'
		: 'bg-c-bg/0'}"
/>
{#if !generation.selected_output.is_deleted && !isGalleryEditActive}
	<AnchorOrDiv
		href={cardType === 'gallery' ? `/gallery?output=${generation.selected_output.id}` : undefined}
		anchorPreventDefault={cardType === 'gallery'}
		onClick={(e) => {
			if (!modalShouldOpen) {
				lastClickedOutputId.set(generation.selected_output.id);
				return;
			}
			if (doesContainTarget(e.target, [rightButtonContainer, leftButtonContainer])) {
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
		<div class="w-full h-12 flex-shrink-0" />
		<div
			class="w-full flex-shrink min-h-0 max-h-[max(4rem,min(35%,5.3rem))] transition bg-c-bg/90 text-xs relative z-0 overflow-hidden
			 pointer-events-none {!$isTouchscreen
				? 'group-focus-within:translate-y-0 group-hover:translate-y-0'
				: ''} {overlayShouldShow ? 'translate-y-0' : 'translate-y-full'}"
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
<div
	class="w-full h-full absolute left-0 top-0 pointer-events-none flex items-start justify-between"
>
	<div
		class="w-full flex justify-between transition items-start {!$isTouchscreen
			? 'group-focus-within:translate-y-0 group-hover:translate-y-0'
			: ''} {isGalleryEditActive || overlayShouldShow ? 'translate-y-0' : '-translate-y-full'}"
	>
		<div bind:this={leftButtonContainer} class="pointer-events-none relative">
			{#if (cardType === 'admin-gallery' || cardType === 'history') && !(cardType === 'history' && generation.selected_output.is_deleted) && !(cardType === 'history' && $userGalleryCurrentView === 'favorites' && !generation.selected_output.is_favorited)}
				<div
					class="absolute pointer-events-none filter blur-xl rounded-full w-40 h-40 -left-20 -top-20 bg-gradient-radial from-c-bg-secondary to-c-bg-secondary/50"
				/>
				<IconButton
					class="p-0.5 pointer-events-auto"
					name="Select"
					onClick={() => {
						if (cardType === 'admin-gallery' && !$isAdminGalleryEditActive) {
							isAdminGalleryEditActive.set(true);
						} else if (cardType === 'history' && !$isUserGalleryEditActive) {
							isUserGalleryEditActive.set(true);
						}
						addToGalleryActionableItems({
							output_id: generation.selected_output.id,
							generation_id: generation.id || ''
						});
					}}
				>
					<div class="rounded-full border-2 border-c-primary w-6 h-6 transition p-0.75">
						<div
							class="w-full h-full rounded-full bg-c-primary transform transition {isInGallerySelectedIds
								? 'scale-100 opacity-100'
								: 'scale-0 opacity-0'}"
						/>
					</div>
				</IconButton>
			{/if}
		</div>
		{#if !isGalleryEditActive && !generation.selected_output.is_deleted}
			<div
				bind:this={rightButtonContainer}
				class="flex flex-row flex-wrap items-center justify-end transition transform 
				pointer-events-auto"
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
					<DownloadGenerationButton class="p-1.5 -ml-1.5" {generation} />
				{:else if cardType === 'gallery'}
					<GenerateButton {generation} class="p-1.5 -ml-1.5" />
				{/if}
			</div>
		{:else if cardType === 'history' && $userGalleryCurrentView !== 'favorites' && generation.selected_output.is_favorited && !generation.selected_output.is_deleted}
			<div class="p-1">
				<FavoriteButton {generation} modalType="history" />
			</div>
		{/if}
	</div>
	<div />
</div>
{#if generation.selected_output.is_deleted || (cardType === 'admin-gallery' && showAdminGalleryBarrier) || (cardType === 'history' && $userGalleryCurrentView === 'favorites' && !generation.selected_output.is_favorited)}
	<div class="w-full h-full absolute left-0 top-0 flex items-center justify-center p-4 z-20">
		{#if generation.selected_output.is_deleted}
			<IconTrashcan class="text-c-danger w-12 h-12" />
		{:else if generation.selected_output.gallery_status === 'approved'}
			<IconTick class="text-c-success w-12 h-12" />
		{:else if generation.selected_output.gallery_status === 'rejected'}
			<IconCancelCircle class="text-c-danger w-12 h-12" />
		{/if}
	</div>
	<div class="w-full h-full absolute left-0 top-0 bg-c-bg-secondary/85 z-10" />
{/if}
{#if (cardType === 'admin-gallery' && $isAdminGalleryEditActive) || (cardType === 'history' && $isUserGalleryEditActive)}
	<button
		disabled={(cardType === 'history' && generation.selected_output.is_deleted) ||
			(cardType === 'history' &&
				$userGalleryCurrentView === 'favorites' &&
				!generation.selected_output.is_favorited)}
		on:click={onSelectButtonClicked}
		class="w-full h-full absolute left-0 top-0 flex flex-col justify-start items-start z-30"
	/>
{/if}

<style>
	.list-fade {
		mask-image: linear-gradient(to top, transparent, transparent 0.35rem, black 1.1rem);
	}
</style>
