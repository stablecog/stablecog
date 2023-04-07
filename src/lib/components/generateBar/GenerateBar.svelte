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
		inferenceStepsDefault,
		inferenceStepsTabs,
		initImageStrengthDefault,
		initImageStrengthMax,
		initImageStrengthMin,
		maxPromptLength
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
		negativePromptInputValue,
		generationNumOutputs,
		generationAspectRatio,
		generationInitImageStrength,
		initImageStrength,
		generationInitImageFilesState
	} from '$ts/stores/generationSettings';
	import { onMount, tick } from 'svelte';
	import LL from '$i18n/i18n-svelte';
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
	import {
		availableGenerationModelIds,
		generationModelIdDefault,
		generationModels
	} from '$ts/constants/generationModels';
	import { availableSchedulerIds, schedulerIdDefault } from '$ts/constants/schedulers';
	import { generations } from '$userStores/generation';
	import { userSummary } from '$ts/stores/user/summary';
	import { calculateGenerationCost, generationCostCompletionPerMs } from '$ts/stores/cost';
	import InsufficientCreditsBadge from '$components/badges/InsufficientCreditsBadge.svelte';
	import {
		aspectRatioDefault,
		aspectRatioTabs,
		aspectRatioToImageSize,
		getAspectRatioFromWidthAndHeight,
		heightDefault,
		heightTabs,
		widthDefault,
		widthTabs,
		type TAvailableHeight,
		type TAvailableWidth
	} from '$ts/constants/generationSize';

	export let serverData: THomePageData;
	export let queueGeneration: () => Promise<void>;
	export { classes as class };
	let classes = '';
	let estimatedGenerationDurationSec: number;

	promptInputValue.set(serverData.prompt !== null ? serverData.prompt : undefined);
	negativePromptInputValue.set(
		serverData.negative_prompt !== null ? serverData.negative_prompt : undefined
	);
	generationWidth.set(
		isValue(serverData.width) && serverData.width !== null ? serverData.width : widthDefault
	);
	generationHeight.set(
		isValue(serverData.height) && serverData.height !== null && serverData
			? serverData.height
			: heightDefault
	);
	generationModelId.set(
		isValue(serverData.model_id) && serverData.model_id !== null
			? serverData.model_id
			: generationModelIdDefault
	);
	if (!isValue(serverData.width) && !isValue(serverData.height)) {
		generationAspectRatio.set(
			isValue(serverData.aspect_ratio) && serverData.aspect_ratio !== null
				? serverData.aspect_ratio
				: aspectRatioDefault
		);
		setWidthAndHeightBasedOnAspectRatio();
	} else if (isValue(serverData.width) && isValue(serverData.height)) {
		const ratio = getAspectRatioFromWidthAndHeight(serverData.width, serverData.height);
		if (ratio) {
			generationAspectRatio.set(ratio);
		}
	}
	generationInferenceSteps.set(
		isValue(serverData.num_inference_steps) &&
			serverData.num_inference_steps !== null &&
			inferenceStepsTabs
				.map((i) => i.value)
				.findIndex((i) => i === serverData.num_inference_steps) >= 0
			? serverData.num_inference_steps
			: inferenceStepsDefault
	);
	generationGuidanceScale.set(
		isValue(serverData.guidance_scale) && serverData.guidance_scale !== null
			? serverData.guidance_scale
			: guidanceScaleDefault
	);
	generationSchedulerId.set(
		isValue(serverData.scheduler_id) && serverData.scheduler_id !== null
			? serverData.scheduler_id
			: schedulerIdDefault
	);
	generationSeed.set(
		isValue(serverData.seed) && serverData.seed !== null ? serverData.seed : undefined
	);
	generationInitImageStrength.set(
		isValue(serverData.init_image_strength) && serverData.init_image_strength !== null
			? serverData.init_image_strength
			: initImageStrengthDefault
	);

	$: placeholder = $LL.Home.PromptInput.Placeholder();
	let promptInputElement: HTMLTextAreaElement;
	let formElement: HTMLFormElement;
	let isGenerationSettingsSheetOpen = false;
	let isSignInModalOpen = false;

	let lastGenerationStatus = $generations?.[0]?.status;
	let lastGenerationBeingProcessed =
		lastGenerationStatus === 'to-be-submitted' ||
		lastGenerationStatus === 'server-received' ||
		lastGenerationStatus === 'server-processing';
	$: lastGenerationStatus = $generations?.[0]?.status;
	$: lastGenerationBeingProcessed =
		lastGenerationStatus === 'to-be-submitted' ||
		lastGenerationStatus === 'server-received' ||
		lastGenerationStatus === 'server-processing';

	let isInitialCheck = true;
	let lastGenerationAnimationStatus:
		| 'idle'
		| 'should-animate-slow'
		| 'should-animate'
		| 'should-complete' = lastGenerationBeingProcessed ? 'should-animate' : 'idle';

	$: [lastGenerationStatus], onLastGenerationStatusChanged();

	async function onLastGenerationStatusChanged() {
		switch (lastGenerationStatus) {
			case 'to-be-submitted':
				lastGenerationAnimationStatus = 'idle';
				await tick();
				lastGenerationAnimationStatus = 'should-animate-slow';
				break;
			case 'server-received':
				await tick();
				lastGenerationAnimationStatus = 'should-animate-slow';
				break;
			case 'server-processing':
				await tick();
				lastGenerationAnimationStatus = 'should-animate';
				break;
			case 'succeeded':
				if (isInitialCheck) break;
				await tick();
				lastGenerationAnimationStatus = 'should-complete';
				break;
			case 'failed':
				if (isInitialCheck) break;
				await tick();
				lastGenerationAnimationStatus = 'should-complete';
				break;
		}
		isInitialCheck = false;
	}

	async function onSubmit() {
		if (!$page.data.session?.user.id) {
			openSignInModal();
			return;
		}
		if ($generationInitImageFilesState === 'uploading') {
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
			if (!$promptInputValue) {
				await new Promise((resolve) => setTimeout(resolve, 75));
				await tick();
				promptInputValue.set(placeholder);
			}
			await queueGeneration();
		});
	}

	function openSignInModal() {
		isSignInModalOpen = true;
	}

	let isCheckComplete = false;

	$: [$generationModelId], withCheck(setLocalModelId);
	$: [$generationWidth, $generationHeight], withCheck(setLocalImageSizeBasedOnWidthAndHeight);
	$: [$generationAspectRatio], withCheck(setLocalImageSizeBasedOnAspectRatio);
	$: [$generationInferenceSteps], withCheck(setLocalInferenceSteps);
	$: [$generationGuidanceScale], withCheck(setLocalGuidanceScale);
	$: [$generationSeed], withCheck(setLocalSeed);
	$: [$promptInputValue], withCheck(setLocalPrompt);
	$: [$negativePromptInputValue], withCheck(setLocalNegativePrompt);
	$: [$generationSchedulerId], withCheck(setLocalSchedulerId);
	$: [$generationInitImageStrength], withCheck(setLocalInitImageStrength);
	$: showClearPromptInputButton =
		$promptInputValue !== undefined && $promptInputValue !== '' && !lastGenerationBeingProcessed;
	$: if (browser && $page.data.session?.user.id) {
		isSignInModalOpen = false;
	}

	$: doesntHaveEnoughCredits =
		isCheckComplete &&
		$userSummary &&
		$userSummary.total_remaining_credits < Number($generationNumOutputs);

	const withCheck = (fn: () => void) => {
		if (!isCheckComplete) return;
		fn();
	};

	const setLocalImageSizeBasedOnWidthAndHeight = () => {
		imageSize.set({
			width: $generationWidth,
			height: $generationHeight,
			aspectRatio: $generationAspectRatio
		});
	};

	function setWidthAndHeightBasedOnAspectRatio() {
		const obj = aspectRatioToImageSize[$generationAspectRatio];
		let newWidth: TAvailableWidth;
		let newHeight: TAvailableHeight;
		const modelAspectRatio = obj[$generationModelId];
		if (modelAspectRatio) {
			newWidth = modelAspectRatio.width;
			newHeight = modelAspectRatio.height;
		} else {
			newWidth = obj.default.width;
			newHeight = obj.default.height;
		}
		generationWidth.set(newWidth);
		generationHeight.set(newHeight);
	}

	const setLocalImageSizeBasedOnAspectRatio = () => {
		setWidthAndHeightBasedOnAspectRatio();
		imageSize.set({
			width: $generationWidth,
			height: $generationHeight,
			aspectRatio: $generationAspectRatio
		});
	};

	const setLocalInferenceSteps = () => {
		inferenceSteps.set($generationInferenceSteps);
	};

	const setLocalGuidanceScale = () => {
		guidanceScale.set(Math.round($generationGuidanceScale));
	};

	const setLocalSeed = () => {
		if ($generationSeed !== undefined && $generationSeed !== null) {
			seed.set(parseInt($generationSeed.toString()));
		} else {
			localStorage.removeItem('seed');
		}
	};

	const setLocalPrompt = () => {
		prompt.set(
			$promptInputValue !== '' && $promptInputValue !== undefined ? $promptInputValue : ''
		);
	};

	const setLocalNegativePrompt = () => {
		negativePrompt.set(
			$negativePromptInputValue !== '' &&
				$negativePromptInputValue !== undefined &&
				$negativePromptInputValue !== null
				? $negativePromptInputValue
				: ''
		);
	};

	const setLocalModelId = () => {
		modelId.set($generationModelId);
		setLocalImageSizeBasedOnAspectRatio();
	};

	const setLocalSchedulerId = () => {
		schedulerId.set($generationSchedulerId);
	};

	const setLocalInitImageStrength = () => {
		initImageStrength.set($generationInitImageStrength);
	};

	const clearPrompt = () => {
		promptInputValue.set('');
		promptInputElement.value = '';
		promptInputElement.blur();
		promptInputElement.focus();
	};

	$: [
		$generationWidth,
		$generationHeight,
		$generationInferenceSteps,
		$generationNumOutputs,
		$generationCostCompletionPerMs
	],
		setEstimatedGenerationDuration();

	function setEstimatedGenerationDuration() {
		if ($generationCostCompletionPerMs !== null) {
			const cost = calculateGenerationCost(
				Number($generationWidth),
				Number($generationHeight),
				Number($generationInferenceSteps),
				Number($generationNumOutputs)
			);
			estimatedGenerationDurationSec = cost / $generationCostCompletionPerMs / 1000;
		}
	}

	onMount(() => {
		isCheckComplete = false;
		if (!isValue(serverData.width) && !isValue(serverData.aspect_ratio)) {
			const widthIndex = widthTabs
				.map((w) => w.value)
				.findIndex((i) => i === $imageSize?.width?.toString());
			if (widthIndex >= 0) {
				generationWidth.set(widthTabs[widthIndex].value);
			}
		}
		if (!isValue(serverData.height) && !isValue(serverData.aspect_ratio)) {
			const heightIndex = heightTabs
				.map((h) => h.value)
				.findIndex((i) => i === $imageSize?.height?.toString());
			if (heightIndex >= 0) {
				generationHeight.set(heightTabs[heightIndex].value);
			}
		}
		if (
			!isValue(serverData.height) &&
			!isValue(serverData.width) &&
			!isValue(serverData.aspect_ratio)
		) {
			const aspectRatioIndex = aspectRatioTabs
				.map((a) => a.value)
				.findIndex((i) => i === $imageSize?.aspectRatio?.toString());
			if (aspectRatioIndex >= 0) {
				generationAspectRatio.set(aspectRatioTabs[aspectRatioIndex].value);
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
			availableGenerationModelIds.includes($modelId)
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
		if (
			// @ts-ignore
			!generationModels[$generationModelId].supportedSchedulerIds.includes($generationSchedulerId)
		) {
			generationSchedulerId.set(generationModels[$generationModelId].supportedSchedulerIds[0]);
		}
		if (
			!isValue(serverData.init_image_strength) &&
			$initImageStrength >= initImageStrengthMin &&
			$initImageStrength <= initImageStrengthMax
		) {
			generationInitImageStrength.set($initImageStrength);
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
		setEstimatedGenerationDuration();
		isCheckComplete = true;
	});
</script>

<form
	bind:this={formElement}
	on:submit|preventDefault={onSubmit}
	class="w-full max-w-2xl md:max-w-6.5xl md:px-2 lg:px-12 flex flex-col items-center pt-2"
>
	<!-- Prompt bar -->
	<div class="w-full flex flex-col md:flex-row gap-3 items-center pb-2 px-2">
		<div class="w-full md:w-auto md:flex-1 flex relative group">
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
				disabled={lastGenerationBeingProcessed || !isCheckComplete}
				{placeholder}
				rows="1"
				style="transition: height 0.1s cubic-bezier(0.4, 0, 0.2, 1), box-shadow 0.2s cubic-bezier(0.4, 0, 0.2, 1), padding 0.2s cubic-bezier(0.4, 0, 0.2, 1)"
				class="w-full bg-c-bg-secondary shadow-lg pr-12 md:pr-17 hide-scrollbar shadow-c-shadow/[var(--o-shadow-normal)] 
					scroll-smooth resize-none transition relative pl-5 md:pl-6 py-5 rounded-xl 
					focus:ring-2 focus:ring-c-primary/30 ring-0 ring-c-primary/20 placeholder:text-c-on-bg/40 {!$isTouchscreen
					? 'enabled:hover:ring-2'
					: ''} {classes} {lastGenerationBeingProcessed
					? 'text-c-secondary/75'
					: 'text-c-on-bg'} {!$isTouchscreen && !lastGenerationBeingProcessed
					? 'group-hover:ring-2'
					: ''} {lastGenerationBeingProcessed ? 'overflow-hidden' : ''}"
			/>
			{#if lastGenerationBeingProcessed}
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
					style="transition-duration: {lastGenerationAnimationStatus === 'should-animate-slow'
						? estimatedGenerationDurationSec * 3
						: lastGenerationAnimationStatus === 'should-animate'
						? estimatedGenerationDurationSec
						: lastGenerationAnimationStatus === 'should-complete'
						? 0.3
						: 0}s"
					class="w-full h-full ease-image-generation transition bg-c-secondary/10 
					absolute left-0 top-0 rounded-xl {lastGenerationAnimationStatus === 'should-animate-slow'
						? '-translate-x-2/4'
						: lastGenerationAnimationStatus === 'should-animate'
						? 'translate-x-0'
						: lastGenerationAnimationStatus === 'should-complete'
						? 'translate-x-full'
						: '-translate-x-full'}"
				/>
			</div>
			<ClearButton show={showClearPromptInputButton} onClick={clearPrompt} />
		</div>
		<div class="w-full md:w-auto md:min-w-[9.5rem] relative">
			<Button
				disabled={!isCheckComplete ||
					(doesntHaveEnoughCredits && $page.data.session?.user.id !== undefined)}
				loading={lastGenerationBeingProcessed}
				uploading={$generationInitImageFilesState === 'uploading'}
				withSpinner
				fadeOnDisabled={isCheckComplete}
				class="w-full flex flex-col relative"
			>
				<p class={lastGenerationBeingProcessed ? 'opacity-0' : 'opacity-100'}>
					{$LL.Home.GenerateButton()}
				</p>
			</Button>
			{#if doesntHaveEnoughCredits && !lastGenerationBeingProcessed && $userSummary && $page.data.session?.user.id}
				<InsufficientCreditsBadge
					neededCredits={Number($generationNumOutputs)}
					remainingCredits={$userSummary.total_remaining_credits}
				/>
			{/if}
		</div>
	</div>
	<!-- Tab bars -->
	{#if !lastGenerationBeingProcessed}
		<div
			class="w-full flex flex-col justify-start items-center px-2"
			transition:expandCollapse|local={{ duration: 300 }}
		>
			<div class="w-full hidden md:flex flex-col justify-start">
				<GenerationSettings
					calculateDistance={!isGenerationSettingsSheetOpen}
					container={$homePageContainer}
					containerTopMinDistance={12}
					containerBottomMinDistance={12}
					disabled={lastGenerationBeingProcessed}
					{formElement}
					{openSignInModal}
					{isCheckComplete}
				/>
			</div>
			<div class="w-full flex flex-col md:hidden justify-start pt-2 items-center relative">
				<NoBgButton
					disabled={lastGenerationBeingProcessed || isGenerationSettingsSheetOpen}
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
	{#if lastGenerationBeingProcessed}
		<div transition:expandCollapse|local={{ duration: 300 }} class="w-full h-[2vh] md:h-[4vh]" />
	{/if}
</form>

<GenerationSettingsSheet
	disabled={!isGenerationSettingsSheetOpen || lastGenerationBeingProcessed}
	bind:isGenerationSettingsSheetOpen
	{formElement}
	{isCheckComplete}
	{openSignInModal}
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
			class="flex justify-center my-auto"
		>
			<SignInCard isModal={true} redirectTo="/" />
		</div>
	</div>
{/if}
