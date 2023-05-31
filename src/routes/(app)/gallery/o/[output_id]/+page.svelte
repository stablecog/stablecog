<script lang="ts">
	import { page } from '$app/stores';
	import ButtonsSection from '$components/generationFullScreen/ButtonsSection.svelte';
	import ParamsSection from '$components/generationFullScreen/ParamsSection.svelte';
	import type {
		TButtonObjectsWithState,
		TGenerationFullScreenModalType,
		TSetButtonObjectWithState
	} from '$components/generationFullScreen/types.js';
	import IconChatBubbleCancel from '$components/icons/IconChatBubbleCancel.svelte';
	import { tooltip } from '$ts/actions/tooltip';
	import { negativePromptTooltipAlt } from '$ts/constants/tooltips';
	import { getGenerationUrlFromParams } from '$ts/helpers/getGenerationUrlFromParams.js';
	import type { TGenerationWithSelectedOutput } from '$ts/stores/user/generation.js';
	import {
		getImgProxySrc,
		getImgProxySrcDefault,
		getImgProxySrcSet
	} from '$ts/helpers/imgproxy.js';
	import LL from '$i18n/i18n-svelte.js';
	import ImagePlaceholder from '$components/ImagePlaceholder.svelte';
	import MetaTag from '$components/MetaTag.svelte';
	import { capitalize, getGalleryMetaTagDescriptionFromPromptText } from '$ts/helpers/metaTag.js';
	import { getPreviewImageUrlFromOutputId } from '$ts/helpers/getPreviewImageUrl.js';
	import { canonicalUrl } from '$ts/constants/main.js';
	import NoBgButton from '$components/buttons/NoBgButton.svelte';
	import IconBack from '$components/icons/IconBack.svelte';
	import { similarCount } from '$routes/(app)/gallery/o/[output_id]/constants.js';
	import { navbarHeight } from '$ts/stores/navbarHeight.js';
	import { onMount } from 'svelte';
	import SimpleGrid from '$components/grids/SimpleGrid.svelte';

	export let data;

	let generation: TGenerationWithSelectedOutput;
	$: output = data.generationFullOutput;
	$: similarOutputs = data.similarGenerationFullOutputs;
	$: generation = {
		...output.generation,
		selected_output: output
	};
	$: generateSimilarUrl = getGenerationUrlFromParams({ ...output.generation });
	$: exploreStyleUrl = `/gallery?q=${generation.selected_output.id}`;
	$: linkUrl = `${$page.url.origin}/gallery/o/${output.generation.id}`;
	$: currentImageUrl = output.upscaled_image_url ?? output.image_url;
	$: currentImageWidth = output.generation.width * (output.upscaled_image_url ? 4 : 1);
	$: currentImageHeight = output.generation.height * (output.upscaled_image_url ? 4 : 1);

	const simpleGridCols = 3;

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

	const modalType: TGenerationFullScreenModalType = 'gallery';

	$: srcset = getImgProxySrcSet({
		src: currentImageUrl
	});
	$: src = getImgProxySrcDefault(currentImageUrl);
	$: sizes = '(min-width: 1024px) calc(100vw - 500px), 100vw';

	$: titleLength = 50;
	$: shortPromptTitle = capitalize(
		output.generation.prompt.text.slice(0, titleLength) +
			(output.generation.prompt.text.length > titleLength ? '...' : '')
	);

	let mounted = false;

	onMount(() => {
		mounted = true;
	});
</script>

<MetaTag
	title="{shortPromptTitle} | Gallery"
	description={getGalleryMetaTagDescriptionFromPromptText(output.generation.prompt.text)}
	image_url={getPreviewImageUrlFromOutputId(output.id)}
	canonical="{canonicalUrl}{$page.url.pathname}/o/{output.id}"
/>

<div class="w-full flex justify-center pt-5 md:pt-8 pb-8 md:px-5 lg:px-8 xl:px-12 2xl:px-16">
	<div
		class="w-full flex flex-col lg:flex-row
    justify-center items-center lg:items-start gap-4 relative"
	>
		<div
			style="top: {$navbarHeight ? $navbarHeight + 24 : 96}px"
			class="flex-shrink min-w-0 flex justify-start items-start px-2 lg:sticky"
		>
			<div
				class="flex rounded-lg ring-2 ring-c-bg-secondary md:rounded-xl shadow-2xl
				shadow-c-shadow/[var(--o-shadow-strong)] relative overflow-hidden bg-c-bg-secondary"
			>
				<ImagePlaceholder
					width={currentImageWidth}
					height={currentImageHeight}
					class="max-h-[calc(100vh-110px)] md:max-h-[calc(100vh-150px)] max-w-full w-auto h-auto"
				/>
				{#key output.id}
					<img
						class="absolute left-0 top-0 w-full h-full"
						{sizes}
						{src}
						{srcset}
						width={currentImageWidth}
						height={currentImageHeight}
						alt={output.generation.prompt.text}
					/>
				{/key}
			</div>
		</div>
		<div class="w-full flex flex-shrink-0 flex-col gap-4 max-w-xl lg:max-w-md items-start px-5">
			<div class="w-full flex justify-center lg:justify-start lg:-ml-6 lg:-mt-2">
				<NoBgButton href="/gallery" prefetch={true} hoverFrom="right">
					<div class="flex items-center justify-center gap-2.5 px-2 py-1">
						<IconBack
							class="w-6 h-6 transform transition text-c-on-bg/50 group-hover:-translate-x-1
						not-touch:group-hover:text-c-primary"
						/>
						<p class="transition text-c-on-bg/50 not-touch:group-hover:text-c-primary">
							{$LL.Shared.BackToGalleryButton()}
						</p>
					</div>
				</NoBgButton>
			</div>
			<div class="flex flex-col items-start gap-3 -mt-4 lg:-mt-2">
				<div class="max-w-full flex flex-col gap-2">
					<h1 class="max-w-full font-semibold text-3xl">{$LL.Home.PromptInput.Title()}</h1>
					<h2 class="max-w-full leading-normal">{output.generation.prompt.text}</h2>
				</div>
				{#if output.generation.negative_prompt}
					<div class="max-w-full flex items-start text-c-danger gap-2">
						<div use:tooltip={$negativePromptTooltipAlt}>
							<IconChatBubbleCancel class="w-5 h-5" />
						</div>
						<h3 class="flex-shrink min-w-0 leading-normal -mt-0.75">
							{output.generation.negative_prompt.text}
						</h3>
					</div>
				{/if}
			</div>
			<ButtonsSection
				class="mt-1"
				{generation}
				{generateSimilarUrl}
				{exploreStyleUrl}
				{linkUrl}
				{currentImageUrl}
				{modalType}
				{setButtonObjectWithState}
				bind:buttonObjectsWithState
			/>
			<ParamsSection
				class="flex flex-col gap-6 mt-2"
				{currentImageWidth}
				{currentImageHeight}
				{generation}
				{setButtonObjectWithState}
				bind:buttonObjectsWithState
				{modalType}
			/>
			<div class="w-full flex flex-col mt-4">
				<h3 class="max-w-full font-semibold text-3xl">
					{$LL.GenerationFullscreen.SimilarTitle()}
				</h3>
				<div class="w-[calc(100%+6px)] flex flex-row justify-start items-start -mx-3px mt-3">
					<SimpleGrid
						cols={simpleGridCols}
						items={similarOutputs.slice(0, similarCount)}
						let:item={output}
					>
						<a
							href="/gallery/o/{output.id}"
							data-sveltekit-preload-data="hover"
							class="w-full group"
						>
							<div class="w-full p-2px">
								{#key output.id}
									<img
										class="w-full h-auto rounded-lg overflow-hidden border-2 border-c-bg-secondary
										shadow-lg shadow-c-shadow/[var(--o-shadow-strong)] transition bg-c-bg-secondary not-touch:group-hover:border-c-primary"
										sizes={`(min-width: 1024px) calc(28rem / ${simpleGridCols}), calc(min(36rem, 100vw) / ${simpleGridCols})`}
										src={getImgProxySrc({
											src: output.upscaled_image_url ?? output.image_url,
											preset: '256w'
										})}
										srcset={getImgProxySrcSet({
											src: output.upscaled_image_url ?? output.image_url
										})}
										width={output.generation.width}
										height={output.generation.height}
										alt={output.generation.prompt.text}
									/>
								{/key}
							</div>
						</a>
					</SimpleGrid>
				</div>
			</div>
		</div>
	</div>
</div>
