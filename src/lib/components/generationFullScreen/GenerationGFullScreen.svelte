<script lang="ts">
	import SubtleButton from '$components/buttons/SubtleButton.svelte';
	import IconChatBubbleCancel from '$components/icons/IconChatBubbleCancel.svelte';
	import IconCopy from '$components/icons/IconCopy.svelte';
	import IconTick from '$components/icons/IconTick.svelte';
	import ModalWrapper from '$components/ModalWrapper.svelte';
	import Morpher from '$components/Morpher.svelte';
	import { clickoutside } from '$ts/actions/clickoutside';
	import { elementreceive, elementsend } from '$ts/animation/transitions';
	import { activeGenerationG } from '$ts/stores/activeGenerationG';
	import { windowHeight, windowWidth } from '$ts/stores/window';
	import { copy } from 'svelte-copy';
	import IconChevronDown from '$components/icons/IconChevronDown.svelte';
	import IconButton from '$components/buttons/IconButton.svelte';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import { onMount } from 'svelte';
	import { quadOut } from 'svelte/easing';
	import { fly } from 'svelte/transition';
	import { tooltip } from '$ts/actions/tooltip';
	import { getGenerationUrlFromParams } from '$ts/helpers/getGenerationUrlFromParams';
	import {
		copyTimeoutDuration,
		lgBreakpoint,
		maxHeight,
		padding,
		sidebarWidth,
		tooltipStyleProps
	} from '$components/generationFullScreen/Shared';
	import ParamsSectionG from '$components/generationFullScreen/ParamsSectionG.svelte';
	import { urlFromImageId } from '$ts/helpers/urlFromImageId';
	import IconWand from '$components/icons/IconWand.svelte';
	import type { TGenerationGAdmin } from '$ts/types/main';

	export let generation: TGenerationGAdmin;

	$: generationAspectRatio = generation.width / generation.height;

	$: maxWidthConstant = generationAspectRatio >= 3 / 2 ? 1440 : 1280;

	let imageContainerWidth = 0;
	let imageContainerHeight = 0;

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
		sidebarWrapperScrollTop + 16 < sidebarWrapperScrollHeight - sidebarWrapperHeight;

	$: mainContainerWidth = Math.min($windowWidth || 0, maxWidthConstant);
	$: mainContainerHeight = Math.min($windowHeight || 0, maxHeight);

	$: modalMaxWidth = mainContainerWidth - 2 * padding;
	$: modalMaxHeight = mainContainerHeight - 2 * padding;

	$: modalMinHeight = Math.min(modalMaxHeight, 575);

	$: [modalMaxWidth, modalMaxHeight, generation], setImageContainerSize();

	let generateUrl: string;
	$: [generation], onGenerationChanged();

	function onGenerationChanged() {
		generateUrl = getGenerationUrlFromParams({
			prompt: generation.prompt.text,
			negative_prompt: generation.negative_prompt?.text ?? undefined,
			guidance_scale: generation.guidance_scale,
			num_inference_steps: generation.inference_steps ?? undefined,
			height: generation.height,
			width: generation.width
		});
	}

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

	const sidebarWrapperOnScroll = () => {
		sidebarWrapperScrollTop = sidebarWrapper.scrollTop;
		sidebarWrapperScrollHeight = sidebarWrapper.scrollHeight;
	};

	const setSidebarWrapperVars = () => {
		sidebarWrapperScrollTop = sidebarWrapper.scrollTop;
		sidebarWrapperScrollHeight = sidebarWrapper.scrollHeight;
	};

	onMount(() => {
		setSidebarWrapperVars();
	});
</script>

<ModalWrapper hasPadding={false}>
	<div
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
					activeGenerationG.set(undefined);
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
					src={urlFromImageId(generation.image_id)}
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
						class="w-full relative transition h-auto lg:h-full lg:object-contain lg:absolute lg:left-0 lg:top-0"
						src={urlFromImageId(generation.image_id)}
						alt={generation.prompt.text}
						width={generation.width}
						height={generation.height}
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
							<div class="flex flex-col items-start gap-3">
								<p class="text-sm leading-normal">{generation.prompt.text}</p>
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
											{generation.negative_prompt.text}
										</p>
									</div>
								{/if}
							</div>
							<div class="w-full flex flex-wrap gap-3">
								<SubtleButton prefetch={true} href={generateUrl} target="_blank">
									<div class="flex items-center justify-center gap-1.5">
										<IconWand class="w-5 h-5 -ml-0.5" />
										<p>Generate</p>
									</div>
								</SubtleButton>
								<div use:copy={generation.prompt.text} on:svelte-copy={onPromptCopied}>
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
										use:copy={generation.negative_prompt.text}
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
						<ParamsSectionG
							class="flex flex-col px-5 py-4 md:px-7 md:py-5 lg:pb-8 gap-6"
							{generation}
							bind:seedCopied
							bind:seedCopiedTimeout
							{copyTimeoutDuration}
							{onSeedCopyClicked}
						/>
					</div>
				</div>
			</div>
		</div>
	</div>
</ModalWrapper>
