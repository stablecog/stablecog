<script lang="ts">
	import CopyButton from '$components/buttons/CopyButton.svelte';
	import SubtleButton from '$components/buttons/SubtleButton.svelte';
	import IconChatBubbleCancel from '$components/icons/IconChatBubbleCancel.svelte';
	import IconClock from '$components/icons/IconClock.svelte';
	import IconCopy from '$components/icons/IconCopy.svelte';
	import IconDownload from '$components/icons/IconDownload.svelte';
	import IconScale from '$components/icons/IconScale.svelte';
	import IconSeed from '$components/icons/IconSeed.svelte';
	import IconSteps from '$components/icons/IconSteps.svelte';
	import IconTick from '$components/icons/IconTick.svelte';
	import ModalWrapper from '$components/ModalWrapper.svelte';
	import Morpher from '$components/Morpher.svelte';
	import { clickoutside } from '$ts/actions/clickoutside';
	import { elementreceive, elementsend } from '$ts/animation/transitions';
	import { urlFromBase64 } from '$ts/helpers/base64';
	import { generationId } from '$ts/helpers/generationId';
	import { getImageNameFromGeneration } from '$ts/helpers/getImageNameFromGeneration';
	import { activeGeneration } from '$ts/stores/activeGeneration';
	import { windowHeight, windowWidth } from '$ts/stores/window';
	import type { TGenerationUI } from '$ts/types/main';
	import { copy } from 'svelte-copy';

	export let generation: TGenerationUI;

	const padding = 48;

	const maxWidth = 1440;
	const maxHeight = 1024;
	const sidebarWidth = 400;

	const lgBreakpoint = 1024;

	let imageContainerWidth = 0;
	let imageContainerHeight = 0;

	$: mainContainerWidth = Math.min($windowWidth || 0, maxWidth);
	$: mainContainerHeight = Math.min($windowHeight || 0, maxHeight);

	$: modalMaxWidth = mainContainerWidth - 2 * padding;
	$: modalMaxHeight = mainContainerHeight - 2 * padding;

	$: modalMinHeight = Math.min(modalMaxHeight, 500);

	$: [modalMaxWidth, modalMaxHeight], setImageContainerSize();

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

	let seedCopiedTimeout: NodeJS.Timeout;
	let seedCopied = false;
	const onSeedCopied = () => {
		seedCopied = true;
		promptCopied = false;
		negativePromptCopied = false;
		clearTimeout(seedCopiedTimeout);
		clearTimeout(negativePromptCopiedTimeout);
		clearTimeout(promptCopiedTimeout);
		seedCopiedTimeout = setTimeout(() => {
			seedCopied = false;
		}, 2000);
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
</script>

<ModalWrapper hasPadding={false}>
	<div
		style={$windowWidth >= lgBreakpoint
			? `max-width: ${mainContainerWidth}px; max-height: ${mainContainerHeight}px`
			: ''}
		class="relative w-full h-full px-5 py-24 md:px-12 lg:p-0 flex lg:items-center justify-center z-10 overflow-auto lg:my-auto lg:overflow-hidden"
	>
		<div
			in:elementreceive|local={{ key: generationId(generation) }}
			out:elementsend|local={{ key: generationId(generation) }}
			use:clickoutside={{ callback: () => activeGeneration.set(undefined) }}
			style={$windowWidth >= lgBreakpoint
				? `max-width: ${modalMaxWidth}px; max-height: ${modalMaxHeight}px`
				: ''}
			class="max-w-lg flex flex-col my-auto lg:flex-row bg-c-bg-secondary items-center shadow-generation-modal shadow-c-shadow/[var(--o-shadow-strongest)] 
			rounded-xl ring-4 ring-c-bg-tertiary overflow-hidden z-0 relative"
		>
			<div
				style={$windowWidth >= lgBreakpoint
					? `width: ${imageContainerWidth}px; height: ${imageContainerHeight}px;`
					: ''}
				class="w-full relative"
			>
				<div class="w-full lg:h-full">
					<img
						class="w-full h-auto lg:h-full lg:object-contain lg:absolute lg:left-0 lg:top-0"
						src={generation.imageUrl}
						alt={generation.prompt}
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
				flex-col items-start justify-start overflow-auto bg-c-bg-secondary lg:border-l-2 border-c-bg-tertiary relative"
			>
				<div class="flex flex-col gap-4 md:gap-5 px-5 py-4 md:px-7 md:py-5">
					<div class="flex flex-col gap-3">
						<p class="text-sm leading-normal">{generation.prompt}</p>
						{#if generation.negative_prompt}
							<div class="flex items-start text-c-danger gap-2">
								<IconChatBubbleCancel class="w-4 h-4" />
								<p class="text-sm leading-normal flex-1 -mt-1">{generation.negative_prompt}</p>
							</div>
						{/if}
					</div>
					<div class="w-full flex flex-wrap gap-3">
						<div use:copy={generation.prompt} on:svelte-copy={onPromptCopied}>
							<SubtleButton state={promptCopied ? 'success' : 'default'}>
								<Morpher morph={promptCopied}>
									<div slot="item-0" class="flex items-center justify-center gap-1.5">
										<IconCopy class="w-5 h-5 -ml-0.25" />
										<p>Copy Prompt</p>
									</div>
									<div slot="item-1" class="flex items-center justify-center gap-1.5">
										<IconTick class="w-5 h-5 -ml-0.25 scale-110" />
										<p>Copied!</p>
									</div>
								</Morpher>
							</SubtleButton>
						</div>
						{#if generation.negative_prompt}
							<div use:copy={generation.negative_prompt} on:svelte-copy={onNegativePromptCopied}>
								<SubtleButton state={negativePromptCopied ? 'success' : 'default'}>
									<Morpher morph={negativePromptCopied}>
										<div slot="item-0" class="flex items-center justify-center gap-1.5">
											<IconCopy class="w-5 h-5 -ml-0.25" />
											<p>Negative Copy Prompt</p>
										</div>
										<div slot="item-1" class="flex items-center justify-center gap-1.5">
											<IconTick class="w-5 h-5 -ml-0.25 scale-110" />
											<p>Copied!</p>
										</div>
									</Morpher>
								</SubtleButton>
							</div>
						{/if}
						<SubtleButton
							onClick={onDownloadImageClicked}
							href={generation.imageUrl?.startsWith('data:image/')
								? urlFromBase64(generation.imageUrl)
								: generation.imageUrl}
							download={getImageNameFromGeneration(
								generation.prompt,
								generation.seed,
								generation.guidance_scale,
								generation.num_inference_steps
							)}
							state={imageDownloading ? 'success' : 'default'}
						>
							<Morpher morph={imageDownloading}>
								<div slot="item-0" class="flex items-center justify-center gap-1.5">
									<IconDownload class="w-5 h-5 -ml-0.25" />
									<p>Download Image</p>
								</div>
								<div slot="item-1" class="flex items-center justify-center gap-1.5">
									<IconTick class="w-5 h-5 -ml-0.25 scale-110" />
									<p>Downloaded!</p>
								</div>
							</Morpher>
						</SubtleButton>
					</div>
				</div>
				<!-- Divider -->
				<div class="w-full pt-1.5 pb-0.5">
					<div class="w-full h-2px bg-c-bg-tertiary rounded-full" />
				</div>
				<!-- Divider -->
				<div class="flex flex-col px-5 py-4 md:px-7 md:py-5 lg:pb-12 gap-5">
					<div class="flex flex-wrap items-center gap-4">
						<div class="flex flex-col gap-0.5">
							<div class="flex items-center gap-1.5 text-c-on-bg/75 text-sm">
								<IconSeed class="w-4 h-4" />
								<p>Seed</p>
							</div>
							<p class="font-bold">{generation.seed}</p>
						</div>
						<div use:copy={String(generation.seed)} on:svelte-copy={onSeedCopied}>
							<SubtleButton noPadding class="p-2.5" state={seedCopied ? 'success' : 'default'}>
								<Morpher morph={seedCopied}>
									<div slot="item-0" class="flex items-center justify-center gap-1.5">
										<IconCopy class="w-5 h-5" />
									</div>
									<div slot="item-1" class="flex items-center justify-center gap-1.5">
										<IconTick class="w-5 h-5 scale-150" />
									</div>
								</Morpher>
							</SubtleButton>
						</div>
					</div>
					<div class="flex flex-col gap-0.5">
						<div class="flex items-center gap-1.5 text-c-on-bg/75 text-sm">
							<IconScale class="w-4 h-4" />
							<p>Guidance Scale</p>
						</div>
						<p class="font-bold">{generation.guidance_scale}</p>
					</div>
					<div class="flex flex-col gap-0.5">
						<div class="flex items-center gap-1.5 text-c-on-bg/75 text-sm">
							<IconSteps class="w-4 h-4" />
							<p>Inference Steps</p>
						</div>
						<p class="font-bold">{generation.num_inference_steps}</p>
					</div>
					{#if generation.duration_ms}
						<div class="flex flex-col gap-0.5">
							<div class="flex items-center gap-1.5 text-c-on-bg/75 text-sm">
								<IconClock class="w-4 h-4" />
								<p>Duration</p>
							</div>
							<p class="font-bold">
								{Math.round((generation.duration_ms / 1000) * 10) / 10}s
							</p>
						</div>
					{/if}
				</div>
			</div>
		</div>
	</div>
</ModalWrapper>
