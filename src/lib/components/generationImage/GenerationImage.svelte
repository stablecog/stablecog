<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import CopyButton from '$components/buttons/CopyButton.svelte';
	import DownloadGenerationButton from '$components/buttons/DownloadGenerationButton.svelte';
	import ExploreSimilarButton from '$components/buttons/ExploreSimilarButton.svelte';
	import FavoriteButton from '$components/buttons/FavoriteButton.svelte';
	import GenerateButton from '$components/buttons/GenerateButton.svelte';
	import IconButton from '$components/buttons/IconButton.svelte';
	import LikeButton from '$components/buttons/LikeButton.svelte';
	import UpscaleAnimation from '$components/generate/UpscaleAnimation.svelte';
	import SrcsetProvider from '$components/generationImage/SrcsetProvider.svelte';
	import { onSelectButtonClicked } from '$components/generationImage/helpers';
	import type { TGenerationImageCardType } from '$components/generationImage/types';
	import IconCancelCircle from '$components/icons/IconCancelCircle.svelte';
	import IconEyeSlashOutline from '$components/icons/IconEyeSlashOutline.svelte';
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
	import { loadedImages } from '$ts/stores/loadedImages';
	import {
		isUserGalleryEditActive,
		userGalleryCurrentView,
		userGallerySelectedOutputIds
	} from '$ts/stores/user/gallery';
	import { addToGalleryActionableItems } from '$ts/stores/user/galleryActionableItems';
	import { recentlyUpdatedOutputIds } from '$ts/stores/user/recentlyUpdatedOutputIds';
	import { userSummary } from '$ts/stores/user/summary';
	import { upscales } from '$ts/stores/user/upscale';
	import { activeGeneration, type TGenerationWithSelectedOutput } from '$userStores/generation';

	export let generation: TGenerationWithSelectedOutput;
	export let cardType: TGenerationImageCardType;
	export let isGalleryEditActive: boolean = false;
	export let didLoadBefore: boolean = false;
	export let cardWidth: number | undefined = undefined;
	export let setSearchQuery: ((query: string) => void) | undefined = undefined;
	export let onLikesChanged:
		| (({
				newLikeCount,
				newIsLikedByUser,
				action
		  }: {
				newLikeCount: number;
				newIsLikedByUser: boolean;
				action: 'like' | 'unlike';
		  }) => void)
		| undefined = undefined;

	$: srcHighest =
		generation.selected_output.upscaled_image_url ?? generation.selected_output.image_url;
	$: srcLowest = generation.selected_output.image_url;
	$: srcPicked = cardType === 'stage' ? srcHighest : srcLowest;

	let promptCopied = false;
	let promptCopiedTimeout: NodeJS.Timeout;
	let rightButtonContainer: HTMLDivElement;
	let leftButtonContainer: HTMLDivElement;
	const showPromptOnHover = cardType !== 'gallery' && cardType !== 'admin-gallery' ? true : false;

	let isImageLoaded = false;
	const onImageLoaded = () => {
		isImageLoaded = true;
		setTimeout(() => {
			loadedImages[generation.selected_output.image_url + cardType] = true;
		}, 500);
	};

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

	$: isRecentlyUpdated =
		cardType === 'gallery' || cardType === 'admin-gallery'
			? false
			: $recentlyUpdatedOutputIds.includes(generation.selected_output.id);

	$: upscaleFromStore =
		cardType !== 'gallery' && cardType !== 'admin-gallery'
			? $upscales.find(
					(upscale) =>
						upscale.type === 'from_output' && upscale.input === generation.selected_output.id
			  )
			: undefined;

	$: shortPrompt = generation.prompt.text.slice(0, 50);

	let imageClickHref: string;

	$: {
		let params: string;
		if (browser && window && window.location.search !== $page.url.search) {
			const searchParams = new URLSearchParams(window.location.search);
			searchParams.set('o', generation.selected_output.id);
			params = searchParams.toString();
		} else {
			params = `o=${generation.selected_output.id}`;
		}
		imageClickHref =
			cardType === 'gallery' || cardType === 'user-profile'
				? `${$page.url.pathname}/o/${generation.selected_output.id}`
				: `${$page.url.pathname}?${params}`;
	}

	function onImageClick(e: any) {
		if (!modalShouldOpen) {
			lastClickedOutputId.set(generation.selected_output.id);
			return;
		}
		if (rightButtonContainer && doesContainTarget(e.target, [rightButtonContainer])) {
			return;
		}
		if (leftButtonContainer && doesContainTarget(e.target, [leftButtonContainer])) {
			return;
		}
		e.currentTarget.blur();
		activeGeneration.set({
			...generation,
			card_type: cardType,
			prev: $page.url.pathname + $page.url.search
		});
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
		searchParams.set('o', generation.selected_output.id);
		const urlToPush =
			cardType === 'gallery' || cardType === 'user-profile'
				? `${$page.url.pathname}/o/${generation.selected_output.id}`
				: `${$page.url.pathname}?${searchParams.toString()}`;
		window.history.pushState(window.history.state, '', urlToPush);
	}

	function _onSelectButtonClicked(e: any) {
		onSelectButtonClicked({
			e,
			cardType,
			generation_id: generation.id,
			output_id: generation.selected_output.id,
			isInGallerySelectedIds
		});
	}
</script>

{#if generation.selected_output.image_url.includes('placeholder')}
	<svg
		class="w-full h-full object-cover absolute left-0 top-0 text-c-bg-secondary"
		width={generation.width}
		height={generation.height}
		viewBox="0 0 {generation.width} {generation.height}"
		fill="none"
		xmlns="http://www.w3.org/2000/svg"
	>
		<rect width={generation.width} height={generation.height} fill="currentColor" />
	</svg>
	<div class="w-full h-full absolute left-0 top-0 p-5 flex items-center justify-center">
		<IconNoImage class="w-10 h-10 text-c-on-bg/40" />
	</div>
{:else}
	<SrcsetProvider src={srcHighest} {cardType} let:sizes let:srcset>
		<div
			class="w-full h-full absolute left-0 top-0 transition duration-350 {cardType === 'generate'
				? 'not-touch:group-hover:scale-105'
				: 'not-touch:group-hover:scale-105 md:not-touch:group-hover:scale-103'}
			{overlayShouldShow ? (cardType === 'generate' ? 'scale-105' : 'scale-105 md:scale-103') : ''}"
		>
			<img
				on:load={onImageLoaded}
				loading="lazy"
				class="w-full h-full object-cover absolute left-0 top-0 {didLoadBefore
					? 'transition-[transform] ease-[ease-out] duration-[0.2s]'
					: 'transition-[transform,opacity] ease-[ease-out,ease-in] duration-[0.2s,0.2s]'} 
				transform {isImageLoaded ? 'opacity-100' : 'opacity-0'} {isInGallerySelectedIds
					? 'scale-110'
					: 'scale-100'}"
				{sizes}
				src={srcPicked}
				{srcset}
				alt={generation.prompt.text}
				width={generation.width}
				height={generation.height}
			/>
		</div>
	</SrcsetProvider>
{/if}
{#if upscaleFromStore?.animation}
	<UpscaleAnimation
		animation={upscaleFromStore.animation}
		isProcessing={upscaleFromStore.status !== 'failed' &&
			upscaleFromStore.status !== 'succeeded' &&
			!generation.selected_output.upscaled_image_url}
	/>
{/if}
<!-- Top Barrier -->
{#if cardType !== 'stage' && cardType !== 'generate' && cardType !== 'gallery' && cardType !== 'user-profile' && !generation.selected_output.is_deleted && !(cardType === 'history' && $userGalleryCurrentView === 'likes')}
	<div
		class="absolute top-0 left-0 w-full h-24 bg-gradient-to-b
		from-c-barrier/90 via-c-barrier/60 to-c-barrier/0
		flex justify-between transition items-start
		not-touch:group-focus-within:opacity-100 not-touch:group-hover:opacity-100
			{isGalleryEditActive || overlayShouldShow ? 'opacity-100' : 'opacity-0'}"
	/>
{/if}
<!-- Bottom Barrier -->
{#if showPromptOnHover && cardType !== 'generate' && !generation.selected_output.is_deleted && !isGalleryEditActive}
	<div
		class="absolute bottom-0 left-0 w-full h-full max-h-[12rem] bg-gradient-to-t
		transition from-c-barrier/90 via-c-barrier/60 to-c-barrier/0
		not-touch:group-focus-within:opacity-100 not-touch:group-hover:opacity-100
			{overlayShouldShow ? 'opacity-100' : 'opacity-0'}"
	/>
{/if}
{#if cardType !== 'gallery' && cardType !== 'admin-gallery' && isRecentlyUpdated}
	<!-- Ping animation for newly created -->
	<div class="absolute w-full pointer-events-none">
		<div
			class="absolute left-0 top-0 w-full h-12 bg-gradient-to-b from-c-barrier/75 to-c-barrier/0"
		/>
		<div
			class="{cardType === 'stage' ? 'w-6 h-6' : 'w-5 h-5'} {cardType === 'generate'
				? '-left-0.5 -top-0.5'
				: 'left-0 top-0'} relative"
		>
			<div class="absolute w-full h-full rounded-full animate-ping-custom bg-c-primary/50" />
			<div class="w-full h-full transform scale-40">
				<div class="w-full h-full rounded-full animate-ping-custom-bg bg-c-primary" />
			</div>
		</div>
	</div>
{/if}
{#if !generation.selected_output.is_deleted && !isGalleryEditActive}
	<a
		aria-label="View generation: {shortPrompt}..."
		href={imageClickHref}
		data-sveltekit-preload-data="hover"
		on:click|preventDefault={onImageClick}
		class="w-full h-full absolute left-0 top-0 flex flex-col justify-end items-end overflow-hidden pt-16"
	>
		{#if cardType !== 'generate' && showPromptOnHover}
			<p
				class="w-full text-sm min-h-0 max-h-[max(4rem,min(35%,5.3rem))] list-fade px-2 md:px-3 py-2 md:py-2.5
				font-medium leading-normal transition text-c-on-bg transform pointer-events-none
					not-touch:group-focus-within:translate-y-0 not-touch:group-hover:translate-y-0
					{overlayShouldShow ? 'translate-y-0' : 'translate-y-full'}"
			>
				{generation.prompt.text}
			</p>
		{/if}
	</a>
{/if}
{#if cardType !== 'generate'}
	{@const showLeftContainer =
		(cardType === 'admin-gallery' || cardType === 'history') &&
		!(cardType === 'history' && generation.selected_output.is_deleted) &&
		!(
			cardType === 'history' &&
			$userGalleryCurrentView === 'favorites' &&
			!generation.selected_output.is_favorited
		) &&
		!(cardType === 'history' && $userGalleryCurrentView === 'likes')}
	<div
		class="w-full absolute left-0 top-0 pointer-events-none flex items-start {showLeftContainer
			? 'justify-between'
			: 'justify-end'} transition
			not-touch:group-focus-within:translate-y-0 not-touch:group-hover:translate-y-0
			{isGalleryEditActive || overlayShouldShow ? 'translate-y-0' : '-translate-y-full'}"
	>
		{#if showLeftContainer}
			<div bind:this={leftButtonContainer} class="pointer-events-none relative">
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
			</div>
		{/if}
		{#if !isGalleryEditActive && !generation.selected_output.is_deleted}
			<div
				bind:this={rightButtonContainer}
				class="flex flex-row flex-wrap items-center pr-1.5 pt-1.5
				justify-end transition transform pointer-events-none gap-1.5"
			>
				{#if (cardType !== 'admin-gallery' && cardType !== 'gallery' && cardType !== 'user-profile') || (cardType === 'user-profile' && generation.user.username === $userSummary?.username)}
					<CopyButton
						stringToCopy={generation.prompt.text}
						bind:copied={promptCopied}
						bind:copiedTimeout={promptCopiedTimeout}
						class="pointer-events-auto"
					/>
				{/if}
				{#if cardType === 'history' || cardType === 'stage'}
					<DownloadGenerationButton class="pointer-events-auto" {generation} />
				{:else if cardType === 'gallery' || cardType === 'user-profile'}
					<GenerateButton
						{generation}
						class="pointer-events-auto"
						label="Generate similar to: {shortPrompt}..."
					/>
				{/if}
				{#if (cardType === 'stage' || (cardType === 'history' && $userGalleryCurrentView === 'all')) && cardWidth !== undefined && ((cardType === 'history' && cardWidth > 225) || (cardType === 'stage' && cardWidth > 180))}
					<FavoriteButton
						{generation}
						modalType={cardType}
						type="on-image"
						class="pointer-events-auto"
					/>
				{/if}
				{#if (cardType === 'gallery' || cardType === 'user-profile') && setSearchQuery}
					<ExploreSimilarButton
						{setSearchQuery}
						{generation}
						{cardType}
						class="pointer-events-auto"
					/>
				{/if}
				{#if cardType === 'gallery' || (cardType === 'user-profile' && generation.user.username !== $userSummary?.username)}
					<LikeButton
						{generation}
						modalType={cardType}
						type="on-image"
						class="pointer-events-auto"
						{onLikesChanged}
					/>
				{/if}
			</div>
		{:else if cardType === 'history' && $userGalleryCurrentView !== 'favorites' && generation.selected_output.is_favorited && !generation.selected_output.is_deleted}
			<div class="p-1">
				<FavoriteButton {generation} modalType="history" />
			</div>
		{/if}
	</div>
{/if}
{#if (cardType === 'user-profile' && generation.selected_output.is_public === false) || generation.selected_output.is_deleted || (cardType === 'admin-gallery' && showAdminGalleryBarrier) || (cardType === 'history' && $userGalleryCurrentView === 'favorites' && !generation.selected_output.is_favorited) || (cardType === 'history' && $userGalleryCurrentView === 'likes' && !generation.selected_output.is_liked)}
	<!-- Deleted, approved, rejected or just hidden -->
	{@const sizeClasses =
		generation.height > generation.width
			? cardType === 'generate'
				? 'h-full max-h-[2rem] w-auto'
				: 'h-full max-h-[3rem] w-auto'
			: cardType === 'generate'
			? 'w-full max-w-[2rem] h-auto'
			: 'w-full max-w-[3rem] h-auto'}
	{@const isUserProfileAndImageHidden =
		cardType === 'user-profile' && generation.selected_output.is_public === false}
	<div
		class="w-full h-full absolute left-0 top-0 bg-c-barrier/85 z-10 {isUserProfileAndImageHidden
			? 'pointer-events-none'
			: ''}"
	/>
	<div
		class="w-full h-full absolute left-0 top-0 flex items-center justify-center p-1 z-20 {isUserProfileAndImageHidden
			? 'pointer-events-none'
			: ''}"
	>
		{#if isUserProfileAndImageHidden}
			<IconEyeSlashOutline class="text-c-danger {sizeClasses}" />
		{:else if generation.selected_output.is_deleted}
			<IconTrashcan class="text-c-danger {sizeClasses}" />
		{:else if cardType === 'admin-gallery' && generation.selected_output.gallery_status === 'approved'}
			<IconTick class="text-c-success {sizeClasses}" />
		{:else if cardType === 'admin-gallery' && generation.selected_output.gallery_status === 'rejected'}
			<IconCancelCircle class="text-c-danger {sizeClasses}" />
		{/if}
	</div>
{/if}
{#if cardType === 'admin-gallery' && generation.init_image_url}
	<!-- Admin gallery init image indicator -->
	<div class="absolute -top-px -right-px pr-1 pt-1 pl-2 pb-2 rounded-bl-lg bg-c-bg-secondary">
		<IconGalleryFilled class="text-c-danger" />
	</div>
{/if}
{#if (cardType === 'admin-gallery' && $isAdminGalleryEditActive) || (cardType === 'history' && $isUserGalleryEditActive)}
	<!-- Select button -->
	<button
		disabled={(cardType === 'history' && generation.selected_output.is_deleted) ||
			(cardType === 'history' &&
				$userGalleryCurrentView === 'favorites' &&
				!generation.selected_output.is_favorited)}
		on:click={_onSelectButtonClicked}
		class="w-full h-full absolute left-0 top-0 flex flex-col justify-start items-start z-30"
	/>
{/if}
