<script lang="ts">
	import IconChatBubbleCancel from '$components/icons/IconChatBubbleCancel.svelte';
	import ModalWrapper from '$components/ModalWrapper.svelte';
	import { windowWidth } from '$ts/stores/window';
	import IconButton from '$components/buttons/IconButton.svelte';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import { onDestroy, onMount, tick } from 'svelte';
	import { quadOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';
	import { tooltip } from '$ts/actions/tooltip';
	import { getGenerationUrlFromParams } from '$ts/helpers/getGenerationUrlFromParams';
	import { page } from '$app/stores';
	import { lgBreakpoint, sidebarWidth } from '$components/generationFullScreen/constants';
	import ParamsSection from '$components/generationFullScreen/ParamsSection.svelte';
	import Button from '$components/buttons/Button.svelte';
	import IconUpscale from '$components/icons/IconUpscale.svelte';
	import TabBar from '$components/tabBars/TabBar.svelte';
	import { uLogUpscale } from '$ts/helpers/loggers';
	import LL from '$i18n/i18n-svelte';
	import { negativePromptTooltipAlt } from '$ts/constants/tooltips';
	import IconCancel from '$components/icons/IconCancel.svelte';
	import Container from '$components/generationFullScreen/Container.svelte';
	import { activeGeneration, type TGenerationWithSelectedOutput } from '$userStores/generation';
	import { sseId } from '$userStores/sse';
	import {
		queueInitialUpscaleRequest,
		upscales,
		type TInitialUpscaleRequest
	} from '$ts/stores/user/upscale';
	import { upscaleModelIdDefault } from '$ts/constants/upscaleModels';
	import { generateSSEId } from '$ts/helpers/generateSSEId';
	import ButtonsSection from '$components/generationFullScreen/ButtonsSection.svelte';
	import SidebarChevron from '$components/generationFullScreen/SidebarChevron.svelte';
	import type {
		TButtonObjectsWithState,
		TGenerationFullScreenModalType,
		TSetButtonObjectWithState
	} from '$components/generationFullScreen/types';
	import Divider from '$components/generationFullScreen/Divider.svelte';
	import { userSummary } from '$ts/stores/user/summary';
	import { estimatedUpscaleDurationMs, getUpscaleDurationMsFromUpscale } from '$ts/stores/cost';
	import InsufficientCreditsBadge from '$components/badges/InsufficientCreditsBadge.svelte';
	import IconNoImage from '$components/icons/IconNoImage.svelte';
	import { lastClickedOutputId } from '$ts/stores/lastClickedOutputId';
	import FavoriteButton from '$components/buttons/FavoriteButton.svelte';
	import { browser } from '$app/environment';

	export let generation: TGenerationWithSelectedOutput;
	export let modalType: TGenerationFullScreenModalType;

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

	let hadUpscaledImageUrlOnMount =
		generation.selected_output.upscaled_image_url !== undefined ||
		upscaledImageUrlFromStore !== undefined;
	let isUpscaledImageLoaded = hadUpscaledImageUrlOnMount ? true : false;

	$: currentImageUrl = generation.selected_output.upscaled_image_url
		? generation.selected_output.upscaled_image_url
		: generation.selected_output.image_url;

	let upscaledImageWidth: number | undefined;
	let upscaledImageHeight: number | undefined;

	$: generation, onGenerationChanged();
	let initialGenerationChange = true;
	$: upscaleStatus = hadUpscaledImageUrlOnMount
		? 'succeeded'
		: upscaleFromStore
		? upscaleFromStore.status
		: undefined;
	$: upscaleBeingProcessed = hadUpscaledImageUrlOnMount
		? false
		: upscaleStatus === 'to-be-submitted' ||
		  upscaleStatus === 'server-received' ||
		  upscaleStatus === 'server-processing' ||
		  (upscaleStatus === 'succeeded' && !isUpscaledImageLoaded);

	let sidebarWrapper: HTMLDivElement;
	let sidebarWrapperHeight: number;
	let sidebarWrapperScrollHeight: number;
	let sidebarWrapperScrollTop: number;
	let sidebarInnerContainerHeight: number;

	let generateSimilarUrl: string;
	let linkUrl: string;

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
		$userSummary && $userSummary.total_remaining_credits < upscaleCreditCost;

	const onGenerationChanged = () => {
		setUpscaleFromStore();
		currentImageUrl =
			generation.selected_output.upscaled_image_url ?? generation.selected_output.image_url;
		if (generation.selected_output.upscaled_image_url) upscaledTabValue = 'upscaled';
		upscaledImageWidth = undefined;
		upscaledImageHeight = undefined;
		const { seed, selected_output, ...rest } = generation;
		generateSimilarUrl = getGenerationUrlFromParams(rest);
		linkUrl = `${$page.url.origin}/gallery?output=${generation.id}`;
		if (browser && window && !initialGenerationChange) {
			const searchParams = new URLSearchParams(window.location.search);
			searchParams.set('output', generation.selected_output.id);
			const params = searchParams.toString();
			window.history.replaceState({}, '', `${window.location.pathname}?${params}`);
		}
		initialGenerationChange = false;
	};

	let buttonObjectsWithState: TButtonObjectsWithState = {
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

	const setSidebarWrapperVars = () => {
		if (!sidebarWrapper) return;
		sidebarWrapperScrollTop = sidebarWrapper.scrollTop;
		sidebarWrapperScrollHeight = sidebarWrapper.scrollHeight;
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
		uLogUpscale('Started');
		queueInitialUpscaleRequest(initialRequestProps);
		console.log('Upscale request queued', $upscales);
	}

	$: [upscaleStatus, upscaleBeingProcessed], onUpscaleStatusChanged();

	let upscaleAnimationStatus:
		| 'idle'
		| 'should-animate-slow'
		| 'should-animate'
		| 'should-complete' = 'idle';

	async function onUpscaleStatusChanged() {
		if (hadUpscaledImageUrlOnMount) {
			upscaleAnimationStatus = 'idle';
			return;
		}
		switch (upscaleStatus) {
			case 'to-be-submitted':
				upscaleAnimationStatus = 'idle';
				await tick();
				upscaleAnimationStatus = 'should-animate-slow';
				break;
			case 'server-received':
				await tick();
				upscaleAnimationStatus = 'should-animate-slow';
				break;
			case 'server-processing':
				await tick();
				upscaleAnimationStatus = 'should-animate';
				break;
			case 'succeeded':
				if (upscaleBeingProcessed || !upscaleFromStore) break;
				await tick();
				upscaleAnimationStatus = 'should-complete';
				const durationMs = getUpscaleDurationMsFromUpscale(upscaleFromStore);
				if (durationMs !== null && upscaleFromStore.completed_at) {
					const loadTimeMs = Date.now() - upscaleFromStore.completed_at;
					estimatedUpscaleDurationMs.set(loadTimeMs + durationMs);
				}
				break;
			case 'failed':
				await tick();
				upscaleAnimationStatus = 'should-complete';
				break;
			default:
				upscaleAnimationStatus = 'idle';
				break;
		}
	}

	$: upscaledTabValue, setCurrentImageUrl();

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

	const onImageLoad = (e: Event) => {
		const target = e.target as HTMLImageElement;
		if (generation.width !== target.naturalWidth && generation.selected_output.upscaled_image_url) {
			upscaledImageWidth = target.naturalWidth;
			isUpscaledImageLoaded = true;
		}
		if (
			generation.height !== target.naturalHeight &&
			generation.selected_output.upscaled_image_url
		) {
			upscaledImageHeight = target.naturalHeight;
			isUpscaledImageLoaded = true;
		}
	};

	onMount(() => {
		setSidebarWrapperVars();
		lastClickedOutputId.set(undefined);
	});

	const onPopState: svelte.JSX.EventHandler<PopStateEvent, Window> | null | undefined = (e) => {
		const searchParams = new URLSearchParams(e.currentTarget.location.search);
		const hasOutputParam = searchParams.has('output');
		if (!hasOutputParam) {
			activeGeneration.set(undefined);
		}
	};

	onDestroy(() => {
		const searchParams = new URLSearchParams(window.location.search);
		if (searchParams.has('output')) {
			searchParams.delete('output');
			const newSearch = searchParams.toString();
			window.history.pushState({}, '', `${$page.url.pathname}${newSearch ? `?${newSearch}` : ''}`);
		}
	});
</script>

<svelte:window on:popstate={onPopState} />

<ModalWrapper hasPadding={false} let:scrollY>
	<div class="w-full sticky z-20 top-0 flex items-center justify-start md:hidden pt-1 pb-1 px-1">
		<div
			class="flex items-center justify-center transition duration-150 rounded-full {scrollY &&
			scrollY > 5
				? 'bg-c-bg-secondary/75'
				: 'bg-c-bg-secondary/0'}"
		>
			<IconButton
				name="Close"
				onClick={() => {
					console.log('Close clicked');
					console.log($activeGeneration);
					if ($activeGeneration !== undefined) {
						activeGeneration.set(undefined);
					}
				}}
			>
				<IconCancel
					class="w-9 h-9 transition {!$isTouchscreen
						? 'group-hover/iconbutton:text-c-primary'
						: ''}"
				/>
			</IconButton>
		</div>
	</div>
	<Container {generation} let:imageContainerWidth let:imageContainerHeight let:modalMinHeight>
		<div class="relative self-stretch flex items-center">
			{#if generation.selected_output.image_url}
				{#key generation.selected_output.id}
					<img
						class="w-full h-full absolute left-0 top-0 transform scale-125 blur-xl"
						src={generation.selected_output.image_url}
						alt="Blurred background for: {generation.prompt.text}"
						width={generation.width}
						height={generation.height}
					/>
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
					{#key generation.selected_output.id}
						<img
							style="transition: filter 0.5s cubic-bezier(0.4, 0, 0.2, 1);"
							class="{upscaleBeingProcessed
								? 'blur-2xl'
								: ''} w-full transition h-auto lg:h-full lg:object-contain absolute lg:left-0 lg:top-0"
							src={generation.selected_output.image_url}
							alt="Blurred background 2 for: {generation.prompt.text}"
							width={generation.width}
							height={generation.height}
						/>
						<img
							on:load={onImageLoad}
							style="transition: filter 0.5s cubic-bezier(0.4, 0, 0.2, 1);"
							class="{upscaleBeingProcessed
								? 'blur-2xl'
								: ''} filter w-full relative transition h-auto lg:h-full lg:object-contain lg:absolute lg:left-0 lg:top-0"
							src={currentImageUrl}
							alt={generation.prompt.text}
							width={upscaledTabValue === 'upscaled' && upscaledImageWidth
								? upscaledImageWidth
								: generation.width}
							height={upscaledTabValue === 'upscaled' && upscaledImageHeight
								? upscaledImageHeight
								: generation.height}
						/>
					{/key}
					{#if $upscales && $upscales.length > 0 && upscaleFromStore?.status === 'failed'}
						<div
							transition:fly|local={{ duration: 200, easing: quadOut, y: -50 }}
							class="w-full absolute left-0 top-0 flex items-center justify-center p-3"
						>
							<p
								class="text-center font-medium text-xs md:text-sm shadow-lg shadow-c-shadow/[var(--o-shadow-stronger)] bg-c-bg-secondary px-4 py-3 rounded-xl"
							>
								{upscaleFromStore?.error ?? $LL.Error.SomethingWentWrong()}
							</p>
						</div>
					{/if}
				{/if}
			</div>
			<div class="w-full h-full overflow-hidden z-0 absolute left-0 top-0 pointer-events-none">
				<div
					style="transition-duration: {upscaleAnimationStatus === 'should-animate-slow'
						? ($estimatedUpscaleDurationMs / 1000) * 3
						: upscaleAnimationStatus === 'should-animate'
						? $estimatedUpscaleDurationMs / 1000
						: upscaleAnimationStatus === 'should-complete'
						? 0.3
						: 0}s"
					class="w-[110%] h-full ease-image-generation transition bg-c-secondary/50 
						absolute left-0 top-0 rounded-xl {upscaleAnimationStatus === 'should-animate-slow'
						? '-translate-x-2/4'
						: upscaleAnimationStatus === 'should-animate'
						? '-translate-x-[5%]'
						: upscaleAnimationStatus === 'should-complete'
						? 'translate-x-full'
						: '-translate-x-full'}"
				/>
				{#if modalType === 'history' || modalType === 'generate'}
					<div class="absolute right-1.5 top-1.5">
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
			<div
				on:scroll={setSidebarWrapperVars}
				bind:this={sidebarWrapper}
				bind:clientHeight={sidebarWrapperHeight}
				class="w-full overflow-auto lg-list-fade relative"
			>
				<div
					bind:clientHeight={sidebarInnerContainerHeight}
					class="w-full flex flex-col items-start justify-start"
				>
					<div class="w-full flex flex-col gap-4 md:gap-5 px-5 py-4 md:px-7 md:py-5">
						{#if (modalType === 'generate' || modalType === 'history') && !generation.selected_output.image_url.includes('placeholder')}
							<div class="w-full pt-1.5">
								{#if !generation.selected_output.upscaled_image_url || upscaleBeingProcessed}
									<div class="w-full relative">
										<Button
											onClick={onUpscaleClicked}
											loading={upscaleBeingProcessed}
											disabled={doesntHaveEnoughCredits &&
												$page.data.session?.user.id !== undefined}
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
										tabs={upscaledOrDefaultTabs}
										hasTitle={false}
										dontScale={true}
										name="Upscaled or Default Image"
									/>
								{/if}
							</div>
						{/if}
						<!-- Prompt and Negative Prompt -->
						<div class="flex flex-col items-start gap-3">
							<p class="max-w-full text-sm leading-normal">{generation.prompt.text}</p>
							{#if generation.negative_prompt}
								<div class="max-w-full flex items-start text-c-danger gap-2">
									<div use:tooltip={$negativePromptTooltipAlt}>
										<IconChatBubbleCancel class="w-5 h-5" />
									</div>
									<p class="flex-shrink min-w-0 text-sm leading-normal -mt-0.75">
										{generation.negative_prompt.text}
									</p>
								</div>
							{/if}
						</div>
						<ButtonsSection
							{generation}
							{generateSimilarUrl}
							{linkUrl}
							{currentImageUrl}
							{modalType}
							{setButtonObjectWithState}
							bind:buttonObjectsWithState
						/>
					</div>
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
				</div>
			</div>
			<SidebarChevron
				bind:sidebarInnerContainerHeight
				bind:sidebarWrapper
				bind:sidebarWrapperHeight
				bind:sidebarWrapperScrollHeight
				bind:sidebarWrapperScrollTop
			/>
		</div>
	</Container>
</ModalWrapper>
