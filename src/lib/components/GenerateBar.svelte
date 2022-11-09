<script lang="ts">
	import Button from '$components/buttons/Button.svelte';
	import ClearButton from '$components/buttons/ClearButton.svelte';
	import IconChatBubbleCancel from '$components/icons/IconChatBubbleCancel.svelte';
	import IconHeight from '$components/icons/IconHeight.svelte';
	import IconScale from '$components/icons/IconScale.svelte';
	import IconSeed from '$components/icons/IconSeed.svelte';
	import IconSteps from '$components/icons/IconSteps.svelte';
	import IconWidth from '$components/icons/IconWidth.svelte';
	import TabBar from '$components/TabBar.svelte';
	import TabLikeInput from '$components/TabLikeInput.svelte';
	import TabLikeRangeInput from '$components/TabLikeRangeInput.svelte';
	import type { THomePageData } from '$routes/+page.server';
	import { autoresize } from '$ts/actions/textarea/autoresize';
	import { tooltip } from '$ts/actions/tooltip';
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
		maxSeed,
		widthDefault,
		widthTabs
	} from '$ts/constants/main';
	import { formatPrompt } from '$ts/helpers/formatPrompt';
	import { advancedMode } from '$ts/stores/advancedMode';
	import { guidanceScale } from '$ts/stores/guidanceScale';
	import { imageSize } from '$ts/stores/imageSize';
	import { inferenceSteps } from '$ts/stores/inferenceSteps';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import { negativePrompt, prompt } from '$ts/stores/prompt';
	import { seed } from '$ts/stores/seed';
	import { currentServer } from '$ts/stores/serverHealth';
	import type { TStatus } from '$ts/types/main';
	import { onMount, tick } from 'svelte';
	import LL, { locale } from '$i18n/i18n-svelte';
	import {
		guidanceScaleTooltip,
		heightTooltip,
		inferenceStepsTooltip,
		negativePromptTooltip,
		seedTooltip,
		widthTooltip
	} from '$ts/constants/tooltip';

	export let serverData: THomePageData;
	export let generationWidth = serverData.width !== null ? serverData.width : widthDefault;
	export let generationHeight = serverData.height !== null ? serverData.height : heightDefault;
	export let generationInferenceSteps =
		serverData.num_inference_steps !== null
			? serverData.num_inference_steps
			: inferenceStepsDefault;
	export let generationGuidanceScale =
		serverData.guidance_scale !== null ? serverData.guidance_scale : guidanceScaleDefault;
	export let generationSeed: number | undefined;
	export let promptInputValue: string | undefined;
	export let negativePromptInputValue: string | undefined;
	export let onCreate: () => Promise<void>;
	export let status: TStatus;
	export let startTimestamp: number | undefined;
	export let estimatedDuration: number;
	export { classes as class };
	let classes = '';

	if (serverData.seed !== null) {
		generationSeed = serverData.seed;
	} else if (serverData.prompt) {
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

	$: loadingOrSubmitting = status === 'loading' || submitting;
	$: sinceSec =
		now !== undefined && startTimestamp !== undefined ? (now - startTimestamp) / 1000 : 0;
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

	onMount(() => {
		isCheckComplete = false;
		if (serverData.width === null) {
			const widthIndex = widthTabs
				.map((w) => w.value)
				.findIndex((i) => i === $imageSize?.width?.toString());
			if (widthIndex >= 0) generationWidth = widthTabs[widthIndex].value;
		}
		if (serverData.height === null) {
			const heightIndex = heightTabs
				.map((h) => h.value)
				.findIndex((i) => i === $imageSize?.height?.toString());
			if (heightIndex >= 0) generationHeight = heightTabs[heightIndex].value;
		}
		if (serverData.num_inference_steps === null) {
			const inferenceStepsIndex = inferenceStepsTabs
				.map((i) => i.value)
				.findIndex((i) => i === $inferenceSteps?.toString());
			if (inferenceStepsIndex >= 0) {
				generationInferenceSteps = inferenceStepsTabs[inferenceStepsIndex].value;
			}
		}
		if (
			serverData.guidance_scale === null &&
			$guidanceScale >= guidanceScaleMin &&
			$guidanceScale <= guidanceScaleMax
		) {
			generationGuidanceScale = $guidanceScale;
		}
		if (
			serverData.seed === null &&
			serverData.prompt === null &&
			$seed !== undefined &&
			$seed !== null
		)
			generationSeed = $seed;
		if (serverData.prompt === null && $prompt) {
			promptInputValue = $prompt;
		}
		if (serverData.negative_prompt === null && serverData.prompt === null && $negativePrompt) {
			negativePromptInputValue = $negativePrompt;
		}
		isCheckComplete = true;
	});
</script>

<form
	bind:this={formElement}
	disabled={loadingOrSubmitting}
	on:submit|preventDefault={onSubmit}
	class="w-full max-w-xl md:max-w-6xl md:px-10 flex flex-col items-center pt-2px"
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
				disabled={loadingOrSubmitting}
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
		<Button disabled={loadingOrSubmitting} loading={loadingOrSubmitting} class="w-full md:w-40">
			{#if status === 'loading'}
				{Math.max(sinceSec, 0).toLocaleString('en-US', {
					minimumFractionDigits: 1,
					maximumFractionDigits: 1
				})}
			{:else}
				{$LL.Home.GenerateButton()}
			{/if}
		</Button>
	</div>
	<!-- Tab bars -->
	{#if status !== 'loading'}
		<div
			class="w-full flex flex-col justify-start items-center overflow-hidden px-4"
			transition:expandCollapse|local={{ duration: 300 }}
		>
			<div class="w-full flex flex-wrap items-start justify-center px-2px py-4 gap-4">
				<TabBar
					class="w-80 max-w-full"
					tabs={widthTabs}
					bind:value={generationWidth}
					name="width"
					hideSelected={!isCheckComplete}
				>
					<div
						slot="title"
						use:tooltip={$widthTooltip}
						class="py-2 px-4 flex items-center justify-center"
					>
						<IconWidth class="w-6 h-6 text-c-on-bg/25" />
					</div>
				</TabBar>
				<TabBar
					class="w-80 max-w-full"
					tabs={heightTabs}
					bind:value={generationHeight}
					name="height"
					hideSelected={!isCheckComplete}
				>
					<div
						slot="title"
						use:tooltip={$heightTooltip}
						class="py-2 px-4 flex items-center justify-center"
					>
						<IconHeight class="w-6 h-6 text-c-on-bg/25" />
					</div>
				</TabBar>
				{#if $advancedMode}
					<TabBar
						class="w-80 max-w-full"
						tabs={inferenceStepsTabs}
						bind:value={generationInferenceSteps}
						name="steps"
						hideSelected={!isCheckComplete}
					>
						<div
							slot="title"
							use:tooltip={$inferenceStepsTooltip}
							class="py-2 px-4 flex items-center justify-center"
						>
							<IconSteps class="w-6 h-6 text-c-on-bg/25" />
						</div>
					</TabBar>
					<TabLikeRangeInput
						class="w-80 max-w-full"
						bind:value={generationGuidanceScale}
						min={guidanceScaleMin}
						max={guidanceScaleMax}
					>
						<div
							slot="title"
							use:tooltip={$guidanceScaleTooltip}
							class="py-2 px-4 flex items-center justify-center"
						>
							<IconScale class="w-6 h-6 text-c-on-bg/25" />
						</div>
					</TabLikeRangeInput>
					{#if $currentServer.features?.includes('negative_prompt')}
						<TabLikeInput
							class="w-80 max-w-full"
							placeholder={$LL.Home.NegativePromptInput.Placeholder()}
							type="text"
							bind:value={negativePromptInputValue}
							max={maxPromptLength}
							{formElement}
						>
							<div
								slot="title"
								use:tooltip={$negativePromptTooltip}
								class="py-2 px-4 flex items-center justify-center"
							>
								<IconChatBubbleCancel class="w-6 h-6 text-c-on-bg/25" />
							</div>
						</TabLikeInput>
					{/if}
					<TabLikeInput
						class="w-80 max-w-full"
						placeholder={$LL.Home.SeedInput.Placeholder()}
						bind:value={generationSeed}
						type="number"
						max={maxSeed}
						{formElement}
					>
						<div
							slot="title"
							use:tooltip={$seedTooltip}
							class="py-2 px-4 flex items-center justify-center"
						>
							<IconSeed class="w-6 h-6 text-c-on-bg/25" />
						</div>
					</TabLikeInput>
				{/if}
			</div>
		</div>
	{/if}
	{#if loadingOrSubmitting}
		<div transition:expandCollapse|local={{ duration: 300 }} class="w-full h-[4vh]" />
	{/if}
</form>
