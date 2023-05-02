<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import AnchorOrDiv from '$components/AnchorOrDiv.svelte';
	import CopyButton from '$components/buttons/CopyButton.svelte';
	import DownloadGenerationButton from '$components/buttons/DownloadGenerationButton.svelte';
	import FavoriteButton from '$components/buttons/FavoriteButton.svelte';
	import GenerateButton from '$components/buttons/GenerateButton.svelte';
	import IconButton from '$components/buttons/IconButton.svelte';
	import UpscaleAnimation from '$components/generate/UpscaleAnimation.svelte';
	import type { TGenerationImageCardType } from '$components/generationImage/types';
	import IconCancelCircle from '$components/icons/IconCancelCircle.svelte';
	import IconGalleryFilled from '$components/icons/IconGalleryFilled.svelte';
	import IconNoImage from '$components/icons/IconNoImage.svelte';
	import IconTick from '$components/icons/IconTick.svelte';
	import IconTrashcan from '$components/icons/IconTrashcan.svelte';
	import { doesContainTarget } from '$ts/helpers/doesContainTarget';
	import { logGalleryGenerationOpened } from '$ts/helpers/loggers';
	import {
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
		userGalleryCurrentView,
		userGallerySelectedOutputIds
	} from '$ts/stores/user/gallery';
	import {
		addToGalleryActionableItems,
		toggleGalleryActionableItemsState
	} from '$ts/stores/user/galleryActionableItems';
	import { userSummary } from '$ts/stores/user/summary';
	import { upscales } from '$ts/stores/user/upscale';
	import { activeGeneration, type TGenerationWithSelectedOutput } from '$userStores/generation';

	export let generation: TGenerationWithSelectedOutput;
	export let useUpscaledImage = true;
	export let scrollPrompt = false;
	export let cardType: TGenerationImageCardType;
	export let isGalleryEditActive: boolean = false;

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

	$: showAdminGalleryBarrier =
		cardType === 'admin-gallery' &&
		((generation.selected_output.gallery_status === 'approved' &&
			$adminGalleryCurrentFilter !== 'approved') ||
			(generation.selected_output.gallery_status === 'rejected' &&
				$adminGalleryCurrentFilter !== 'rejected'));

	$: modalShouldOpen =
		!$isTouchscreen ||
		$lastClickedOutputId === generation.selected_output.id ||
		cardType === 'generate';

	$: overlayShouldShow = $isTouchscreen && $lastClickedOutputId === generation.selected_output.id;

	$: upscaleFromStore =
		cardType !== 'gallery' && cardType !== 'admin-gallery'
			? $upscales.find(
					(upscale) =>
						upscale.type === 'from_output' && upscale.input === generation.selected_output.id
			  )
			: undefined;

	let imageClickHref: string;

	$: {
		let params: string;
		if (browser && window && window.location.search !== $page.url.search) {
			const searchParams = new URLSearchParams(window.location.search);
			searchParams.set('output', generation.selected_output.id);
			params = searchParams.toString();
		} else {
			params = `output=${generation.selected_output.id}`;
		}
		imageClickHref = `${$page.url.pathname}?${params}`;
	}

	async function onSelectButtonClicked(
		e: MouseEvent & {
			currentTarget: EventTarget & HTMLButtonElement;
		}
	) {
		toggleGalleryActionableItemsState({
			output_id: generation.selected_output.id,
			generation_id: generation.id || '',
			cardType,
			type: isInGallerySelectedIds ? 'remove' : 'add'
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
{#if upscaleFromStore?.animation}
	<UpscaleAnimation
		animation={upscaleFromStore.animation}
		isProcessing={upscaleFromStore.status !== 'failed' && upscaleFromStore.status !== 'succeeded'}
	/>
{/if}
<!-- Barriers -->
{#if cardType !== 'stage' && cardType !== 'generate' && cardType !== 'gallery'}
	<div
		class="absolute top-0 left-0 w-full h-24 bg-gradient-to-b from-c-barrier/90 via-c-barrier/60 to-c-barrier/0 
		flex justify-between transition items-start {!$isTouchscreen
			? 'group-focus-within:opacity-100 group-hover:opacity-100'
			: ''} {isGalleryEditActive || overlayShouldShow ? 'opacity-100' : 'opacity-0'}"
	/>
{/if}
{#if cardType !== 'generate' && !generation.selected_output.is_deleted && !isGalleryEditActive}
	<div
		class="absolute bottom-0 left-0 w-full h-full max-h-[12rem] bg-gradient-to-t transition
		from-c-barrier/90 via-c-barrier/60 to-c-barrier/0 {!$isTouchscreen
			? 'group-focus-within:opacity-100 group-hover:opacity-100'
			: ''} {overlayShouldShow ? 'opacity-100' : 'opacity-0'}"
	/>
{/if}
{#if !generation.selected_output.is_deleted && !isGalleryEditActive}
	<a
		href={imageClickHref}
		data-sveltekit-preload-data="hover"
		on:click|preventDefault={(e) => {
			if (!modalShouldOpen) {
				lastClickedOutputId.set(generation.selected_output.id);
				return;
			}
			if (
				rightButtonContainer &&
				leftButtonContainer &&
				doesContainTarget(e.target, [rightButtonContainer, leftButtonContainer])
			) {
				return;
			}
			e.currentTarget.blur();
			activeGeneration.set({ ...generation, card_type: cardType });
			if ($page.url.pathname === '/gallery') {
				logGalleryGenerationOpened({
					'SC - Output Id': generation.selected_output.id,
					'SC - User Id': $page.data.session?.user.id,
					'SC - Stripe Product Id': $userSummary?.product_id,
					'SC - Advanced Mode': $advancedModeApp,
					'SC - App Version': $appVersion
				});
			}
			const searchParams = new URLSearchParams(window.location.search);
			searchParams.set('output', generation.selected_output.id);
			window.history.pushState({}, '', `${$page.url.pathname}?${searchParams.toString()}`);
		}}
		class="w-full h-full absolute left-0 top-0 flex flex-col justify-end items-start overflow-hidden gap-4"
	>
		{#if cardType !== 'generate'}
			<div
				class="w-full h-full pt-16 flex flex-col justify-end items-start flex-shrink 
				transition text-sm relative z-0 overflow-hidden
			 	pointer-events-none {!$isTouchscreen
					? 'group-focus-within:translate-y-0 group-hover:translate-y-0'
					: ''} {overlayShouldShow ? 'translate-y-0' : 'translate-y-full'}"
			>
				<div
					class="w-full flex flex-col justify-end items-start min-h-0 max-h-[max(4rem,min(35%,5.3rem))]"
				>
					<div
						class="{scrollPrompt
							? 'overflow-auto'
							: 'overflow-hidden'} w-full max-h-full list-fade px-2 md:px-3 py-2 md:py-2.5 flex flex-col gap-1 cursor-default"
					>
						<p class="w-full font-medium leading-normal transition text-c-on-bg transform">
							{generation.prompt.text}
						</p>
					</div>
				</div>
			</div>
		{/if}
	</a>
{/if}
{#if cardType !== 'generate'}
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
					<IconButton
						class="p-2px pointer-events-auto"
						name="Select"
						onClick={() => {
							if (cardType === 'admin-gallery' && !$isAdminGalleryEditActive) {
								isAdminGalleryEditActive.set(true);
							} else if (cardType === 'history' && !$isUserGalleryEditActive) {
								isUserGalleryEditActive.set(true);
							}
							addToGalleryActionableItems({
								output_id: generation.selected_output.id,
								generation_id: generation.id || '',
								cardType
							});
						}}
					>
						<div class="rounded-full border-3 border-c-primary w-6 h-6 transition p-0.75">
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
					{#if cardType === 'history' || cardType === 'stage'}
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
{/if}
<!-- Deleted, approved or rejected -->
{#if generation.selected_output.is_deleted || (cardType === 'admin-gallery' && showAdminGalleryBarrier) || (cardType === 'history' && $userGalleryCurrentView === 'favorites' && !generation.selected_output.is_favorited)}
	<div class="w-full h-full absolute left-0 top-0 bg-c-barrier/85 z-10" />
	<div class="w-full h-full absolute left-0 top-0 flex items-center justify-center p-4 z-20">
		{#if generation.selected_output.is_deleted}
			<IconTrashcan class="text-c-danger w-12 h-12" />
		{:else if generation.selected_output.gallery_status === 'approved'}
			<IconTick class="text-c-success w-12 h-12" />
		{:else if generation.selected_output.gallery_status === 'rejected'}
			<IconCancelCircle class="text-c-danger w-12 h-12" />
		{/if}
	</div>
{/if}
{#if cardType === 'admin-gallery' && generation.init_image_url}
	<div class="absolute -top-px -right-px pr-1 pt-1 pl-2 pb-2 rounded-bl-lg bg-c-bg-secondary">
		<IconGalleryFilled class="text-c-danger" />
	</div>
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
