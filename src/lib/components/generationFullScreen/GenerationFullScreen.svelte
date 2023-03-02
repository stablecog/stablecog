<script lang="ts">
	import IconChatBubbleCancel from '$components/icons/IconChatBubbleCancel.svelte';
	import ModalWrapper from '$components/ModalWrapper.svelte';
	import { windowWidth } from '$ts/stores/window';
	import IconButton from '$components/buttons/IconButton.svelte';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import { onMount, tick } from 'svelte';
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
	import { lastUpscaleDurationSec } from '$ts/stores/lastUpscaleDurationSec';
	import { estimatedDurationBufferRatio } from '$ts/constants/main';
	import { mLogUpscale, mLogUpscalePropsFromUpscale, uLogUpscale } from '$ts/helpers/loggers';
	import LL, { locale } from '$i18n/i18n-svelte';
	import { negativePromptTooltipAlt } from '$ts/constants/tooltips';
	import { advancedModeApp } from '$ts/stores/advancedMode';
	import IconCancel from '$components/icons/IconCancel.svelte';
	import Container from '$components/generationFullScreen/Container.svelte';
	import { activeGeneration, type TGenerationWithSelectedOutput } from '$userStores/generation';
	import { sseId } from '$userStores/sse';
	import {
		queueInitialUpscaleRequest,
		upscales,
		type TInitialUpscaleRequest,
		type TUpscale,
		type TUpscaleStatus
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

	export let generation: TGenerationWithSelectedOutput;
	export let modalType: TGenerationFullScreenModalType;

	let hadUpscaledImageUrlOnMount = generation.selected_output.upscaled_image_url !== undefined;

	$: currentImageUrl = generation.selected_output.upscaled_image_url
		? generation.selected_output.upscaled_image_url
		: generation.selected_output.image_url;

	let upscaledImageWidth: number | undefined;
	let upscaledImageHeight: number | undefined;
	$: generation, onGenerationChanged();

	let lastUpscaleStatus: TUpscaleStatus | undefined = hadUpscaledImageUrlOnMount
		? 'succeeded'
		: undefined;
	$: lastUpscaleMatching = getIsLastUpscaleMatching(generation, $upscales);
	$: lastUpscaleStatus = hadUpscaledImageUrlOnMount
		? 'succeeded'
		: $upscales.length > 0 && lastUpscaleMatching
		? $upscales[0].status
		: undefined;
	$: lastUpscaleQueuedAt =
		$upscales.length > 0 && lastUpscaleMatching ? $upscales[0].created_at : undefined;
	$: lastUpscaleBeingProcessed = hadUpscaledImageUrlOnMount
		? false
		: lastUpscaleMatching &&
		  (lastUpscaleStatus === 'to-be-submitted' ||
				lastUpscaleStatus === 'server-received' ||
				lastUpscaleStatus === 'server-processing' ||
				(lastUpscaleMatching && lastUpscaleStatus === 'succeeded' && !isUpscaledImageLoaded));
	$: canClose = !lastUpscaleBeingProcessed;

	let sidebarWrapper: HTMLDivElement;
	let sidebarWrapperHeight: number;
	let sidebarWrapperScrollHeight: number;
	let sidebarWrapperScrollTop: number;
	let sidebarInnerContainerHeight: number;

	let generateSimilarUrl: string;
	let regenerateUrl: string;
	let linkUrl: string;

	const onGenerationChanged = () => {
		currentImageUrl =
			generation.selected_output.upscaled_image_url ?? generation.selected_output.image_url;
		if (generation.selected_output.upscaled_image_url) upscaledTabValue = 'upscaled';
		upscaledImageWidth = undefined;
		upscaledImageHeight = undefined;

		const { seed, selected_output, ...rest } = generation;
		generateSimilarUrl = getGenerationUrlFromParams(rest);
		regenerateUrl = getGenerationUrlFromParams({
			...rest,
			seed
		});
		linkUrl = `${$page.url.origin}/gallery?generation=${generation.id}`;
	};

	const getIsLastUpscaleMatching = (
		generation: TGenerationWithSelectedOutput,
		upscales: TUpscale[]
	) => {
		if (!upscales || upscales.length === 0) return true;
		const upscale = upscales[0];
		const outputs = upscale.outputs;
		if (!outputs || outputs.length === 0) return true;
		const output = outputs[0];
		if (upscale.status === 'succeeded' && output.output_id !== generation.selected_output.id) {
			return false;
		}
		return true;
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
		sidebarWrapperScrollTop = sidebarWrapper.scrollTop;
		sidebarWrapperScrollHeight = sidebarWrapper.scrollHeight;
	};

	$: estimatedUpscaleDurationSec = $lastUpscaleDurationSec * (1 + estimatedDurationBufferRatio);

	async function onUpscaleClicked() {
		if (!$sseId) {
			console.log('No SSE ID, cannot upscale');
			return;
		}
		const initialRequestProps: TInitialUpscaleRequest = {
			input: generation.selected_output.id,
			model_id: upscaleModelIdDefault,
			type: 'from_output',
			created_at: Date.now(),
			stream_id: $sseId,
			ui_id: generateSSEId()
		};
		uLogUpscale('Started');
		mLogUpscale(
			'Started',
			mLogUpscalePropsFromUpscale({
				upscale: initialRequestProps,
				advancedModeApp: $advancedModeApp,
				locale: $locale,
				plan: $page.data.plan
			})
		);
		queueInitialUpscaleRequest(initialRequestProps);
		console.log('Upscale request queued', $upscales);
	}

	$: [lastUpscaleStatus, lastUpscaleBeingProcessed], onLastUpscaleStatusChanged();

	let lastUpscaleAnimationStatus: 'idle' | 'should-animate' | 'should-complete' = 'idle';

	async function onLastUpscaleStatusChanged() {
		if (hadUpscaledImageUrlOnMount) return;
		if (
			lastUpscaleStatus === 'server-received' ||
			lastUpscaleStatus === 'server-processing' ||
			(lastUpscaleStatus === 'succeeded' && lastUpscaleBeingProcessed)
		) {
			return;
		} else if (lastUpscaleStatus === 'failed') {
			lastUpscaleAnimationStatus = 'should-complete';
		} else if (lastUpscaleStatus === 'succeeded') {
			lastUpscaleAnimationStatus = 'should-complete';
		}
		if (lastUpscaleStatus === 'to-be-submitted') {
			lastUpscaleAnimationStatus = 'idle';
			await tick();
			setTimeout(() => {
				lastUpscaleAnimationStatus = 'should-animate';
			});
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

	let upscaledTabValue: TUpscaleTabValue = 'upscaled';
	let isUpscaledImageLoaded = false;
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

	const onImageLoad = (e: Event) => {
		const target = e.target as HTMLImageElement;
		if (generation.width !== target.naturalWidth) {
			upscaledImageWidth = target.naturalWidth;
			isUpscaledImageLoaded = true;
		}
		if (generation.height !== target.naturalHeight) {
			upscaledImageHeight = target.naturalHeight;
			isUpscaledImageLoaded = true;
		}
	};

	onMount(() => {
		setSidebarWrapperVars();
	});
</script>

<ModalWrapper hasPadding={false}>
	<div class="w-full flex items-center justify-start md:hidden pt-2 px-2">
		<div>
			<IconButton
				name="Close"
				onClick={() => {
					if (canClose) {
						if ($activeGeneration !== undefined) {
							activeGeneration.set(undefined);
						}
					}
				}}
			>
				<IconCancel
					class="w-9 h-9 transition {!$isTouchscreen ? 'group-hover:text-c-primary' : ''}"
				/>
			</IconButton>
		</div>
	</div>
	<Container
		{generation}
		{canClose}
		let:imageContainerWidth
		let:imageContainerHeight
		let:modalMinHeight
	>
		<div class="relative self-stretch flex items-center">
			<img
				class="w-full h-full absolute left-0 top-0 transform scale-125 blur-xl"
				src={generation.selected_output.image_url}
				alt="Blurred background for: {generation.prompt.text}"
				width={generation.width}
				height={generation.height}
			/>
			<div class="w-full h-full absolute left-0 top-0 bg-c-bg/50" />
			<div
				style={$windowWidth >= lgBreakpoint
					? `width: ${imageContainerWidth}px; height: ${imageContainerHeight}px;`
					: ''}
				class="w-full lg:h-full relative"
			>
				<img
					style="transition: filter 0.5s cubic-bezier(0.4, 0, 0.2, 1);"
					class="{lastUpscaleBeingProcessed
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
					class="{lastUpscaleBeingProcessed
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
				{#if $upscales && $upscales.length > 0 && $upscales[0].status === 'failed'}
					<div
						transition:fly={{ duration: 200, easing: quadOut, y: -50 }}
						class="w-full absolute left-0 top-0 flex items-center justify-center p-3"
					>
						<p
							class="text-center font-medium text-xs md:text-sm shadow-lg shadow-c-shadow/[var(--o-shadow-stronger)] bg-c-bg-secondary px-4 py-3 rounded-xl"
						>
							{$upscales[0].error ?? $LL.Error.SomethingWentWrong()}
						</p>
					</div>
				{/if}
			</div>
			<div class="w-full h-full overflow-hidden z-0 absolute left-0 top-0 pointer-events-none">
				<div
					style="transition-duration: {lastUpscaleAnimationStatus === 'should-animate'
						? estimatedUpscaleDurationSec
						: lastUpscaleAnimationStatus === 'should-complete'
						? 0.3
						: 0}s"
					class="w-[110%] h-full ease-image-generation transition bg-c-secondary/50 
						absolute left-0 top-0 rounded-xl {lastUpscaleAnimationStatus === 'should-animate'
						? '-translate-x-[5%]'
						: lastUpscaleAnimationStatus === 'should-complete'
						? 'translate-x-full'
						: '-translate-x-full'}"
				/>
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
						{#if modalType === 'generate' || modalType === 'history'}
							<div class="w-full pt-1.5">
								{#if !generation.selected_output.upscaled_image_url || lastUpscaleBeingProcessed}
									<div class="w-fulll relative">
										<Button
											onClick={onUpscaleClicked}
											loading={lastUpscaleBeingProcessed}
											withSpinner
											class="w-full"
											size="sm"
										>
											<div class="flex items-center gap-2">
												<IconUpscale class="w-5 h-5" />
												<p>{$LL.GenerationFullscreen.UpscaleButton()}</p>
											</div>
										</Button>
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
							{regenerateUrl}
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
