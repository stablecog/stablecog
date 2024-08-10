<script lang="ts">
	import { page } from '$app/stores';
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
	import NoBgButton from '$components/primitives/buttons/NoBgButton.svelte';
	import UsernameButton from '$components/primitives/buttons/UsernameButton.svelte';
	import ImagePlaceholder from '$components/utils/image/ImagePlaceholder.svelte';
	import WithTooltip from '$components/utils/WithTooltip.svelte';
	import LL, { locale } from '$i18n/i18n-svelte';
	import { getGenerateSimilarUrlFromParams } from '$ts/helpers/getGenerationUrlFromParams';
	import { getRelativeDate } from '$ts/helpers/getRelativeDate';
	import { getImgProxySrc, getImgProxySrcDefault, getImgProxySrcSet } from '$ts/helpers/imgproxy';
	import { navbarHeight } from '$ts/stores/navbarHeight';
	import type {
		TGenerationFullOutput,
		TGenerationWithSelectedOutput
	} from '$ts/stores/user/generation';
	import { onDestroy } from 'svelte';

	export let modalType: TGenerationFullScreenModalType;
	export let output: TGenerationFullOutput;
	export let similarOutputs: TGenerationFullOutput[];

	let generation: TGenerationWithSelectedOutput;
	$: generation = {
		...output.generation,
		selected_output: output
	};
	$: generateSimilarUrl = getGenerateSimilarUrlFromParams({ ...output.generation });
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

	onDestroy(() => {
		for (const key in buttonObjectsWithState) {
			if (buttonObjectsWithState[key].timeout) {
				clearTimeout(buttonObjectsWithState[key].timeout);
			}
		}
	});
</script>

<div class="flex w-full justify-center pb-8 pt-2 md:px-5 md:pt-6 lg:px-8 xl:px-12 2xl:px-16">
	<div
		class="relative flex w-full flex-col
    items-center justify-center gap-4 lg:flex-row lg:items-start"
	>
		{#key output.id}
			<div
				style="top: {$navbarHeight ? $navbarHeight + 24 : 96}px"
				class="flex min-w-0 flex-shrink items-start justify-start px-2 lg:sticky"
			>
				<div
					class="relative flex overflow-hidden rounded-2xl bg-c-bg-secondary
					shadow-xl shadow-c-shadow/[var(--o-shadow-stronger)] ring-2 ring-c-bg-secondary"
				>
					<ImagePlaceholder
						width={currentImageWidth}
						height={currentImageHeight}
						class="h-auto max-h-[calc(100vh-100px)] w-auto max-w-full md:max-h-[calc(100vh-130px)]"
					/>
					<img
						class="absolute left-0 top-0 h-full w-full scale-102 transform blur-xl filter"
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
						class="absolute left-0 top-0 h-full w-full transition ease-in {imageNaturalWidth
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
		<div class="flex w-full max-w-xl flex-shrink-0 flex-col items-start gap-4 px-5 lg:max-w-md">
			<div class="flex w-full justify-center lg:-ml-5 lg:-mt-2 lg:justify-start">
				<NoBgButton
					href={modalType === 'user-profile' ? `/${generation.user.username}` : '/gallery'}
					prefetch={true}
					hoverFrom="right"
				>
					<div class="flex items-center justify-center gap-2.5">
						<IconBack
							class="h-6 w-6 transform text-c-on-bg/50 transition group-hover:-translate-x-1
							not-touch:group-hover:text-c-primary"
						/>
						<p class="text-c-on-bg/50 transition not-touch:group-hover:text-c-primary">
							{modalType === 'user-profile'
								? $LL.Shared.BackToProfile()
								: $LL.Shared.BackToGalleryButton()}
						</p>
					</div>
				</NoBgButton>
			</div>
			<UsernameButton username={output.generation.user.username} class="-mt-2" />
			<div class="mt-1 flex w-full flex-col items-start gap-3">
				<div class="flex w-full flex-col gap-2">
					<p class="w-full text-3xl font-semibold">{$LL.Home.PromptInput.Title()}</p>
					<h1 class="w-full leading-normal">{output.generation.prompt.text}</h1>
				</div>
				{#if output.generation.negative_prompt}
					<div class="flex max-w-full items-start gap-2 text-c-danger">
						<WithTooltip
							title={$LL.Home.NegativePromptInput.Title()}
							paragraph={$LL.Home.NegativePromptInput.Paragraph()}
							let:trigger
							let:triggerStoreValue
						>
							<div tabindex="-1" use:trigger {...triggerStoreValue} class="cursor-default">
								<IconChatBubbleCancel class="h-5 w-5" />
							</div>
						</WithTooltip>
						<h2 class="-mt-0.75 min-w-0 flex-shrink leading-normal">
							{output.generation.negative_prompt.text}
						</h2>
					</div>
				{/if}
				{#if generation.selected_output.created_at !== undefined || generation.created_at !== undefined}
					<p class="-mt-1 text-sm text-c-on-bg/75">
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
				class="mt-2 flex flex-col gap-6"
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
