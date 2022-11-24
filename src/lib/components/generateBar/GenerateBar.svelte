<script lang="ts">
	import Button from '$components/buttons/Button.svelte';
	import ClearButton from '$components/buttons/ClearButton.svelte';
	import type { THomePageData } from '$routes/+page.server';
	import { autoresize } from '$ts/actions/textarea/autoresize';
	import { expandCollapse } from '$ts/animation/transitions';
	import {
		guidanceScaleDefault,
		guidanceScaleMax,
		guidanceScaleMin,
		heightDefault,
		heightTabs,
		inferenceStepsDefault,
		inferenceStepsTabs,
		maxPromptLength,
		widthDefault,
		widthTabs
	} from '$ts/constants/main';
	import { formatPrompt } from '$ts/helpers/formatPrompt';
	import { guidanceScale } from '$ts/stores/guidanceScale';
	import { imageSize } from '$ts/stores/imageSize';
	import { inferenceSteps } from '$ts/stores/inferenceSteps';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import { negativePrompt, prompt } from '$ts/stores/prompt';
	import { seed } from '$ts/stores/seed';
	import type { TStatus } from '$ts/types/main';
	import { onMount, tick } from 'svelte';
	import LL, { locale } from '$i18n/i18n-svelte';
	import { isValue } from '$ts/helpers/isValue';
	import GenerationSettingsSheet from '$components/generateBar/GenerationSettings.svelte';
	import { clickoutside } from '$ts/actions/clickoutside';
	import { portal } from 'svelte-portal';
	import { windowHeight, windowWidth } from '$ts/stores/window';
	import NoBgButton from '$components/buttons/NoBgButton.svelte';
	import IconGenerationSettings from '$components/icons/IconGenerationSettings.svelte';
	import { advancedMode } from '$ts/stores/advancedMode';
	import ScrollAreaWithChevron from '$components/ScrollAreaWithChevron.svelte';

	export let serverData: THomePageData;
	export let generationWidth =
		isValue(serverData.width) && serverData.width !== null ? serverData.width : widthDefault;
	export let generationHeight =
		isValue(serverData.height) && serverData.height !== null && serverData
			? serverData.height
			: heightDefault;
	export let generationInferenceSteps =
		isValue(serverData.num_inference_steps) && serverData.num_inference_steps !== null
			? inferenceStepsTabs
					.map((i) => i.value)
					.findIndex((i) => i === serverData.num_inference_steps) >= 0
				? serverData.num_inference_steps
				: inferenceStepsTabs[inferenceStepsTabs.length - 1].value
			: inferenceStepsDefault;
	export let generationGuidanceScale =
		isValue(serverData.guidance_scale) && serverData.guidance_scale !== null
			? serverData.guidance_scale
			: guidanceScaleDefault;
	export let generationSeed: number | undefined;
	export let promptInputValue: string | undefined;
	export let negativePromptInputValue: string | undefined;
	export let onCreate: () => Promise<void>;
	export let status: TStatus;
	export let startTimestamp: number | undefined;
	export let estimatedDuration: number;
	export { classes as class };
	let classes = '';

	if (isValue(serverData.seed) && serverData.seed !== null) {
		generationSeed = serverData.seed;
	} else if (isValue(serverData.prompt)) {
		generationSeed = undefined;
	}
	if (serverData.prompt !== null) promptInputValue = serverData.prompt;
	if (serverData.negative_prompt !== null) negativePromptInputValue = serverData.negative_prompt;

	let submitting = false;
	$: placeholder = $LL.Home.PromptInput.Placeholder();
	let now: number | undefined;
	let nowInterval: NodeJS.Timeout | undefined;
	let promptInputElement: HTMLTextAreaElement;
	let formElement: HTMLFormElement;
	let generationSettingsSheet = false;

	$: loadingOrSubmitting = status === 'loading' || submitting;
	$: sinceSec =
		now !== undefined && startTimestamp !== undefined
			? Math.max(now - startTimestamp, 0) / 1000
			: 0;
	$: [status], createOrDestroyInterval();

	async function createOrDestroyInterval() {
		if (nowInterval) clearInterval(nowInterval);
		if (status === 'loading') {
			nowInterval = setInterval(() => {
				now = Date.now();
			}, 100);
		}
	}

	async function onSubmit() {
		if (promptInputValue) {
			promptInputValue = formatPrompt(promptInputValue);
		}
		if (negativePromptInputValue) {
			negativePromptInputValue = formatPrompt(negativePromptInputValue);
		}
		promptInputElement.scrollTo(0, 0);
		promptInputElement.blur();
		setTimeout(async () => {
			submitting = true;
			if (!promptInputValue) {
				await new Promise((resolve) => setTimeout(resolve, 75));
				await tick();
				promptInputValue = placeholder;
			}
			await onCreate();
			submitting = false;
		});
	}

	let isCheckComplete = false;

	$: [generationWidth, generationHeight], setLocalImageSize();
	$: [generationInferenceSteps], setLocalInferenceSteps();
	$: [generationGuidanceScale], setLocalGuidanceScale();
	$: [generationSeed], setLocalSeed();
	$: [promptInputValue], setLocalPrompt();
	$: [negativePromptInputValue], setLocalNegativePrompt();
	$: showClearPromptInputButton =
		promptInputValue !== undefined && promptInputValue !== '' && !loadingOrSubmitting;
	$: [$windowWidth, $windowHeight], closeMobileSettingsSheet();

	const setLocalImageSize = () => {
		if (isCheckComplete) {
			imageSize.set({
				width: generationWidth,
				height: generationHeight
			});
		}
	};

	const setLocalInferenceSteps = () => {
		if (isCheckComplete) {
			inferenceSteps.set(generationInferenceSteps);
		}
	};

	const setLocalGuidanceScale = () => {
		if (isCheckComplete) {
			guidanceScale.set(Math.round(generationGuidanceScale));
		}
	};

	const setLocalSeed = () => {
		if (isCheckComplete) {
			if (generationSeed !== undefined && generationSeed !== null) {
				seed.set(parseInt(generationSeed.toString()));
			} else {
				localStorage.removeItem('seed');
			}
		}
	};

	const setLocalPrompt = () => {
		if (isCheckComplete) {
			prompt.set(promptInputValue !== '' && promptInputValue !== undefined ? promptInputValue : '');
		}
	};

	const setLocalNegativePrompt = () => {
		if (isCheckComplete) {
			negativePrompt.set(
				negativePromptInputValue !== '' && negativePromptInputValue !== undefined
					? negativePromptInputValue
					: ''
			);
		}
	};

	const clearPrompt = () => {
		promptInputValue = '';
		promptInputElement.value = '';
		promptInputElement.blur();
		promptInputElement.focus();
	};

	const closeMobileSettingsSheet = () => {
		if (generationSettingsSheet) generationSettingsSheet = false;
	};

	onMount(() => {
		isCheckComplete = false;
		if (!isValue(serverData.width)) {
			const widthIndex = widthTabs
				.map((w) => w.value)
				.findIndex((i) => i === $imageSize?.width?.toString());
			if (widthIndex >= 0) generationWidth = widthTabs[widthIndex].value;
		}
		if (!isValue(serverData.height)) {
			const heightIndex = heightTabs
				.map((h) => h.value)
				.findIndex((i) => i === $imageSize?.height?.toString());
			if (heightIndex >= 0) generationHeight = heightTabs[heightIndex].value;
		}
		if (!isValue(serverData.num_inference_steps)) {
			const inferenceStepsIndex = inferenceStepsTabs
				.map((i) => i.value)
				.findIndex((i) => i === $inferenceSteps?.toString());
			if (inferenceStepsIndex >= 0) {
				generationInferenceSteps = inferenceStepsTabs[inferenceStepsIndex].value;
			}
		}
		if (
			!isValue(serverData.guidance_scale) &&
			$guidanceScale >= guidanceScaleMin &&
			$guidanceScale <= guidanceScaleMax
		) {
			generationGuidanceScale = $guidanceScale;
		}
		if (
			!isValue(serverData.seed) &&
			!isValue(serverData.prompt) &&
			$seed !== undefined &&
			$seed !== null
		) {
			generationSeed = $seed;
		}
		if (!isValue(serverData.prompt) && isValue($prompt)) {
			promptInputValue = $prompt;
		}
		if (
			!isValue(serverData.negative_prompt) &&
			!isValue(serverData.prompt) &&
			isValue($negativePrompt)
		) {
			negativePromptInputValue = $negativePrompt;
		}
		isCheckComplete = true;
	});
</script>

<form
	bind:this={formElement}
	disabled={loadingOrSubmitting}
	on:submit|preventDefault={onSubmit}
	class="w-full max-w-2xl md:max-w-6.5xl md:px-4 lg:px-12 flex flex-col items-center pt-2"
>
	<!-- Prompt bar -->
	<div class="w-full flex flex-col md:flex-row gap-3 items-center pb-2 px-4">
		<div class="w-full flex relative group">
			<textarea
				use:autoresize={{ maxRows: 3 }}
				bind:this={promptInputElement}
				bind:value={promptInputValue}
				on:keypress={(e) => {
					if (e.key === 'Enter') {
						e.preventDefault();
						onSubmit();
					}
				}}
				on:input={() => {
					if (
						promptInputValue !== undefined &&
						promptInputValue !== null &&
						promptInputValue.length > maxPromptLength
					) {
						promptInputValue = promptInputValue.slice(0, maxPromptLength);
					}
				}}
				disabled={loadingOrSubmitting || !isCheckComplete}
				{placeholder}
				rows="1"
				type="text"
				style="transition: height 0.1s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1), padding 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
				class="w-full bg-c-bg-secondary shadow-lg pr-12 md:pr-17 hide-scrollbar shadow-c-shadow/[var(--o-shadow-normal)] 
					scroll-smooth resize-none transition relative pl-5 md:pl-6 py-5 rounded-xl 
					focus:ring-2 focus:ring-c-primary/20 ring-0 ring-c-primary/20 placeholder:text-c-on-bg/30 {!$isTouchscreen
					? 'enabled:hover:ring-2'
					: ''} {classes} {loadingOrSubmitting
					? 'text-c-secondary/75'
					: 'text-c-on-bg'} {!$isTouchscreen && !loadingOrSubmitting
					? 'group-hover:ring-2'
					: ''} {loadingOrSubmitting ? 'overflow-hidden' : ''}"
			/>
			{#if loadingOrSubmitting}
				<div
					class="w-full h-full flex items-end absolute left-0 top-0 overflow-hidden z-0 rounded-xl pointer-events-none"
				>
					<div
						transition:expandCollapse|local={{ transformOrigin: 'bottom' }}
						class="w-full h-6 absolute left-0 bottom-0 bg-gradient-to-t from-c-bg-secondary to-c-bg-secondary/0"
					/>
				</div>
			{/if}
			<div
				class="w-full h-full rounded-xl overflow-hidden z-0 absolute left-0 top-0 pointer-events-none"
			>
				<div
					style="transition-duration: {status === 'loading'
						? estimatedDuration
						: status === 'success' || status === 'error'
						? 0.5
						: 0}s"
					class="w-full h-full ease-image-generation transition bg-c-secondary/10 
					absolute left-0 top-0 rounded-xl {status === 'loading'
						? 'translate-x-0'
						: status === 'success' || status === 'error'
						? 'translate-x-full'
						: '-translate-x-full'}"
				/>
			</div>
			<ClearButton show={showClearPromptInputButton} onClick={clearPrompt} />
		</div>
		<Button
			disabled={loadingOrSubmitting || !isCheckComplete}
			loading={loadingOrSubmitting}
			class="w-full md:w-auto md:min-w-[9.5rem]"
		>
			<p class={loadingOrSubmitting ? 'opacity-0' : 'opacity-100'}>{$LL.Home.GenerateButton()}</p>
			<p
				class="{loadingOrSubmitting
					? 'opacity-100'
					: 'opacity-0'} absolute left-0 top-0 w-full h-full flex items-center justify-center"
			>
				{sinceSec.toLocaleString($locale, { minimumFractionDigits: 1, maximumFractionDigits: 1 })}
			</p>
		</Button>
	</div>
	<!-- Tab bars -->
	{#if status !== 'loading'}
		<div
			class="w-full flex flex-col justify-start items-center overflow-hidden px-4"
			transition:expandCollapse|local={{ duration: 300 }}
		>
			<div class="w-full hidden md:flex flex-col justify-start">
				<GenerationSettingsSheet
					disabled={loadingOrSubmitting}
					bind:generationWidth
					bind:generationHeight
					bind:generationGuidanceScale
					bind:generationInferenceSteps
					bind:generationSeed
					bind:negativePromptInputValue
					{formElement}
					{isCheckComplete}
				/>
			</div>
			<div class="w-full flex flex-col md:hidden justify-start pt-2 items-center relative">
				<NoBgButton onClick={() => (generationSettingsSheet = !generationSettingsSheet)}>
					<div
						class="flex justify-center items-center gap-2 px-4 py-0.5 flex-1 font-semibold overflow-hidden"
					>
						<IconGenerationSettings class="-ml-0.5" />
						<p class="flex-1 flex-shrink whitespace-nowrap overflow-hidden overflow-ellipsis">
							{$LL.Settings.Title()}
						</p>
					</div>
				</NoBgButton>
			</div>
		</div>
	{/if}
	{#if loadingOrSubmitting}
		<div transition:expandCollapse|local={{ duration: 300 }} class="w-full h-[2vh] md:h-[4vh]" />
	{/if}
</form>
<div
	use:portal={'body'}
	style="height: {$windowHeight}px; width: {$windowWidth}px"
	class="md:hidden fixed bottom-0 flex flex-col justify-end z-100 overflow-hidden transition {generationSettingsSheet
		? 'bg-c-barrier/85'
		: 'pointer-events-none bg-c-barrier/0'}"
>
	<div
		use:clickoutside={{
			callback: () => (generationSettingsSheet = false)
		}}
		class="{generationSettingsSheet
			? 'translate-y-0'
			: 'translate-y-[calc(100%+2rem)]'} transition {$advancedMode
			? 'duration-300'
			: ''} ring-2 ring-c-bg-secondary bg-c-bg w-full flex flex-col relative
			rounded-t-3xl justify-end overflow-hidden shadow-sheet shadow-c-shadow/[var(--o-shadow-strong)]"
	>
		<ScrollAreaWithChevron
			class="overflow-auto max-h-[70vh] flex flex-col justify-start px-4 pb-[calc(env(safe-area-inset-bottom)+0.5rem)] pt-1"
		>
			<div class="w-full flex flex-col">
				<GenerationSettingsSheet
					disabled={!generationSettingsSheet || loadingOrSubmitting}
					bind:generationWidth
					bind:generationHeight
					bind:generationGuidanceScale
					bind:generationInferenceSteps
					bind:generationSeed
					bind:negativePromptInputValue
					{formElement}
					{isCheckComplete}
				/>
			</div>
		</ScrollAreaWithChevron>
	</div>
</div>
