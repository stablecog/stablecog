<script lang="ts">
	import SubtleButton from '$components/buttons/SubtleButton.svelte';
	import IconChatBubbleCancel from '$components/icons/IconChatBubbleCancel.svelte';
	import IconCopy from '$components/icons/IconCopy.svelte';
	import IconDownload from '$components/icons/IconDownload.svelte';
	import IconTick from '$components/icons/IconTick.svelte';
	import ModalWrapper from '$components/ModalWrapper.svelte';
	import Morpher from '$components/Morpher.svelte';
	import { clickoutside } from '$ts/actions/clickoutside';
	import { elementreceive, elementsend } from '$ts/animation/transitions';
	import { urlFromBase64 } from '$ts/helpers/base64';
	import { getImageNameFromGeneration } from '$ts/helpers/getImageNameFromGeneration';
	import { activeGeneration } from '$ts/stores/activeGeneration';
	import { windowHeight, windowWidth } from '$ts/stores/window';
	import type { TGenerationUI, TTab, TUpscaleStatus } from '$ts/types/main';
	import { copy } from 'svelte-copy';
	import IconChevronDown from '$components/icons/IconChevronDown.svelte';
	import IconButton from '$components/buttons/IconButton.svelte';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import { onMount } from 'svelte';
	import { quadOut } from 'svelte/easing';
	import { fade, fly } from 'svelte/transition';
	import { tooltip } from '$ts/actions/tooltip';
	import { getGenerationUrlFromParams } from '$ts/helpers/getGenerationUrlFromParams';
	import IconDice from '$components/icons/IconDice.svelte';
	import IconRefresh from '$components/icons/IconRefresh.svelte';
	import { page } from '$app/stores';
	import { tooltipStyleProps } from '$components/generationFullScreen/Shared';
	import ParamsSection from '$components/generationFullScreen/ParamsSection.svelte';
	import Button from '$components/buttons/Button.svelte';
	import IconUpscale from '$components/icons/IconUpscale.svelte';
	import { currentServer } from '$ts/stores/serverHealth';
	import { upscaleImage } from '$ts/queries/upscaleImage';
	import { serverUrl } from '$ts/stores/serverUrl';
	import { createEventDispatcher } from 'svelte';
	import TabBar from '$components/TabBar.svelte';
	import { lastUpscaleDurationSec } from '$ts/stores/lastUpscaleDurationSec';
	import { estimatedDurationBufferRatio } from '$ts/constants/main';

	export let generation: TGenerationUI;
	export let upscaleStatus: TUpscaleStatus = 'idle';

	let currentSrc: string;
	let currentImageDataBase64: string;
	$: generation, onGenerationChanged();

	const dispatch = createEventDispatcher<{ upscale: { generation: TGenerationUI } }>();

	$: canClose = upscaleStatus !== 'loading';

	$: generationAspectRatio = generation.width / generation.height;

	$: maxWidthConstant = generationAspectRatio >= 3 / 2 ? 1440 : 1280;
	const maxHeight = 1024;
	const sidebarWidth = 400;

	const lgBreakpoint = 1024;

	let imageContainerWidth = 0;
	let imageContainerHeight = 0;

	let sidebarWrapperHeight: number;
	let sidebarWrapper: HTMLDivElement;
	let sidebarWrapperScrollHeight: number;
	let sidebarWrapperScrollTop: number;
	let sidebarInnerContainerHeight: number;

	$: showSidebarChevron =
		sidebarWrapperHeight &&
		sidebarInnerContainerHeight &&
		sidebarInnerContainerHeight > sidebarWrapperHeight;

	$: mainContainerWidth = Math.min($windowWidth || 0, maxWidthConstant);
	$: mainContainerHeight = Math.min($windowHeight || 0, maxHeight);

	const padding = 64;
	$: modalMaxWidth = mainContainerWidth - 2 * padding;
	$: modalMaxHeight = mainContainerHeight - 2 * padding;

	$: modalMinHeight = Math.min(modalMaxHeight, 575);

	$: [modalMaxWidth, modalMaxHeight, generation], setImageContainerSize();

	const onGenerationChanged = () => {
		currentImageDataBase64 = generation.upscaledImageDataB64 ?? generation.imageDataB64;
		currentSrc =
			generation.upscaledImageUrl ?? generation.imageUrl ?? urlFromBase64(currentImageDataBase64);
		if (upscaleStatus === 'error') upscaleStatus = 'idle';
	};

	function setImageContainerSize() {
		if ($windowWidth && $windowWidth < lgBreakpoint) {
			imageContainerWidth = modalMaxWidth;
			imageContainerHeight = (modalMaxHeight * generation.width) / generation.height;
		} else {
			if (generation.width >= generation.height) {
				const tempWidth = modalMaxWidth - sidebarWidth;
				const tempHeight = (tempWidth * generation.height) / generation.width;
				if (tempHeight > modalMaxHeight) {
					imageContainerHeight = modalMaxHeight;
					imageContainerWidth = (imageContainerHeight / generation.height) * generation.width;
				} else {
					imageContainerWidth = tempWidth;
					imageContainerHeight = tempHeight;
				}
			} else {
				const tempHeight = modalMaxHeight;
				const tempWidth = (tempHeight * generation.width) / generation.height;
				if (tempWidth > modalMaxWidth - sidebarWidth) {
					imageContainerWidth = modalMaxWidth - sidebarWidth;
					imageContainerHeight = (imageContainerWidth / generation.width) * generation.height;
				} else {
					imageContainerWidth = tempWidth;
					imageContainerHeight = tempHeight;
				}
			}
		}
	}

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
		}, 2000);
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
		}, 2000);
	};

	let seedCopied = false;
	let seedCopiedTimeout: NodeJS.Timeout;
	const onSeedCopyClicked = () => {
		promptCopied = false;
		negativePromptCopied = false;
		clearTimeout(negativePromptCopiedTimeout);
		clearTimeout(promptCopiedTimeout);
	};

	let imageDownloadingTimeout: NodeJS.Timeout;
	let imageDownloading = false;
	const onDownloadImageClicked = () => {
		imageDownloading = true;
		clearTimeout(imageDownloadingTimeout);
		imageDownloadingTimeout = setTimeout(() => {
			imageDownloading = false;
		}, 2000);
	};

	const sidebarWrapperOnScroll = () => {
		sidebarWrapperScrollTop = sidebarWrapper.scrollTop;
		sidebarWrapperScrollHeight = sidebarWrapper.scrollHeight;
	};

	const setSidebarWrapperVars = () => {
		sidebarWrapperScrollTop = sidebarWrapper.scrollTop;
		sidebarWrapperScrollHeight = sidebarWrapper.scrollHeight;
	};

	const { seed, ...rest } = generation;
	const rerollUrl = getGenerationUrlFromParams(rest);
	const regenerateUrl = getGenerationUrlFromParams(generation);

	let upscaleDurationSec = 0;
	let upscaleDurationSecCalcInterval: NodeJS.Timeout;

	$: estimatedUpscaleDurationSec = $lastUpscaleDurationSec * (1 + estimatedDurationBufferRatio);

	async function onUpscaleClicked() {
		if (!$serverUrl) {
			console.log("No server url, can't upscale");
			return;
		}
		const start = Date.now();
		clearTimeout(upscaleDurationSecCalcInterval);
		upscaleDurationSecCalcInterval = setInterval(() => {
			upscaleDurationSec = (Date.now() - start) / 1000;
		}, 100);
		upscaleStatus = 'loading';
		try {
			const res = await upscaleImage({
				imageDataB64: generation.imageDataB64,
				scale: 4,
				version: 'General - RealESRGANplus',
				server_url: $serverUrl,
				prompt: generation.prompt,
				negative_prompt: generation.negative_prompt,
				seed: generation.seed,
				num_inference_steps: generation.num_inference_steps,
				guidance_scale: generation.guidance_scale,
				height: generation.height,
				width: generation.width
			});
			if (res.data?.imageDataB64) {
				const base64 = res.data.imageDataB64;
				const url = urlFromBase64(base64);
				const { upscaledImageDataB64, upscaledImageUrl, ...rest } = generation;
				dispatch('upscale', {
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
			console.log(error);
			upscaleStatus = 'error';
		}
		if (upscaleStatus !== 'error') {
			upscaledTabValue = 'upscaled';
			lastUpscaleDurationSec.set(upscaleDurationSec);
		}
		setTimeout(() => {
			if (upscaleStatus !== 'error') {
				upscaleStatus = 'idle';
			}
			clearTimeout(upscaleDurationSecCalcInterval);
		}, 250);
	}

	$: upscaledTabValue, setCurrentSrc();

	function setCurrentSrc() {
		if (upscaledTabValue === 'upscaled' && generation.upscaledImageDataB64) {
			currentImageDataBase64 = generation.upscaledImageDataB64;
			currentSrc = generation.upscaledImageUrl ?? urlFromBase64(currentImageDataBase64);
		} else {
			currentImageDataBase64 = generation.imageDataB64;
			currentSrc = generation.imageUrl ?? urlFromBase64(currentImageDataBase64);
		}
	}

	let upscaledTabValue: TUpscaleTabValue = 'upscaled';
	type TUpscaleTabValue = 'normal' | 'upscaled';
	const upscaledOrDefaultTabs: { label: string; value: TUpscaleTabValue }[] = [
		{
			label: 'Upscaled',
			value: 'upscaled'
		},
		{
			label: 'Normal',
			value: 'normal'
		}
	];

	onMount(() => {
		setSidebarWrapperVars();
	});
</script>

<ModalWrapper hasPadding={false}>
	<div
		on:click|capture={() => {
			if (upscaleStatus === 'error') upscaleStatus = 'idle';
		}}
		style={$windowWidth >= lgBreakpoint
			? `max-width: ${mainContainerWidth}px; max-height: ${mainContainerHeight}px`
			: ''}
		class="relative w-full h-full px-3 pt-16 pb-32 md:p-20 lg:p-0 flex lg:items-center justify-center z-10 
		overflow-auto lg:my-auto lg:overflow-hidden"
	>
		<div
			in:elementreceive|local={{ key: generation.id }}
			out:elementsend|local={{ key: generation.id }}
			use:clickoutside={{
				callback: () => {
					if (canClose) {
						activeGeneration.set(undefined);
					}
				}
			}}
			style={$windowWidth >= lgBreakpoint
				? `max-width: ${modalMaxWidth}px; max-height: ${modalMaxHeight}px`
				: ''}
			class="{generationAspectRatio >= 1.5
				? 'max-w-2xl'
				: generationAspectRatio >= 1
				? 'max-w-xl'
				: generationAspectRatio >= 2 / 3
				? 'max-w-md'
				: 'max-w-sm'} w-full lg:w-auto flex flex-col my-auto lg:flex-row bg-c-bg-secondary items-center shadow-generation-modal 
			shadow-c-shadow/[var(--o-shadow-stronger)] rounded-xl ring-4 ring-c-bg-tertiary overflow-hidden z-0 relative"
		>
			<div class="relative self-stretch flex items-center">
				<img
					class="w-full h-full absolute left-0 top-0 transform scale-125 blur-xl"
					src={generation.imageUrl}
					alt={generation.prompt}
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
						src={generation.imageUrl}
						alt={generation.prompt}
						width={generation.width}
						height={generation.height}
					/>
					<img
						style="transition: filter 0.5s cubic-bezier(0.4, 0, 0.2, 1);"
						class="{upscaleStatus === 'loading'
							? 'blur-2xl'
							: ''} filter w-full relative transition h-auto lg:h-full lg:object-contain lg:absolute lg:left-0 lg:top-0"
						src={currentSrc}
						alt={generation.prompt}
						width={generation.width}
						height={generation.height}
					/>
					{#if upscaleStatus === 'error'}
						<div
							transition:fly={{ duration: 200, easing: quadOut, y: -50 }}
							class="w-full absolute left-0 top-0 flex items-center justify-center p-3"
						>
							<p
								class="text-center font-medium text-xs md:text-sm shadow-lg shadow-c-shadow/[var(--o-shadow-stronger)] bg-c-bg-secondary px-4 py-3 rounded-xl"
							>
								Something went wrong :(
							</p>
						</div>
					{/if}
				</div>
				<div class="w-full h-full overflow-hidden z-0 absolute left-0 top-0 pointer-events-none">
					<div
						style="transition-duration: {upscaleStatus === 'loading'
							? estimatedUpscaleDurationSec
							: 0.2}s"
						class="w-[110%] h-full ease-image-generation transition bg-c-secondary/25 
						absolute left-0 top-0 rounded-xl {upscaleStatus === 'loading'
							? '-translate-x-[5%]'
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
				{#if showSidebarChevron && sidebarWrapperScrollTop + 24 < sidebarWrapperScrollHeight - sidebarWrapperHeight}
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
							{#if !generation.upscaledImageDataB64 && $currentServer.features?.includes('upscale')}
								<div class="w-full flex flex-col gap-3">
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
												<p>Upscale</p>
											{/if}
										</div>
									</Button>
								</div>
							{:else if generation.upscaledImageDataB64}
								<TabBar
									bind:value={upscaledTabValue}
									tabs={upscaledOrDefaultTabs}
									hasTitle={false}
									dontScale={true}
									name="Upscaled or Default Image"
								/>
							{/if}
							<div class="flex flex-col items-start gap-3">
								<p class="text-sm leading-normal">{generation.prompt}</p>
								{#if generation.negative_prompt}
									<div class="flex items-start text-c-danger gap-2">
										<div
											use:tooltip={{
												title: 'Negative Prompt',
												description:
													'To remove unwanted things from the image. It does the opposite of what the prompt does.',
												...tooltipStyleProps
											}}
										>
											<IconChatBubbleCancel class="w-5 h-5" />
										</div>
										<p class="text-sm leading-normal flex-shrink -mt-0.75">
											{generation.negative_prompt}
										</p>
									</div>
								{/if}
							</div>
							<div class="w-full flex flex-wrap gap-3">
								<SubtleButton
									onClick={onDownloadImageClicked}
									href={currentSrc}
									download={getImageNameFromGeneration(
										generation.prompt,
										generation.seed,
										generation.guidance_scale,
										generation.num_inference_steps,
										currentImageDataBase64
									)}
									state={imageDownloading ? 'success' : 'idle'}
								>
									<Morpher morph={imageDownloading}>
										<div slot="item-0" class="flex items-center justify-center gap-1.5">
											<IconDownload class="w-5 h-5 -ml-0.5" />
											<p>Download</p>
										</div>
										<div slot="item-1" class="flex items-center justify-center gap-1.5">
											<IconTick class="w-5 h-5 -ml-0.5 scale-110" />
											<p>Done!</p>
										</div>
									</Morpher>
								</SubtleButton>
								{#if $page.url.pathname !== '/'}
									<SubtleButton prefetch={true} href={rerollUrl}>
										<div class="flex items-center justify-center gap-1.5">
											<IconDice class="w-5 h-5 -ml-0.5 scale-110" />
											<p>Reroll</p>
										</div>
									</SubtleButton>
									<SubtleButton prefetch={true} href={regenerateUrl}>
										<div class="flex items-center justify-center gap-1.5">
											<IconRefresh class="w-5 h-5 -ml-0.5 scale-110" />
											<p>Regenerate</p>
										</div>
									</SubtleButton>
								{/if}
								<div use:copy={generation.prompt} on:svelte-copy={onPromptCopied}>
									<SubtleButton state={promptCopied ? 'success' : 'idle'}>
										<Morpher morph={promptCopied}>
											<div slot="item-0" class="flex items-center justify-center gap-1.5">
												<IconCopy class="w-5 h-5 -ml-0.5" />
												<p>Copy Prompt</p>
											</div>
											<div slot="item-1" class="flex items-center justify-center gap-1.5">
												<IconTick class="w-5 h-5 -ml-0.5 scale-110" />
												<p>Copied!</p>
											</div>
										</Morpher>
									</SubtleButton>
								</div>
								{#if generation.negative_prompt}
									<div
										use:copy={generation.negative_prompt}
										on:svelte-copy={onNegativePromptCopied}
									>
										<SubtleButton state={negativePromptCopied ? 'success' : 'idle'}>
											<Morpher morph={negativePromptCopied}>
												<div slot="item-0" class="flex items-center justify-center gap-1.5">
													<IconCopy class="w-5 h-5 -ml-0.5" />
													<p>Copy Negative Prompt</p>
												</div>
												<div slot="item-1" class="flex items-center justify-center gap-1.5">
													<IconTick class="w-5 h-5 -ml-0.5 scale-110" />
													<p>Copied!</p>
												</div>
											</Morpher>
										</SubtleButton>
									</div>
								{/if}
							</div>
						</div>
						<!-- Divider -->
						<div class="w-full pt-1.5 pb-0.5">
							<div class="w-full h-2px bg-c-bg-tertiary rounded-full" />
						</div>
						<!-- Divider -->
						<ParamsSection
							class="flex flex-col px-5 py-4 md:px-7 md:py-5 lg:pb-8 gap-6"
							{generation}
							bind:seedCopied
							bind:seedCopiedTimeout
							{onSeedCopyClicked}
						/>
					</div>
				</div>
			</div>
		</div>
	</div>
</ModalWrapper>
