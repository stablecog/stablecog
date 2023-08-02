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
	import {
		capitalize,
		getOutputOnProfileMetaTagDescriptionFromPromptText
	} from '$ts/helpers/metaTag.js';
	import { getUserProfilePreviewImageUrlFromOutputId } from '$ts/helpers/getPreviewImageUrl.js';
	import { canonicalUrl } from '$ts/constants/main.js';
	import NoBgButton from '$components/buttons/NoBgButton.svelte';
	import IconBack from '$components/icons/IconBack.svelte';
	import { navbarHeight } from '$ts/stores/navbarHeight.js';
	import SimpleGrid from '$components/grids/SimpleGrid.svelte';
	import WithTooltip from '$components/WithTooltip.svelte';
	import { logOutputPageSimilarClicked } from '$ts/helpers/loggers.js';
	import { appVersion } from '$ts/stores/appVersion.js';
	import { userSummary } from '$ts/stores/user/summary';
	import UsernameButton from '$components/buttons/UsernameButton.svelte';

	export let data;

	let generation: TGenerationWithSelectedOutput;
	$: output = data.generationFullOutput;
	$: similarOutputs = data.similarGenerationFullOutputs;
	$: generation = {
		...output.generation,
		selected_output: output
	};
	$: generateSimilarUrl = getGenerationUrlFromParams({ ...output.generation });
	$: exploreSimilarUrl = `/gallery?q=${generation.selected_output.id}`;
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

	let imageNaturalWidth: number | undefined = undefined;

	$: output.id, resetImageNaturalWidth();
	let isInitial = true;
	function resetImageNaturalWidth() {
		if (isInitial) {
			isInitial = false;
			return;
		}
		imageNaturalWidth = undefined;
	}
</script>

<MetaTag
	title="{shortPromptTitle} | @{data.username}"
	description={getOutputOnProfileMetaTagDescriptionFromPromptText(
		output.generation.prompt.text,
		data.username
	)}
	image_url={getUserProfilePreviewImageUrlFromOutputId(output.id, data.username)}
	canonical="{canonicalUrl}{$page.url.pathname}"
/>

<div class="w-full flex justify-center pt-2 md:pt-6 pb-8 md:px-5 lg:px-8 xl:px-12 2xl:px-16">
	<div
		class="w-full flex flex-col lg:flex-row
    justify-center items-center lg:items-start gap-4 relative"
	>
		{#key output.id}
			<div
				style="top: {$navbarHeight ? $navbarHeight + 24 : 96}px"
				class="flex-shrink min-w-0 flex justify-start items-start px-2 lg:sticky"
			>
				<div
					class="flex ring-2 ring-c-bg-secondary rounded-2xl shadow-xl
					shadow-c-shadow/[var(--o-shadow-stronger)] relative overflow-hidden bg-c-bg-secondary"
				>
					<ImagePlaceholder
						width={currentImageWidth}
						height={currentImageHeight}
						class="max-h-[calc(100vh-100px)] md:max-h-[calc(100vh-130px)] max-w-full w-auto h-auto"
					/>
					<img
						class="absolute left-0 top-0 w-full h-full filter blur-xl transform scale-102"
						src={getImgProxySrc({
							src: currentImageUrl,
							preset: '64w'
						})}
						width={currentImageWidth}
						height={currentImageHeight}
						alt="Placeholder: {output.generation.prompt.text}"
					/>
					<img
						bind:naturalWidth={imageNaturalWidth}
						class="absolute left-0 top-0 w-full h-full transition ease-in {imageNaturalWidth
							? 'opacity-100'
							: 'opacity-0'}"
						{sizes}
						{src}
						{srcset}
						width={currentImageWidth}
						height={currentImageHeight}
						alt={output.generation.prompt.text}
					/>
				</div>
			</div>
		{/key}
		<div class="w-full flex flex-shrink-0 flex-col gap-4 max-w-xl lg:max-w-md items-start px-5">
			<div class="w-full flex justify-center lg:justify-start lg:-ml-6 lg:-mt-2">
				<NoBgButton href="/user/{data.username}" prefetch={true} hoverFrom="right">
					<div class="flex items-center justify-center gap-2.5 px-2 py-1">
						<IconBack
							class="w-6 h-6 transform transition text-c-on-bg/50 group-hover:-translate-x-1
							not-touch:group-hover:text-c-primary"
						/>
						<p class="transition text-c-on-bg/50 not-touch:group-hover:text-c-primary">
							{$LL.Shared.BackToProfile()}
						</p>
					</div>
				</NoBgButton>
			</div>
			<UsernameButton username={data.username} class="-mt-3" />
			<div class="w-full flex flex-col items-start gap-3 mt-1">
				<div class="w-full flex flex-col gap-2">
					<p class="w-full font-semibold text-3xl">{$LL.Home.PromptInput.Title()}</p>
					<h1 class="w-full leading-normal">{output.generation.prompt.text}</h1>
				</div>
				{#if output.generation.negative_prompt}
					<div class="max-w-full flex items-start text-c-danger gap-2">
						<WithTooltip
							title={$LL.Home.NegativePromptInput.Title()}
							paragraph={$LL.Home.NegativePromptInput.Paragraph()}
							let:trigger
							let:triggerStoreValue
						>
							<div tabindex="-1" use:trigger {...triggerStoreValue} class="cursor-default">
								<IconChatBubbleCancel class="w-5 h-5" />
							</div>
						</WithTooltip>
						<h2 class="flex-shrink min-w-0 leading-normal -mt-0.75">
							{output.generation.negative_prompt.text}
						</h2>
					</div>
				{/if}
			</div>
			<ButtonsSection
				class="mt-1"
				{generation}
				{generateSimilarUrl}
				{exploreSimilarUrl}
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
			{#if similarOutputs.length > 0}
				<div class="w-full flex flex-col mt-5">
					<p class="max-w-full font-semibold text-3xl">
						{$LL.GenerationFullscreen.SimilarTitle()}
					</p>
					<div class="w-[calc(100%+8px)] flex flex-row justify-start items-start -m-4px mt-3.5">
						<SimpleGrid cols={simpleGridCols} items={similarOutputs} let:item={similarOutput}>
							<a
								on:click={() => {
									logOutputPageSimilarClicked({
										'SC - App Version': $appVersion,
										'SC - Similar to Output Id': output.id,
										'SC - Clicked Output Id': similarOutput.id,
										'SC - Stripe Product Id': $userSummary?.product_id,
										'SC - User Id': $page.data.session?.user.id
									});
								}}
								href="/user/{data.username}/o/{similarOutput.id}"
								data-sveltekit-preload-data="hover"
								class="w-full group"
							>
								<div class="w-full p-2px">
									{#key similarOutput.id}
										<img
											loading="lazy"
											class="w-full h-auto rounded-xl overflow-hidden border-2 border-c-bg-secondary
											shadow-lg shadow-c-shadow/[var(--o-shadow-stronger)] transition bg-c-bg-secondary not-touch:group-hover:border-c-primary"
											sizes={`(min-width: 1024px) calc(28rem / ${simpleGridCols}), calc(min(36rem, 100vw) / ${simpleGridCols})`}
											src={getImgProxySrc({
												src: similarOutput.upscaled_image_url ?? similarOutput.image_url,
												preset: '256w'
											})}
											srcset={getImgProxySrcSet({
												src: similarOutput.upscaled_image_url ?? similarOutput.image_url
											})}
											width={similarOutput.generation.width}
											height={similarOutput.generation.height}
											alt={similarOutput.generation.prompt.text}
										/>
									{/key}
								</div>
							</a>
						</SimpleGrid>
					</div>
				</div>
			{/if}
		</div>
	</div>
</div>
