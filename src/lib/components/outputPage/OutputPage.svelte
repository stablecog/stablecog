<script lang="ts">
	import { page } from '$app/stores';
	import ImagePlaceholder from '$components/utils/image/ImagePlaceholder.svelte';
	import WithTooltip from '$components/utils/WithTooltip.svelte';
	import NoBgButton from '$components/buttons/NoBgButton.svelte';
	import UsernameButton from '$components/buttons/UsernameButton.svelte';
	import ButtonsSection from '$components/generationFullScreen/ButtonsSection.svelte';
	import ParamsSection from '$components/generationFullScreen/ParamsSection.svelte';
	import type {
		TButtonObjectsWithState,
		TGenerationFullScreenModalType,
		TSetButtonObjectWithState
	} from '$components/generationFullScreen/types';
	import IconBack from '$components/icons/IconBack.svelte';
	import IconChatBubbleCancel from '$components/icons/IconChatBubbleCancel.svelte';
	import SimilarOutputsSectionOutputPage from '$components/outputPage/SimilarOutputsSectionOutputPage.svelte';
	import LL, { locale } from '$i18n/i18n-svelte';
	import { getGenerationUrlFromParams } from '$ts/helpers/getGenerationUrlFromParams';
	import { getRelativeDate } from '$ts/helpers/getRelativeDate';
	import { getImgProxySrc, getImgProxySrcDefault, getImgProxySrcSet } from '$ts/helpers/imgproxy';
	import { navbarHeight } from '$ts/stores/navbarHeight';
	import type {
		TGenerationFullOutput,
		TGenerationWithSelectedOutput
	} from '$ts/stores/user/generation';

	export let modalType: TGenerationFullScreenModalType;
	export let output: TGenerationFullOutput;
	export let similarOutputs: TGenerationFullOutput[];

	let generation: TGenerationWithSelectedOutput;
	$: generation = {
		...output.generation,
		selected_output: output
	};
	$: generateSimilarUrl = getGenerationUrlFromParams({ ...output.generation });
	$: exploreSimilarUrl = `/gallery?q=${generation.selected_output.id}`;
	$: linkUrl =
		modalType === 'user-profile'
			? `${$page.url.origin}/${output.generation.user.username}/${output.generation.id}`
			: `${$page.url.origin}/gallery/o/${output.generation.id}`;
	$: currentImageUrl = output.upscaled_image_url ?? output.image_url;
	$: currentImageWidth = output.generation.width * (output.upscaled_image_url ? 4 : 1);
	$: currentImageHeight = output.generation.height * (output.upscaled_image_url ? 4 : 1);

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

	$: srcset = getImgProxySrcSet({
		src: currentImageUrl
	});
	$: src = getImgProxySrcDefault(currentImageUrl);
	$: sizes = '(min-width: 1024px) calc(100vw - 500px), 100vw';

	let imageNaturalWidth: number | undefined = undefined;

	$: outputId = output.id;
	$: outputId, onOutputChanged();

	let isInitial = true;
	function onOutputChanged() {
		if (isInitial) {
			isInitial = false;
			return;
		}
		imageNaturalWidth = undefined;
		resetButtonObjectsWithState();
	}

	function onLikesChanged({
		newLikeCount,
		newIsLikedByUser,
		action
	}: {
		newLikeCount: number;
		newIsLikedByUser: boolean;
		action: 'like' | 'unlike';
	}) {
		output = {
			...output,
			like_count: newLikeCount,
			is_liked: newIsLikedByUser
		};
	}

	function resetButtonObjectsWithState() {
		for (const key in buttonObjectsWithState) {
			setButtonObjectWithState(key, 'idle');
		}
	}

	$: now = generation ? Date.now() : Date.now();
</script>

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
				<NoBgButton
					href={modalType === 'user-profile' ? `/${generation.user.username}` : '/gallery'}
					prefetch={true}
					hoverFrom="right"
				>
					<div class="flex items-center justify-center gap-2.5 px-2 py-1">
						<IconBack
							class="w-6 h-6 transform transition text-c-on-bg/50 group-hover:-translate-x-1
							not-touch:group-hover:text-c-primary"
						/>
						<p class="transition text-c-on-bg/50 not-touch:group-hover:text-c-primary">
							{modalType === 'user-profile'
								? $LL.Shared.BackToProfile()
								: $LL.Shared.BackToGalleryButton()}
						</p>
					</div>
				</NoBgButton>
			</div>
			<UsernameButton username={output.generation.user.username} class="-mt-3" />
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
				{#if generation.selected_output.created_at !== undefined || generation.created_at !== undefined}
					<p class="text-sm text-c-on-bg/75 -mt-1">
						{getRelativeDate({
							date: generation.selected_output.created_at || generation.created_at,
							locale: $locale,
							dateStyle: 'long',
							now
						})}
					</p>
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
				{onLikesChanged}
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
			<SimilarOutputsSectionOutputPage {similarOutputs} {output} {modalType} />
		</div>
	</div>
</div>
