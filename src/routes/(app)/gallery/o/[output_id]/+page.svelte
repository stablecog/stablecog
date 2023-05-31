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
	import { getImgProxySrcDefault, getImgProxySrcSet } from '$ts/helpers/imgproxy.js';
	import LL from '$i18n/i18n-svelte.js';
	import ImagePlaceholder from '$components/ImagePlaceholder.svelte';
	import MetaTag from '$components/MetaTag.svelte';
	import { capitalize, getGalleryMetaTagDescriptionFromPromptText } from '$ts/helpers/metaTag.js';
	import { getPreviewImageUrlFromOutputId } from '$ts/helpers/getPreviewImageUrl.js';
	import { canonicalUrl } from '$ts/constants/main.js';
	import NoBgButton from '$components/buttons/NoBgButton.svelte';
	import IconBack from '$components/icons/IconBack.svelte';

	export let data;

	const output = data.generationFullOutput;
	const generation: TGenerationWithSelectedOutput = {
		...output.generation,
		selected_output: output
	};
	const generateSimilarUrl = getGenerationUrlFromParams({ ...output.generation });
	const exploreStyleUrl = `/gallery?q=${generation.selected_output.id}`;
	const linkUrl = `${$page.url.origin}/gallery/o/${output.generation.id}`;
	const currentImageUrl = output.upscaled_image_url ?? output.image_url;
	const currentImageWidth = output.generation.width * (output.upscaled_image_url ? 4 : 1);
	const currentImageHeight = output.generation.height * (output.upscaled_image_url ? 4 : 1);

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

	const srcset = getImgProxySrcSet({
		src: currentImageUrl
	});
	const src = getImgProxySrcDefault(currentImageUrl);
	const sizes = '(min-width: 1024px) calc(100vw - 500px), 100vw';

	const titleLength = 50;
	const shortPromptTitle = capitalize(
		output.generation.prompt.text.slice(0, titleLength) +
			(output.generation.prompt.text.length > titleLength ? '...' : '')
	);
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
    justify-center items-center lg:items-start gap-4"
	>
		<div class="flex-shrink min-w-0 flex justify-start items-start px-2">
			<div
				class="flex rounded-lg ring-2 ring-c-bg-secondary md:rounded-xl shadow-2xl
				shadow-c-shadow/[var(--o-shadow-strong)] relative overflow-hidden bg-c-bg-secondary"
			>
				<ImagePlaceholder
					width={currentImageWidth}
					height={currentImageHeight}
					class="max-h-[calc(100vh-110px)] md:max-h-[calc(100vh-150px)] max-w-full w-auto h-auto"
				/>
				<img
					class="absolute left-0 top-0 w-full h-full"
					{sizes}
					{src}
					{srcset}
					width={currentImageWidth}
					height={currentImageHeight}
					alt={output.generation.prompt.text}
				/>
			</div>
		</div>
		<div
			class="w-full flex flex-shrink-0 flex-col gap-4 max-w-xl lg:max-w-md items-start px-5 mt-2"
		>
			<div class="flex flex-col items-start gap-3">
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
			<div class="w-full flex justify-center lg:justify-start">
				<NoBgButton href="/gallery" prefetch={true} hoverFrom="right" class="lg:-ml-6">
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
		</div>
	</div>
</div>
