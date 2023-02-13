<script lang="ts">
	import SubtleButton from '$components/buttons/SubtleButton.svelte';
	import IconChatBubbleCancel from '$components/icons/IconChatBubbleCancel.svelte';
	import IconCopy from '$components/icons/IconCopy.svelte';
	import IconDownload from '$components/icons/IconDownload.svelte';
	import IconTick from '$components/icons/IconTick.svelte';
	import ModalWrapper from '$components/ModalWrapper.svelte';
	import Morpher from '$components/Morpher.svelte';
	import { clickoutside } from '$ts/actions/clickoutside';
	import { urlFromBase64 } from '$ts/helpers/base64';
	import { windowWidth } from '$ts/stores/window';
	import type { TGenerationUI, TUpscaleStatus } from '$ts/types/main';
	import { copy } from 'svelte-copy';
	import IconChevronDown from '$components/icons/IconChevronDown.svelte';
	import IconButton from '$components/buttons/IconButton.svelte';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import { onMount, onDestroy, tick } from 'svelte';
	import { quadOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';
	import { tooltip } from '$ts/actions/tooltip';
	import { getGenerationUrlFromParams } from '$ts/helpers/getGenerationUrlFromParams';
	import IconDice from '$components/icons/IconDice.svelte';
	import IconRefresh from '$components/icons/IconRefresh.svelte';
	import { page } from '$app/stores';
	import {
		copyTimeoutDuration,
		lgBreakpoint,
		sidebarWidth
	} from '$components/generationFullScreen/constants';
	import ParamsSection from '$components/generationFullScreen/ParamsSection.svelte';
	import Button from '$components/buttons/Button.svelte';
	import IconUpscale from '$components/icons/IconUpscale.svelte';
	import { upscaleGenerationOutput } from '$ts/queries/upscale';
	import { createEventDispatcher } from 'svelte';
	import TabBar from '$components/tabBars/TabBar.svelte';
	import { lastUpscaleDurationSec } from '$ts/stores/lastUpscaleDurationSec';
	import { estimatedDurationBufferRatio } from '$ts/constants/main';
	import { mLogUpscale, uLogUpscale } from '$ts/helpers/loggers';
	import LL, { locale } from '$i18n/i18n-svelte';
	import { negativePromptTooltipAlt } from '$ts/constants/tooltips';
	import IconTrashcan from '$components/icons/IconTrashcan.svelte';
	import { deleteGenerationFromDb } from '$ts/queries/indexedDb';
	import IconTrashcanFilledOpen from '$components/icons/IconTrashcanFilledOpen.svelte';
	import { advancedModeApp } from '$ts/stores/advancedMode';
	import IconCancel from '$components/icons/IconCancel.svelte';
	import GenerationFullScreenContainer from '$components/generationFullScreen/GenerationFullScreenContainer.svelte';
	import { activeGeneration, type TGeneration } from '$ts/stores/generation';
	import { downloadGenerationImage } from '$ts/helpers/dowloadGenerationImage';

	export let generation: TGeneration;
	export let upscaleStatus: TUpscaleStatus = 'idle';

	$: selectedOutput = generation.outputs[generation.selected_output_index];

	let upscaleErrorText: string | undefined;
	let currentImageUrl: string;
	let upscaledImageWidth: number | undefined;
	let upscaledImageHeight: number | undefined;
	$: generation, onGenerationChanged();

	const dispatchUpscale = createEventDispatcher<{ upscale: { generation: TGenerationUI } }>();
	const dispatchDelete = createEventDispatcher<{ delete: { generation: TGenerationUI } }>();

	$: canClose = upscaleStatus !== 'loading';

	let sidebarWrapperHeight: number;
	let sidebarWrapper: HTMLDivElement;
	let sidebarWrapperScrollHeight: number;
	let sidebarWrapperScrollTop: number;
	let sidebarInnerContainerHeight: number;

	$: showSidebarChevron =
		sidebarInnerContainerHeight !== undefined &&
		sidebarWrapperScrollTop !== undefined &&
		sidebarWrapperScrollHeight !== undefined &&
		sidebarWrapperHeight !== undefined &&
		sidebarWrapperScrollTop + 16 < sidebarWrapperScrollHeight - sidebarWrapperHeight &&
		$windowWidth >= lgBreakpoint;

	let rerollUrl: string;
	let regenerateUrl: string;

	const onGenerationChanged = () => {
		currentImageUrl = selectedOutput.upscaled_image_url ?? selectedOutput.image_url;
		if (selectedOutput.upscaled_image_url) upscaledTabValue = 'upscaled';
		upscaledImageWidth = undefined;
		upscaledImageHeight = undefined;

		const { seed, ...rest } = generation;
		rerollUrl = getGenerationUrlFromParams(rest);
		regenerateUrl = getGenerationUrlFromParams(generation);
	};

	let promptCopiedTimeout: NodeJS.Timeout;
	let promptCopied = false;
	const onPromptCopied = () => {
		promptCopied = true;
		negativePromptCopied = false;
		seedCopied = false;
		clearTimeout(promptCopiedTimeout);
		clearTimeout(negativePromptCopiedTimeout);
		clearTimeout(seedCopiedTimeout);
		promptCopiedTimeout = setTimeout(() => {
			promptCopied = false;
		}, copyTimeoutDuration);
	};

	let negativePromptCopiedTimeout: NodeJS.Timeout;
	let negativePromptCopied = false;
	const onNegativePromptCopied = () => {
		negativePromptCopied = true;
		promptCopied = false;
		seedCopied = false;
		clearTimeout(negativePromptCopiedTimeout);
		clearTimeout(promptCopiedTimeout);
		clearTimeout(seedCopiedTimeout);
		promptCopiedTimeout = setTimeout(() => {
			negativePromptCopied = false;
		}, copyTimeoutDuration);
	};

	let seedCopied = false;
	let seedCopiedTimeout: NodeJS.Timeout;
	const onSeedCopyClicked = () => {
		promptCopied = false;
		negativePromptCopied = false;
		clearTimeout(negativePromptCopiedTimeout);
		clearTimeout(promptCopiedTimeout);
	};

	let imageDownloading = false;
	const onDownloadImageClicked = async () => {
		imageDownloading = true;
		try {
			await downloadGenerationImage({
				url: currentImageUrl,
				guidanceScale: generation.guidance_scale,
				inferenceSteps: generation.inference_steps,
				isUpscaled:
					generation.outputs[generation.selected_output_index].upscaled_image_url !== undefined,
				prompt: generation.prompt,
				seed: generation.seed
			});
		} catch (error) {
			console.log("Couldn't download image", error);
		}
		imageDownloading = false;
	};

	const sidebarWrapperOnScroll = () => {
		sidebarWrapperScrollTop = sidebarWrapper.scrollTop;
		sidebarWrapperScrollHeight = sidebarWrapper.scrollHeight;
	};

	const setSidebarWrapperVars = () => {
		sidebarWrapperScrollTop = sidebarWrapper.scrollTop;
		sidebarWrapperScrollHeight = sidebarWrapper.scrollHeight;
	};

	let upscaleDurationSec = 0;
	let upscaleDurationSecCalcInterval: NodeJS.Timeout;

	$: estimatedUpscaleDurationSec = $lastUpscaleDurationSec * (1 + estimatedDurationBufferRatio);

	async function onUpscaleClicked() {
		const upscaleMinimal = {
			'SC - Width': generation.width,
			'SC - Height': generation.height,
			'SC - Advanced Mode': $advancedModeApp,
			'SC - Locale': $locale,
			'SC - Plan': $page.data.plan
		};
		uLogUpscale('Started');
		mLogUpscale('Started', upscaleMinimal);
		const start = Date.now();
		clearTimeout(upscaleDurationSecCalcInterval);
		upscaleDurationSecCalcInterval = setInterval(() => {
			upscaleDurationSec = (Date.now() - start) / 1000;
		}, 100);
		upscaleStatus = 'idle';
		upscaleErrorText = undefined;
		await tick();
		setTimeout(() => (upscaleStatus = 'loading'));
		try {
			const res = await upscaleGenerationOutput({
				output_id: selectedOutput.id
			});
			if (res.error) {
				throw new Error(res.error);
			}
			if (res.data?.image_b64) {
				uLogUpscale('Succeeded');
				mLogUpscale('Succeeded', { ...upscaleMinimal, 'SC - Duration': res.data.duration_ms });
				const base64 = res.data.image_b64;
				const url = urlFromBase64(base64);
				const { upscaledImageDataB64, upscaledImageUrl, ...rest } = generation;
				dispatchUpscale('upscale', {
					generation: {
						...rest,
						upscaledImageDataB64: base64,
						upscaledImageUrl: url
					}
				});
			} else {
				throw new Error('No image data in response');
			}
		} catch (error) {
			uLogUpscale('Failed');
			mLogUpscale('Failed', upscaleMinimal);
			console.log('Upscale image error:', error);
			upscaleStatus = 'error';
			if ((error as Error).message) {
				upscaleErrorText = (error as Error).message;
			}
		}
		if (upscaleStatus !== 'error') {
			upscaledTabValue = 'upscaled';
			lastUpscaleDurationSec.set(upscaleDurationSec);
			upscaleStatus = 'success';
			upscaleErrorText = undefined;
		}
		clearTimeout(upscaleDurationSecCalcInterval);
	}

	$: upscaledTabValue, setCurrentImageUrl();

	function setCurrentImageUrl() {
		if (upscaledTabValue === 'upscaled' && selectedOutput.upscaled_image_url !== undefined) {
			currentImageUrl = selectedOutput.upscaled_image_url;
		} else {
			currentImageUrl = selectedOutput.image_url;
		}
	}

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

	const onImageLoad = (e: Event) => {
		const target = e.target as HTMLImageElement;
		if (generation.width !== target.naturalWidth) {
			upscaledImageWidth = target.naturalWidth;
		}
		if (generation.height !== target.naturalHeight) {
			upscaledImageHeight = target.naturalHeight;
		}
	};

	let deleteStatus: 'idle' | 'loading' | 'success' | 'should-confirm' = 'idle';

	async function deleteGeneration(id: number | undefined) {
		if (id === undefined) {
			console.log("Can't delete generation, id is undefined");
			return;
		}
		if (deleteStatus === 'idle') {
			deleteStatus = 'should-confirm';
			return;
		}
		try {
			deleteStatus = 'should-confirm';
			await tick();
			setTimeout(() => (deleteStatus = 'loading'));
			await deleteGenerationFromDb(id);
			activeGeneration.set(undefined);
			deleteStatus = 'success';
			setTimeout(() => {
				dispatchDelete('delete', { generation });
			}, 300);
		} catch (error) {
			console.log(error);
			deleteStatus = 'idle';
		}
	}

	onMount(() => {
		setSidebarWrapperVars();
	});

	onDestroy(() => {
		upscaleStatus = 'idle';
	});
</script>

<ModalWrapper hasPadding={false}>
	<div class="w-full flex items-center justify-start md:hidden pt-2 px-2">
		<div transition:fly|local={{ duration: 200, easing: quadOut, opacity: 0, x: -50 }}>
			<IconButton
				name="Close"
				onClick={() => {
					if (canClose) {
						activeGeneration.set(undefined);
					}
				}}
			>
				<IconCancel
					class="w-9 h-9 transition {!$isTouchscreen ? 'group-hover:text-c-primary' : ''}"
				/>
			</IconButton>
		</div>
	</div>
	<GenerationFullScreenContainer
		{generation}
		{canClose}
		let:imageContainerWidth
		let:imageContainerHeight
		let:modalMinHeight
	>
		<div class="relative self-stretch flex items-center">
			<img
				class="w-full h-full absolute left-0 top-0 transform scale-125 blur-xl"
				src={selectedOutput.image_url}
				alt="Blurred background for: {generation.prompt}"
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
					class="{upscaleStatus === 'loading'
						? 'blur-2xl'
						: ''} w-full transition h-auto lg:h-full lg:object-contain absolute lg:left-0 lg:top-0"
					src={selectedOutput.image_url}
					alt="Blurred background 2 for: {generation.prompt}"
					width={generation.width}
					height={generation.height}
				/>
				<img
					on:load={onImageLoad}
					style="transition: filter 0.5s cubic-bezier(0.4, 0, 0.2, 1);"
					class="{upscaleStatus === 'loading'
						? 'blur-2xl'
						: ''} filter w-full relative transition h-auto lg:h-full lg:object-contain lg:absolute lg:left-0 lg:top-0"
					src={currentImageUrl}
					alt={generation.prompt}
					width={upscaledTabValue === 'upscaled' && upscaledImageWidth
						? upscaledImageWidth
						: generation.width}
					height={upscaledTabValue === 'upscaled' && upscaledImageHeight
						? upscaledImageHeight
						: generation.height}
				/>
				{#if upscaleStatus === 'error'}
					<div
						transition:fly={{ duration: 200, easing: quadOut, y: -50 }}
						class="w-full absolute left-0 top-0 flex items-center justify-center p-3"
					>
						<p
							class="text-center font-medium text-xs md:text-sm shadow-lg shadow-c-shadow/[var(--o-shadow-stronger)] bg-c-bg-secondary px-4 py-3 rounded-xl"
						>
							{upscaleErrorText ?? $LL.Error.SomethingWentWrong()}
						</p>
					</div>
				{/if}
			</div>
			<div class="w-full h-full overflow-hidden z-0 absolute left-0 top-0 pointer-events-none">
				<div
					style="transition-duration: {upscaleStatus === 'loading'
						? estimatedUpscaleDurationSec
						: upscaleStatus === 'success' || upscaleStatus === 'error'
						? 0.5
						: 0}s"
					class="w-[110%] h-full ease-image-generation transition bg-c-secondary/50 
						absolute left-0 top-0 rounded-xl {upscaleStatus === 'loading'
						? '-translate-x-[5%]'
						: upscaleStatus === 'success' || upscaleStatus === 'error'
						? 'translate-x-full'
						: '-translate-x-full'}"
				/>
			</div>
		</div>
		<div
			style={$windowWidth >= lgBreakpoint
				? `width: ${sidebarWidth}px; height: ${imageContainerHeight}px; min-height: ${modalMinHeight}px;`
				: ``}
			class="w-full shadow-generation-sidebar shadow-c-shadow/[var(--o-shadow-stronger)] flex 
				flex-col items-start justify-start bg-c-bg-secondary lg:border-l-2 border-c-bg-tertiary relative"
		>
			<div
				on:scroll={sidebarWrapperOnScroll}
				bind:this={sidebarWrapper}
				bind:clientHeight={sidebarWrapperHeight}
				class="w-full overflow-auto lg-list-fade relative"
			>
				<div
					bind:clientHeight={sidebarInnerContainerHeight}
					class="w-full flex flex-col items-start justify-start"
				>
					<div class="w-full flex flex-col gap-4 md:gap-5 px-5 py-4 md:px-7 md:py-5">
						<div class="w-full pt-1.5">
							{#if !selectedOutput.upscaled_image_url}
								<div class="w-fulll relative">
									<Button
										onClick={onUpscaleClicked}
										loading={upscaleStatus === 'loading'}
										class="w-full"
										size="sm"
									>
										<div class="flex items-center gap-2">
											{#if upscaleStatus === 'loading'}
												<p>
													{upscaleDurationSec.toLocaleString('en-US', {
														minimumFractionDigits: 1,
														maximumFractionDigits: 1
													})}
												</p>
											{:else}
												<IconUpscale class="w-5 h-5" />
												<p>{$LL.GenerationFullscreen.UpscaleButton()}</p>
											{/if}
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
						<div class="flex flex-col items-start gap-3">
							<p class="max-w-full text-sm leading-normal">{generation.prompt}</p>
							{#if generation.negative_prompt}
								<div class="max-w-full flex items-start text-c-danger gap-2">
									<div use:tooltip={$negativePromptTooltipAlt}>
										<IconChatBubbleCancel class="w-5 h-5" />
									</div>
									<p class="flex-shrink min-w-0 text-sm leading-normal -mt-0.75">
										{generation.negative_prompt}
									</p>
								</div>
							{/if}
						</div>
						<div class="w-full flex flex-wrap gap-3">
							<SubtleButton
								onClick={onDownloadImageClicked}
								state={imageDownloading ? 'success' : 'idle'}
							>
								<Morpher morphed={imageDownloading}>
									<div slot="item-0" class="flex items-center justify-center gap-1.5">
										<IconDownload class="w-5 h-5 -ml-0.5" />
										<p>{$LL.GenerationFullscreen.DownloadButton()}</p>
									</div>
									<div slot="item-1" class="flex items-center justify-center gap-1.5">
										<IconTick class="w-5 h-5 -ml-0.5 transform scale-110" />
										<p>{$LL.GenerationFullscreen.DoneButtonState()}</p>
									</div>
								</Morpher>
							</SubtleButton>
							{#if $page.url.pathname !== '/'}
								<div class="flex relative">
									<SubtleButton target="_self" prefetch={true} href={rerollUrl}>
										<div class="flex items-center justify-center gap-1.5">
											<IconDice class="w-5 h-5 -ml-0.5" />
											<p>{$LL.GenerationFullscreen.RerollButton()}</p>
										</div>
									</SubtleButton>
								</div>
								<div class="flex relative">
									<SubtleButton target="_self" prefetch={true} href={regenerateUrl}>
										<div class="flex items-center justify-center gap-1.5">
											<IconRefresh class="w-5 h-5 -ml-0.5" />
											<p>{$LL.GenerationFullscreen.RegenerateButton()}</p>
										</div>
									</SubtleButton>
								</div>
							{/if}
							<div use:copy={generation.prompt} on:svelte-copy={onPromptCopied}>
								<SubtleButton state={promptCopied ? 'success' : 'idle'}>
									<Morpher morphed={promptCopied}>
										<div slot="item-0" class="flex items-center justify-center gap-1.5">
											<IconCopy class="w-5 h-5 -ml-0.5" />
											<p>{$LL.GenerationFullscreen.CopyPromptButton()}</p>
										</div>
										<div slot="item-1" class="flex items-center justify-center gap-1.5">
											<IconTick class="w-5 h-5 -ml-0.5 scale-110" />
											<p>{$LL.GenerationFullscreen.CopiedButtonState()}</p>
										</div>
									</Morpher>
								</SubtleButton>
							</div>
							{#if generation.negative_prompt}
								<div use:copy={generation.negative_prompt} on:svelte-copy={onNegativePromptCopied}>
									<SubtleButton state={negativePromptCopied ? 'success' : 'idle'}>
										<Morpher morphed={negativePromptCopied}>
											<div slot="item-0" class="flex items-center justify-center gap-1.5">
												<IconCopy class="w-5 h-5 -ml-0.5" />
												<p>{$LL.GenerationFullscreen.CopyNegativePromptButton()}</p>
											</div>
											<div slot="item-1" class="flex items-center justify-center gap-1.5">
												<IconTick class="w-5 h-5 -ml-0.5 scale-110" />
												<p>{$LL.GenerationFullscreen.CopiedButtonState()}</p>
											</div>
										</Morpher>
									</SubtleButton>
								</div>
							{/if}
							<div
								use:clickoutside={{
									callback: () =>
										deleteStatus === 'should-confirm' ? (deleteStatus = 'idle') : null
								}}
							>
								<SubtleButton
									disabled={deleteStatus === 'loading'}
									onClick={() => deleteGeneration(generation.id)}
								>
									<Morpher morphed={deleteStatus === 'should-confirm'}>
										<div
											slot="item-0"
											class="flex items-center justify-center gap-1.5 text-c-danger"
										>
											<IconTrashcan class="w-5 h-5 -ml-0.5" />
											<p>{$LL.Shared.DeleteButton()}</p>
										</div>
										<div
											slot="item-1"
											class="flex items-center justify-center gap-1.5 text-c-danger"
										>
											<IconTrashcanFilledOpen class="w-5 h-5 -ml-0.5 scale-110" />
										</div>
									</Morpher>
								</SubtleButton>
							</div>
						</div>
					</div>
					<!-- Divider -->
					<div class="w-full pt-1.5 pb-0.5">
						<div class="w-full h-2px bg-c-bg-tertiary rounded-full" />
					</div>
					<!-- Divider -->
					<ParamsSection
						class="flex flex-col px-5 py-4 md:px-7 md:py-5 lg:pb-8 gap-6"
						currentImageWidth={upscaledTabValue === 'upscaled' && upscaledImageWidth
							? upscaledImageWidth
							: generation.width}
						currentImageHeight={upscaledTabValue === 'upscaled' && upscaledImageHeight
							? upscaledImageHeight
							: generation.height}
						{generation}
						bind:seedCopied
						bind:seedCopiedTimeout
						{copyTimeoutDuration}
						{onSeedCopyClicked}
					/>
				</div>
			</div>
			{#if showSidebarChevron}
				<div
					transition:fly|local={{ duration: 200, easing: quadOut, y: 50, opacity: 0 }}
					class="absolute left-1/2 transform -translate-x-1/2 bottom-0 flex justify-center items-end p-1 z-50"
				>
					<IconButton
						name="Scroll to Sidebar Bottom"
						onClick={() => {
							if (sidebarWrapper) {
								sidebarWrapper.scrollTo({
									top: sidebarWrapperScrollHeight - sidebarWrapperHeight,
									behavior: 'smooth'
								});
							}
						}}
					>
						<div class="p-0.5">
							<IconChevronDown
								class="w-7 h-7 text-c-on-bg/25 transition {!$isTouchscreen
									? 'group-hover:text-c-primary'
									: ''}"
							/>
						</div>
					</IconButton>
				</div>
			{/if}
		</div>
	</GenerationFullScreenContainer>
</ModalWrapper>
