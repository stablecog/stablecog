<script lang="ts">
	import Button from '$components/buttons/Button.svelte';
	import ClearButton from '$components/buttons/ClearButton.svelte';
	import type { THomePageData } from '$routes/+page.server';
	import { autoresize } from '$ts/actions/textarea/autoresize';
	import { expandCollapse } from '$ts/animation/transitions';
	import {
		availableHeightsFree,
		availableInferenceStepsFree,
		availableWidthsFree,
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
	import {
		guidanceScale,
		imageSize,
		inferenceSteps,
		negativePrompt,
		prompt,
		seed,
		modelId,
		schedulerId,
		generationWidth,
		generationHeight,
		generationInferenceSteps,
		generationGuidanceScale,
		generationModelId,
		generationSchedulerId,
		generationSeed,
		promptInputValue,
		negativePromptInputValue
	} from '$ts/stores/generationSettings';
	import type { TStatus } from '$ts/types/main';
	import { onMount, tick } from 'svelte';
	import LL, { locale } from '$i18n/i18n-svelte';
	import { isValue } from '$ts/helpers/isValue';
	import GenerationSettingsSheet from '$components/generateBar/GenerationSettingsSheet.svelte';
	import GenerationSettings from '$components/generateBar/GenerationSettings.svelte';
	import NoBgButton from '$components/buttons/NoBgButton.svelte';
	import IconGenerationSettings from '$components/icons/IconGenerationSettings.svelte';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import { advancedMode, advancedModeApp } from '$ts/stores/advancedMode';
	import { page } from '$app/stores';
	import { homePageContainer } from '$ts/stores/homePageContainer';
	import SignInCard from '$components/SignInCard.svelte';
	import { portal } from 'svelte-portal';
	import { clickoutside } from '$ts/actions/clickoutside';
	import { fade, fly } from 'svelte/transition';
	import { quadOut } from 'svelte/easing';
	import { browser } from '$app/environment';
	import { availableModelIds, modelIdDefault } from '$ts/constants/models';
	import { availableSchedulerIds, schedulerIdDefault } from '$ts/constants/schedulers';

	export let serverData: THomePageData;
	export let onCreate: () => Promise<void>;
	export let status: TStatus;
	export let startTimestamp: number | undefined;
	export let estimatedDuration: number;
	export { classes as class };
	let classes = '';

	promptInputValue.set(serverData.prompt !== null ? serverData.prompt : undefined);
	negativePromptInputValue.set(
		serverData.negative_prompt !== null ? serverData.negative_prompt : undefined
	);
	generationWidth.set(
		isValue(serverData.width) &&
			serverData.width !== null &&
			(availableWidthsFree.includes(serverData.width) ||
				($page.data.plan !== 'FREE' && $page.data.plan !== 'ANONYMOUS'))
			? serverData.width
			: widthDefault
	);
	generationHeight.set(
		isValue(serverData.height) &&
			serverData.height !== null &&
			serverData &&
			(availableHeightsFree.includes(serverData.height) ||
				($page.data.plan !== 'FREE' && $page.data.plan !== 'ANONYMOUS'))
			? serverData.height
			: heightDefault
	);
	generationInferenceSteps.set(
		isValue(serverData.num_inference_steps) &&
			serverData.num_inference_steps !== null &&
			inferenceStepsTabs
				.map((i) => i.value)
				.findIndex((i) => i === serverData.num_inference_steps) >= 0 &&
			(availableInferenceStepsFree.includes(serverData.num_inference_steps) ||
				($page.data.plan !== 'FREE' && $page.data.plan !== 'ANONYMOUS'))
			? serverData.num_inference_steps
			: inferenceStepsDefault
	);
	generationGuidanceScale.set(
		isValue(serverData.guidance_scale) && serverData.guidance_scale !== null
			? serverData.guidance_scale
			: guidanceScaleDefault
	);
	generationModelId.set(
		isValue(serverData.model_id) && serverData.model_id !== null
			? serverData.model_id
			: modelIdDefault
	);
	generationSchedulerId.set(
		isValue(serverData.scheduler_id) && serverData.scheduler_id !== null
			? serverData.scheduler_id
			: schedulerIdDefault
	);

	generationSeed.set(
		isValue(serverData.seed) && serverData.seed !== null ? serverData.seed : undefined
	);

	let submitting = false;
	$: placeholder = $LL.Home.PromptInput.Placeholder();
	let now: number | undefined;
	let nowInterval: NodeJS.Timeout | undefined;
	let promptInputElement: HTMLTextAreaElement;
	let formElement: HTMLFormElement;
	let isGenerationSettingsSheetOpen = false;
	let isSignInModalOpen = false;

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
		if (!$page.data.session?.user.id) {
			isSignInModalOpen = true;
			return;
		}
		if ($promptInputValue) {
			promptInputValue.set(formatPrompt($promptInputValue));
		}
		if ($negativePromptInputValue) {
			negativePromptInputValue.set(formatPrompt($negativePromptInputValue));
		}
		promptInputElement.scrollTo(0, 0);
		promptInputElement.blur();
		setTimeout(async () => {
			submitting = true;
			if (!$promptInputValue) {
				await new Promise((resolve) => setTimeout(resolve, 75));
				await tick();
				promptInputValue.set(placeholder);
			}
			await onCreate();
			submitting = false;
		});
	}

	let isCheckComplete = false;

	$: [$generationWidth, $generationHeight], setLocalImageSize();
	$: [$generationInferenceSteps], setLocalInferenceSteps();
	$: [$generationGuidanceScale], setLocalGuidanceScale();
	$: [$generationSeed], setLocalSeed();
	$: [$promptInputValue], setLocalPrompt();
	$: [$negativePromptInputValue], setLocalNegativePrompt();
	$: [$generationModelId], setLocalModelId();
	$: [$generationSchedulerId], setLocalSchedulerId();
	$: showClearPromptInputButton =
		$promptInputValue !== undefined && $promptInputValue !== '' && !loadingOrSubmitting;
	$: if (browser && $page.data.session?.user.id) {
		isSignInModalOpen = false;
	}

	const setLocalImageSize = () => {
		if (isCheckComplete) {
			imageSize.set({
				width: $generationWidth,
				height: $generationHeight
			});
		}
	};

	const setLocalInferenceSteps = () => {
		if (isCheckComplete) {
			inferenceSteps.set($generationInferenceSteps);
		}
	};

	const setLocalGuidanceScale = () => {
		if (isCheckComplete) {
			guidanceScale.set(Math.round($generationGuidanceScale));
		}
	};

	const setLocalSeed = () => {
		if (isCheckComplete) {
			if ($generationSeed !== undefined && $generationSeed !== null) {
				seed.set(parseInt($generationSeed.toString()));
			} else {
				localStorage.removeItem('seed');
			}
		}
	};

	const setLocalPrompt = () => {
		if (isCheckComplete) {
			prompt.set(
				$promptInputValue !== '' && $promptInputValue !== undefined ? $promptInputValue : ''
			);
		}
	};

	const setLocalNegativePrompt = () => {
		if (isCheckComplete) {
			negativePrompt.set(
				$negativePromptInputValue !== '' &&
					$negativePromptInputValue !== undefined &&
					$negativePromptInputValue !== null
					? $negativePromptInputValue
					: ''
			);
		}
	};

	const setLocalModelId = () => {
		if (isCheckComplete) {
			modelId.set($generationModelId);
		}
	};

	const setLocalSchedulerId = () => {
		if (isCheckComplete) {
			schedulerId.set($generationSchedulerId);
		}
	};

	const clearPrompt = () => {
		promptInputValue.set('');
		promptInputElement.value = '';
		promptInputElement.blur();
		promptInputElement.focus();
	};

	onMount(() => {
		isCheckComplete = false;
		if (!isValue(serverData.width)) {
			const widthIndex = widthTabs
				.map((w) => w.value)
				.findIndex((i) => i === $imageSize?.width?.toString());
			if (widthIndex >= 0) {
				generationWidth.set(widthTabs[widthIndex].value);
			}
		}
		if (!isValue(serverData.height)) {
			const heightIndex = heightTabs
				.map((h) => h.value)
				.findIndex((i) => i === $imageSize?.height?.toString());
			if (heightIndex >= 0) {
				generationHeight.set(heightTabs[heightIndex].value);
			}
		}
		if (!isValue(serverData.num_inference_steps)) {
			const inferenceStepsIndex = inferenceStepsTabs
				.map((i) => i.value)
				.findIndex((i) => i === $inferenceSteps?.toString());
			if (inferenceStepsIndex >= 0) {
				generationInferenceSteps.set(inferenceStepsTabs[inferenceStepsIndex].value);
			}
		}
		if (
			!isValue(serverData.guidance_scale) &&
			$guidanceScale >= guidanceScaleMin &&
			$guidanceScale <= guidanceScaleMax
		) {
			generationGuidanceScale.set($guidanceScale);
		}
		if (
			!isValue(serverData.seed) &&
			!isValue(serverData.prompt) &&
			$seed !== undefined &&
			$seed !== null
		) {
			generationSeed.set($seed);
		}
		if (!isValue(serverData.prompt) && isValue($prompt) && $prompt !== null) {
			promptInputValue.set($prompt);
		}
		if (
			!isValue(serverData.negative_prompt) &&
			!isValue(serverData.prompt) &&
			isValue($negativePrompt) &&
			$negativePrompt !== null
		) {
			negativePromptInputValue.set($negativePrompt);
		}
		if (
			!isValue(serverData.model_id) &&
			isValue($modelId) &&
			availableModelIds.includes($modelId)
		) {
			generationModelId.set($modelId);
		}
		if (
			!isValue(serverData.scheduler_id) &&
			isValue($schedulerId) &&
			availableSchedulerIds.includes($schedulerId)
		) {
			generationSchedulerId.set($schedulerId);
		}
		if (serverData.advanced_mode === true) {
			console.log('advanced mode server data true');
			advancedModeApp.set(true);
		} else if (serverData.advanced_mode === false) {
			console.log('advanced mode server data false');
			advancedModeApp.set(false);
		} else if (
			($advancedMode === true || $advancedMode === false) &&
			$advancedMode !== $advancedModeApp
		) {
			advancedModeApp.set($advancedMode);
		}
		isCheckComplete = true;
	});
</script>

<form
	bind:this={formElement}
	on:submit|preventDefault={onSubmit}
	class="w-full max-w-2xl md:max-w-6.5xl md:px-4 lg:px-12 flex flex-col items-center pt-2"
>
	<!-- Prompt bar -->
	<div class="w-full flex flex-col md:flex-row gap-3 items-center pb-2 px-4">
		<div class="w-full flex relative group">
			<textarea
				use:autoresize={{ maxRows: 3, placeholder }}
				bind:this={promptInputElement}
				bind:value={$promptInputValue}
				on:keypress={(e) => {
					if (e.key === 'Enter') {
						e.preventDefault();
						onSubmit();
					}
				}}
				on:input={() => {
					if (
						$promptInputValue !== undefined &&
						$promptInputValue !== null &&
						$promptInputValue.length > maxPromptLength
					) {
						promptInputValue.set($promptInputValue.slice(0, maxPromptLength));
					}
				}}
				disabled={loadingOrSubmitting || !isCheckComplete}
				{placeholder}
				rows="1"
				style="transition: height 0.1s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1), padding 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
				class="w-full bg-c-bg-secondary shadow-lg pr-12 md:pr-17 hide-scrollbar shadow-c-shadow/[var(--o-shadow-normal)] 
					scroll-smooth resize-none transition relative pl-5 md:pl-6 py-5 rounded-xl 
					focus:ring-2 focus:ring-c-primary/30 ring-0 ring-c-primary/20 placeholder:text-c-on-bg/30 {!$isTouchscreen
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
			class="w-full flex flex-col justify-start items-center px-4"
			transition:expandCollapse|local={{ duration: 300 }}
		>
			<div class="w-full hidden md:flex flex-col justify-start">
				<GenerationSettings
					calculateDistance={!isGenerationSettingsSheetOpen}
					container={$homePageContainer}
					containerTopMinDistance={12}
					containerBottomMinDistance={12}
					disabled={loadingOrSubmitting}
					{formElement}
					{isCheckComplete}
				/>
			</div>
			<div class="w-full flex flex-col md:hidden justify-start pt-2 items-center relative">
				<NoBgButton
					disabled={loadingOrSubmitting || isGenerationSettingsSheetOpen}
					onClick={() => (isGenerationSettingsSheetOpen = !isGenerationSettingsSheetOpen)}
				>
					<div
						class="flex justify-center items-center gap-2 px-4 py-0.5 flex-1 font-semibold overflow-hidden"
					>
						<IconGenerationSettings class="flex-shrink-0 -ml-0.5" />
						<p class="flex-shrink whitespace-nowrap overflow-hidden overflow-ellipsis">
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

<GenerationSettingsSheet
	disabled={!isGenerationSettingsSheetOpen || loadingOrSubmitting}
	bind:isGenerationSettingsSheetOpen
	{formElement}
	{isCheckComplete}
/>

{#if isSignInModalOpen && !$page.data.session?.user.id}
	<div
		use:portal={'body'}
		transition:fade|local={{ duration: 300, easing: quadOut }}
		class="w-full h-full bg-c-barrier/80 fixed left-0 top-0 px-3 z-[10000]"
	/>
	<div
		use:portal={'body'}
		transition:fly|local={{ duration: 200, y: 50, easing: quadOut }}
		class="w-full h-full flex flex-col items-center fixed left-0 top-0 px-3 py-20 z-[10001] overflow-auto"
	>
		<div
			use:clickoutside={{ callback: () => (isSignInModalOpen = false) }}
			class="w-full max-w-2xl flex justify-center my-auto"
		>
			<SignInCard isModal={true} redirectTo="/" />
		</div>
	</div>
{/if}
