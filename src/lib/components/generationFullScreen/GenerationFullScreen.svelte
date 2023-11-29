<script lang="ts">
	import { browser } from '$app/environment';
	import { page } from '$app/stores';
	import ModalWrapper from '$components/ModalWrapper.svelte';
	import QueuePosition from '$components/QueuePosition.svelte';
	import ScrollAreaWithChevron from '$components/ScrollAreaWithChevron.svelte';
	import InsufficientCreditsBadge from '$components/badges/InsufficientCreditsBadge.svelte';
	import Button from '$components/buttons/Button.svelte';
	import ButtonHoverEffect from '$components/buttons/ButtonHoverEffect.svelte';
	import FavoriteButton from '$components/buttons/FavoriteButton.svelte';
	import UsernameButton from '$components/buttons/UsernameButton.svelte';
	import UpscaleAnimation from '$components/generate/UpscaleAnimation.svelte';
	import ButtonsSection from '$components/generationFullScreen/ButtonsSection.svelte';
	import Container from '$components/generationFullScreen/Container.svelte';
	import Divider from '$components/generationFullScreen/Divider.svelte';
	import GenerationFullScreenImageSet from '$components/generationFullScreen/GenerationFullScreenImageSet.svelte';
	import NegativePromptSection from '$components/generationFullScreen/NegativePromptSection.svelte';
	import ParamsSection from '$components/generationFullScreen/ParamsSection.svelte';
	import ShowOnProfileSection from '$components/generationFullScreen/ShowOnProfileSection.svelte';
	import SideButton from '$components/generationFullScreen/SideButton.svelte';
	import SimilarOutputsSection from '$components/generationFullScreen/SimilarOutputsSection.svelte';
	import {
		lgBreakpoint,
		mdBreakpoint,
		sidebarWidth
	} from '$components/generationFullScreen/constants';
	import type {
		TButtonObjectsWithState,
		TGenerationFullScreenModalType,
		TSetButtonObjectWithState
	} from '$components/generationFullScreen/types';
	import SrcsetProvider from '$components/generationImage/SrcsetProvider.svelte';
	import IconNoImage from '$components/icons/IconNoImage.svelte';
	import IconUpscale from '$components/icons/IconUpscale.svelte';
	import TabBar from '$components/tabBars/TabBar.svelte';
	import LL, { locale } from '$i18n/i18n-svelte';
	import { upscaleModelIdDefault } from '$ts/constants/upscaleModels';
	import { isSuperAdmin } from '$ts/helpers/admin/roles';
	import { generateSSEId } from '$ts/helpers/generateSSEId';
	import { getGenerationUrlFromParams } from '$ts/helpers/getGenerationUrlFromParams';
	import { getRelativeDate } from '$ts/helpers/getRelativeDate';
	import { adminGallerySelectedOutputIds } from '$ts/stores/admin/gallery';
	import { lastClickedOutputId } from '$ts/stores/lastClickedOutputId';
	import { userGalleryCurrentView } from '$ts/stores/user/gallery';
	import { toggleGalleryActionableItemsState } from '$ts/stores/user/galleryActionableItems';
	import { getQueuePositionFromId, queue } from '$ts/stores/user/queue';
	import { removeFromRecentlyUpdatedOutputIds } from '$ts/stores/user/recentlyUpdatedOutputIds';
	import { userSummary } from '$ts/stores/user/summary';
	import {
		maxOngoingUpscalesCountReached,
		queueInitialUpscaleRequest,
		upscales,
		type TInitialUpscaleRequest
	} from '$ts/stores/user/upscale';
	import { windowWidth } from '$ts/stores/window';
	import { activeGeneration, type TGenerationWithSelectedOutput } from '$userStores/generation';
	import { sseId } from '$userStores/sse';
	import { onMount } from 'svelte';
	import { quadOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';

	export let generation: TGenerationWithSelectedOutput;
	export let modalType: TGenerationFullScreenModalType;
	export let onLeftButtonClicked: (() => void) | undefined = undefined;
	export let onRightButtonClicked: (() => void) | undefined = undefined;
	export let setSearchQuery: ((query: string) => void) | undefined = undefined;
	export let outputsLength: number | undefined = undefined;
	export let outputIndex: number | undefined = undefined;
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

	let buttonLeft: HTMLButtonElement;
	let buttonRight: HTMLButtonElement;
	let buttonLeftMobile: HTMLButtonElement;
	let buttonRightMobile: HTMLButtonElement;

	$: upscaleFromStore = $upscales.find(
		(upscale) => upscale.type === 'from_output' && upscale.input === generation.selected_output.id
	);

	$: upscaledImageUrlFromStore =
		upscaleFromStore &&
		upscaleFromStore.outputs &&
		upscaleFromStore.outputs.length > 0 &&
		upscaleFromStore.outputs[0].image_url
			? upscaleFromStore.outputs[0].image_url
			: undefined;

	$: [upscaleFromStore], onUpscaleFromStoreChanged();

	function setUpscaleFromStore() {
		upscaleFromStore = $upscales.find(
			(upscale) => upscale.type === 'from_output' && upscale.input === generation.selected_output.id
		);
	}
	function onUpscaleFromStoreChanged() {
		if (upscaledImageUrlFromStore !== undefined && !generation.selected_output.upscaled_image_url) {
			generation.selected_output.upscaled_image_url = upscaledImageUrlFromStore;
		}
	}

	$: currentImageUrl = generation.selected_output.upscaled_image_url
		? generation.selected_output.upscaled_image_url
		: generation.selected_output.image_url;

	$: upscaledImageWidth = generation.selected_output.upscaled_image_url
		? generation.width * 4
		: undefined;
	$: upscaledImageHeight = generation.selected_output.upscaled_image_url
		? generation.height * 4
		: undefined;

	$: generation.selected_output, onGenerationChanged();
	$: selectedOutputId = generation.selected_output.id;
	let initialGenerationChange = true;
	$: upscaleBeingProcessed = upscaleFromStore
		? upscaleFromStore.status !== 'succeeded' &&
		  upscaleFromStore.status !== 'failed' &&
		  !generation.selected_output.upscaled_image_url
		: false;

	let sidebarScrollContainer: HTMLDivElement | undefined;

	let generateSimilarUrl: string;
	let linkUrl: string;

	let modalScrollContainer: HTMLDivElement | undefined;

	$: exploreSimilarUrl = `${
		modalType === 'user-profile' ? `/user/${generation.user.username}` : '/gallery'
	}?q=${generation.selected_output.id}`;

	let upscaledTabValue: TUpscaleTabValue = 'upscaled';
	type TUpscaleTabValue = 'original' | 'upscaled';
	let upscaledOrDefaultTabs: { label: string; value: TUpscaleTabValue }[];

	$: upscaledOrDefaultTabs = [
		{
			label: $LL.GenerationFullscreen.UpscaleTabBar.UpscaledTitle(),
			value: 'upscaled'
		},
		{
			label: $LL.GenerationFullscreen.UpscaleTabBar.OriginalTitle(),
			value: 'original'
		}
	];

	const upscaleCreditCost = 1;
	$: doesntHaveEnoughCredits =
		$userSummary && $page.data.session?.user.id
			? $userSummary.total_remaining_credits < upscaleCreditCost
			: false;

	const onGenerationChanged = () => {
		removeFromRecentlyUpdatedOutputIds(generation.selected_output.id);
		setUpscaleFromStore();
		currentImageUrl =
			generation.selected_output.upscaled_image_url ?? generation.selected_output.image_url;
		if (generation.selected_output.upscaled_image_url) upscaledTabValue = 'upscaled';
		buttonObjectsWithState = { ...initialButtonObjectsWithState };
		const { seed, selected_output, ...rest } = generation;
		generateSimilarUrl = getGenerationUrlFromParams(rest);
		linkUrl =
			modalType === 'user-profile' ||
			(modalType === 'history' && $userGalleryCurrentView !== 'likes') ||
			(modalType === 'history' &&
				$userGalleryCurrentView === 'likes' &&
				generation.selected_output.gallery_status !== 'approved') ||
			modalType === 'generate' ||
			modalType === 'stage'
				? `${$page.url.origin}/user/${generation.user.username}/o/${generation.selected_output.id}`
				: `${$page.url.origin}/gallery/o/${generation.selected_output.id}`;
		if (browser && window && !initialGenerationChange) {
			if (modalType === 'gallery') {
				window.history.replaceState({}, '', `/gallery/o/${generation.selected_output.id}`);
			} else if (modalType === 'user-profile') {
				window.history.replaceState(
					{},
					'',
					`/user/${generation.user.username}/o/${generation.selected_output.id}`
				);
			} else {
				const searchParams = new URLSearchParams(window.location.search);
				searchParams.set('o', generation.selected_output.id);
				const params = searchParams.toString();
				window.history.replaceState({}, '', `${window.location.pathname}?${params}`);
			}
		}
		resetAllButtonObjectWithState();
		initialGenerationChange = false;
	};

	const initialButtonObjectsWithState: TButtonObjectsWithState = {
		prompt: {
			state: 'idle'
		},
		seed: {
			state: 'idle'
		},
		link: {
			state: 'idle'
		},
		download: {
			state: 'idle'
		}
	};

	let buttonObjectsWithState = { ...initialButtonObjectsWithState };

	const setButtonObjectWithState: TSetButtonObjectWithState = (key, state) => {
		buttonObjectsWithState[key].state = state;
		if (state === 'success') {
			if (buttonObjectsWithState[key].timeout) {
				clearTimeout(buttonObjectsWithState[key].timeout);
			}
			buttonObjectsWithState[key].timeout = setTimeout(() => {
				buttonObjectsWithState[key].state = 'idle';
			}, 2000);
			for (const buttonKey in buttonObjectsWithState) {
				if (buttonKey !== key) {
					buttonObjectsWithState[buttonKey].state = 'idle';
					if (buttonObjectsWithState[buttonKey].timeout) {
						clearTimeout(buttonObjectsWithState[buttonKey].timeout);
					}
				}
			}
		}
		buttonObjectsWithState = { ...buttonObjectsWithState };
	};

	const resetAllButtonObjectWithState = () => {
		for (const key in buttonObjectsWithState) {
			if (buttonObjectsWithState[key].timeout) {
				clearTimeout(buttonObjectsWithState[key].timeout);
			}
			buttonObjectsWithState[key].state = 'idle';
		}
	};

	async function onUpscaleClicked() {
		if (!$sseId) {
			console.log('No SSE ID, cannot upscale');
			return;
		}
		const initialRequestProps: TInitialUpscaleRequest = {
			input: generation.selected_output.id,
			model_id: upscaleModelIdDefault,
			type: 'from_output',
			stream_id: $sseId,
			ui_id: generateSSEId()
		};
		queueInitialUpscaleRequest(initialRequestProps);
	}

	$: upscaledTabValue, setCurrentImageUrl();

	$: backgroundImageUrl =
		modalType !== 'stage' && generation.selected_output.upscaled_image_url
			? generation.selected_output.upscaled_image_url
			: generation.selected_output.image_url;

	function setCurrentImageUrl() {
		if (
			upscaledTabValue === 'upscaled' &&
			generation.selected_output.upscaled_image_url !== undefined
		) {
			currentImageUrl = generation.selected_output.upscaled_image_url;
		} else {
			currentImageUrl = generation.selected_output.image_url;
		}
	}

	const onPopState: any = (e: any) => {
		const searchParams = new URLSearchParams(e.currentTarget.location.search);
		const hasOutputParam = searchParams.has('o');
		if (!hasOutputParam) {
			activeGeneration.set(undefined);
		}
	};

	$: positionInQueue = getQueuePositionFromId(upscaleFromStore?.queued_id, $queue);
	$: positionInQueue, onPositionInQueueChanged();

	let debouncedPositionInQueue: number | undefined;
	let positionInQueueTimeout: NodeJS.Timeout;

	function onPositionInQueueChanged() {
		let hasPrevValue = debouncedPositionInQueue !== undefined;
		clearTimeout(positionInQueueTimeout);
		// First entry
		if (positionInQueue !== undefined && !hasPrevValue) {
			positionInQueueTimeout = setTimeout(() => {
				debouncedPositionInQueue = positionInQueue;
			}, 750);
			return;
		}
		// Updates after the first entry except exit
		if (positionInQueue !== undefined && hasPrevValue) {
			debouncedPositionInQueue = positionInQueue;
			return;
		}
		// Exit
		positionInQueueTimeout = setTimeout(() => {
			debouncedPositionInQueue = positionInQueue;
		}, 2000);
	}

	function onSelect() {
		toggleGalleryActionableItemsState({
			output_id: generation.selected_output.id,
			cardType: 'admin-gallery',
			generation_id: generation.id || generation.ui_id,
			type: $adminGallerySelectedOutputIds.includes(generation.selected_output.id)
				? 'remove'
				: 'add'
		});
	}

	function onKeyPress(event: KeyboardEvent) {
		if (modalType !== 'admin-gallery') return;
		if (event.key === 'Enter') {
			onSelect();
		}
	}

	let shareButtonPortalBarrier: HTMLDivElement;
	let shareButtonPortalContent: HTMLDivElement;

	$: now = generation ? Date.now() : Date.now();

	onMount(() => {
		lastClickedOutputId.set(undefined);
	});
</script>

<svelte:window on:popstate={onPopState} on:keypress={onKeyPress} />

<ModalWrapper
	bind:scrollContainer={modalScrollContainer}
	hasPadding={false}
	onClose={$windowWidth < mdBreakpoint
		? () => {
				if ($activeGeneration !== undefined) {
					activeGeneration.set(undefined);
				}
		  }
		: undefined}
>
	<Container
		clickoutsideExceptions={[
			buttonLeft,
			buttonRight,
			shareButtonPortalBarrier,
			shareButtonPortalContent
		]}
		{generation}
		let:imageContainerWidth
		let:imageContainerHeight
		let:modalMinHeight
		ringClass={modalType === 'admin-gallery' &&
		$adminGallerySelectedOutputIds.includes(generation.selected_output.id)
			? 'ring-c-primary'
			: 'ring-c-bg-tertiary'}
	>
		<div class="relative self-stretch flex items-center">
			{#if generation.selected_output.image_url}
				{#key generation.selected_output.id}
					<SrcsetProvider src={backgroundImageUrl} cardType={modalType} let:sizes let:srcset>
						<img
							class="w-full h-full absolute left-0 top-0 transform scale-125 blur-xl translate-3d-0"
							{sizes}
							src={generation.selected_output.image_url}
							{srcset}
							alt="Blurred background for: {generation.prompt.text}"
							width={generation.width}
							height={generation.height}
						/>
					</SrcsetProvider>
				{/key}
			{/if}
			<div class="w-full h-full absolute left-0 top-0 bg-c-bg/50" />
			<div
				style={$windowWidth >= lgBreakpoint
					? `width: ${imageContainerWidth}px; height: ${imageContainerHeight}px;`
					: ''}
				class="w-full lg:h-full relative"
			>
				{#if generation.selected_output.image_url.includes('placeholder')}
					<svg
						class="w-full h-auto text-c-bg-secondary"
						width={generation.width}
						height={generation.height}
						viewBox="0 0 {generation.width} {generation.height}"
						fill="none"
						xmlns="http://www.w3.org/2000/svg"
					>
						<rect width={generation.width} height={generation.height} fill="currentColor" />
					</svg>
					<div class="w-full h-full absolute left-0 top-0 p-5 flex items-center justify-center">
						<IconNoImage class="w-16 h-16 text-c-on-bg/40" />
					</div>
				{:else}
					{#key selectedOutputId}
						<GenerationFullScreenImageSet
							prompt={generation.prompt.text}
							{backgroundImageUrl}
							backgroundImageWidth={generation.width}
							backgroundImageHeight={generation.height}
							imageUrl={currentImageUrl}
							imageWidth={upscaledTabValue === 'upscaled' &&
							upscaledImageWidth &&
							generation.selected_output.upscaled_image_url
								? upscaledImageWidth
								: generation.width}
							imageHeight={upscaledTabValue === 'upscaled' &&
							upscaledImageHeight &&
							generation.selected_output.upscaled_image_url
								? upscaledImageHeight
								: generation.height}
							cardType={modalType}
						/>
					{/key}
					{#if $upscales && $upscales.length > 0 && upscaleFromStore?.status === 'failed'}
						<div
							transition:fly={{ duration: 200, easing: quadOut, y: -50 }}
							class="w-full absolute left-0 top-0 flex items-center justify-center p-3 pointer-events-none"
						>
							<p
								class="text-center font-medium text-xs md:text-sm shadow-lg shadow-c-shadow/[var(--o-shadow-stronger)] bg-c-bg-secondary px-4 py-3 rounded-xl"
							>
								{upscaleFromStore?.error ?? $LL.Error.SomethingWentWrong()}
							</p>
						</div>
					{/if}
					{#if upscaleFromStore?.animation}
						<UpscaleAnimation
							animation={upscaleFromStore.animation}
							isProcessing={upscaleBeingProcessed}
						/>
						<QueuePosition
							position={debouncedPositionInQueue !== undefined ? debouncedPositionInQueue : 0}
							show={debouncedPositionInQueue !== undefined &&
								(!($userSummary?.product_id || $userSummary?.has_nonfree_credits) ||
									isSuperAdmin($userSummary?.roles))}
							hasBg
						/>
					{/if}
				{/if}
				{#if modalType === 'admin-gallery'}
					<button
						on:click={onSelect}
						class="absolute right-2 top-2 p-1 bg-c-bg-secondary rounded-full group
							before:w-full before:h-full
							before:min-w-[56px] before:min-h-[56px]
							before:absolute before:-top-2 before:-right-2 z-20"
					>
						<ButtonHoverEffect noPadding fullRounding color="primary-strong" />
						<div class="w-6 h-6 border-3 rounded-full p-0.75 transition border-c-primary">
							<div
								class="w-full h-full rounded-full bg-c-primary transition {$adminGallerySelectedOutputIds.includes(
									generation.selected_output.id
								)
									? 'scale-100 opacity-100'
									: 'scale-0 opacity-0'}"
							/>
						</div>
					</button>
				{/if}
			</div>
			<div class="w-full h-full overflow-hidden z-0 absolute left-0 top-0 pointer-events-none">
				{#if onLeftButtonClicked || onRightButtonClicked}
					<SideButton
						name="Go Left"
						hasAnimation={false}
						iconClass="w-6 h-6"
						class="flex md:hidden absolute w-1/6 left-0 top-1/2 transform -translate-y-1/2 h-full pointer-events-auto"
						wrapperClass="w-full h-full relative flex items-center rounded-xl justify-start pl-1.5"
						side="left"
						bind:element={buttonLeftMobile}
						onClick={onLeftButtonClicked}
					/>
					<SideButton
						name="Go Right"
						hasAnimation={false}
						iconClass="w-6 h-6"
						class="flex md:hidden absolute w-1/6 right-0 top-1/2 transform -translate-y-1/2 h-full pointer-events-auto"
						wrapperClass="w-full h-full relative flex items-center rounded-xl justify-end pr-1.5"
						side="right"
						bind:element={buttonRightMobile}
						onClick={onRightButtonClicked}
					/>
				{/if}
				{#if (modalType === 'history' && $userGalleryCurrentView !== 'likes') || modalType === 'generate'}
					<div class="absolute right-1.5 top-1.5 pointer-events-auto z-10">
						<FavoriteButton {generation} {modalType} />
					</div>
				{/if}
			</div>
		</div>
		<!-- Right side of the panel -->
		<div
			style={$windowWidth >= lgBreakpoint
				? `width: ${sidebarWidth}px; height: ${imageContainerHeight}px; min-height: ${modalMinHeight}px;`
				: ``}
			class="w-full shadow-generation-sidebar shadow-c-shadow/[var(--o-shadow-stronger)] flex
				flex-col items-start justify-start bg-c-bg-secondary lg:border-l-2 border-c-bg-tertiary relative"
		>
			<ScrollAreaWithChevron bind:scrollContainer={sidebarScrollContainer}>
				<div class="w-full flex flex-col items-start justify-start">
					<div class="w-full flex flex-col gap-4 md:gap-5 px-5 py-4 md:px-7 md:py-5">
						{#if (modalType === 'generate' || (modalType === 'history' && $userGalleryCurrentView !== 'likes')) && !generation.selected_output.image_url.includes('placeholder')}
							<div class="w-full pt-1.5">
								{#if !generation.selected_output.upscaled_image_url || upscaleBeingProcessed}
									<div class="w-full relative">
										<Button
											onClick={onUpscaleClicked}
											loading={upscaleBeingProcessed}
											waiting={!upscaleBeingProcessed && $maxOngoingUpscalesCountReached}
											disabled={doesntHaveEnoughCredits}
											fadeOnDisabled={doesntHaveEnoughCredits}
											withSpinner
											class="w-full"
											size="sm"
										>
											<div class="flex items-center gap-2">
												<IconUpscale class="w-5 h-5" />
												<p>{$LL.GenerationFullscreen.UpscaleButton()}</p>
											</div>
										</Button>
										{#if doesntHaveEnoughCredits && !upscaleBeingProcessed && $userSummary && $page.data.session?.user.id}
											<InsufficientCreditsBadge
												neededCredits={upscaleCreditCost}
												remainingCredits={$userSummary.total_remaining_credits}
											/>
										{/if}
									</div>
								{:else}
									<TabBar
										bind:value={upscaledTabValue}
										fontWeight={600}
										tabs={upscaledOrDefaultTabs}
										hasTitle={false}
										dontScale={true}
										name="Upscaled or Default Image"
									/>
								{/if}
							</div>
						{/if}
						<div class="w-full flex justify-start items-center mt-1">
							<UsernameButton username={generation.user.username} email={generation.user.email} />
						</div>
						<!-- Prompt and Negative Prompt -->
						<div class="w-full break-words flex flex-col items-start gap-3">
							{#if generation.selected_output.created_at !== undefined || generation.created_at !== undefined}
								<p class="text-sm text-c-on-bg/75 -mb-1.5">
									{getRelativeDate({
										date: generation.selected_output.created_at || generation.created_at,
										locale: $locale,
										now
									})}
								</p>
							{/if}
							<p class="w-full leading-normal">{generation.prompt.text}</p>
							{#if generation.negative_prompt}
								{#key generation.id}
									<NegativePromptSection negativePrompt={generation.negative_prompt.text} />
								{/key}
							{/if}
						</div>
						{#key generation.selected_output.id}
							<ButtonsSection
								{generation}
								{generateSimilarUrl}
								{exploreSimilarUrl}
								{linkUrl}
								{currentImageUrl}
								{setSearchQuery}
								{modalType}
								{onLikesChanged}
								{setButtonObjectWithState}
								bind:shareButtonPortalBarrier
								bind:shareButtonPortalContent
								bind:buttonObjectsWithState
							/>
						{/key}
					</div>
					{#if modalType === 'generate' || modalType === 'history' || modalType === 'stage' || (modalType === 'user-profile' && $userSummary?.username === generation.user.username)}
						<Divider />
						{#key generation.selected_output.id}
							<ShowOnProfileSection {generation} {modalType} />
						{/key}
					{/if}
					<Divider />
					<ParamsSection
						class="flex flex-col px-5 py-4 md:px-7 md:py-5 lg:pb-8 gap-6"
						currentImageWidth={upscaledTabValue === 'upscaled' && upscaledImageWidth
							? upscaledImageWidth
							: generation.width}
						currentImageHeight={upscaledTabValue === 'upscaled' && upscaledImageHeight
							? upscaledImageHeight
							: generation.height}
						{generation}
						{setButtonObjectWithState}
						bind:buttonObjectsWithState
						{modalType}
					/>
					{#if modalType === 'gallery' || modalType === 'user-profile'}
						<SimilarOutputsSection
							{modalType}
							{generation}
							afterClick={() => {
								sidebarScrollContainer?.scrollTo({
									left: 0,
									top: 0
								});
								modalScrollContainer?.scrollTo({
									left: 0,
									top: 0
								});
							}}
						/>
					{/if}
				</div>
			</ScrollAreaWithChevron>
		</div>
	</Container>
	{#if onLeftButtonClicked || onRightButtonClicked}
		<SideButton
			name="Go Left"
			class="hidden md:flex absolute left-0 top-1/2 transform -translate-y-1/2 w-20 h-56"
			side="left"
			bind:element={buttonLeft}
			onClick={onLeftButtonClicked}
			count={modalType === 'admin-gallery' &&
			outputIndex !== undefined &&
			outputsLength !== undefined
				? outputIndex
				: undefined}
		/>
		<SideButton
			name="Go Right"
			class="hidden md:flex absolute right-0 top-1/2 transform -translate-y-1/2 w-20 h-56"
			side="right"
			bind:element={buttonRight}
			onClick={onRightButtonClicked}
			count={modalType === 'admin-gallery' &&
			outputIndex !== undefined &&
			outputsLength !== undefined
				? outputsLength - (outputIndex + 1)
				: undefined}
		/>
	{/if}
</ModalWrapper>
