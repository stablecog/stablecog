<script lang="ts">
	import { browser } from '$app/environment';
	import IconAspectRatio from '$components/icons/IconAspectRatio.svelte';
	import IconBrain from '$components/icons/IconBrain.svelte';
	import IconChatBubbleCancel from '$components/icons/IconChatBubbleCancel.svelte';
	import IconDimensions from '$components/icons/IconDimensions.svelte';
	import IconImage from '$components/icons/IconImage.svelte';
	import TabLikeDropdown from '$components/tabBars/TabLikeDropdown.svelte';
	import TabLikeRangeInput from '$components/tabBars/TabLikeRangeInput.svelte';
	import TabLikeTextArea from '$components/tabBars/TabLikeTextArea.svelte';
	import LL from '$i18n/i18n-svelte';
	import SidebarWrapper from '$routes/admin/create/SidebarWrapper.svelte';
	import { estimatedGenerationDurationMs } from '$routes/admin/create/estimatedGenerationDurationMs';
	import { tooltip } from '$ts/actions/tooltip';
	import {
		availableGenerationModelIds,
		availableModelIdDropdownItems,
		generationModelIdDefault,
		generationModels
	} from '$ts/constants/generationModels';
	import {
		aspectRatioDropdownItems,
		aspectRatioToImageSize,
		widthDefault,
		type TAvailableHeight,
		type TAvailableWidth,
		heightDefault,
		aspectRatioDefault,
		getAspectRatioFromWidthAndHeight,
		widthTabs,
		heightTabs,
		aspectRatioTabs
	} from '$ts/constants/generationSize';
	import {
		guidanceScaleDefault,
		guidanceScaleMax,
		guidanceScaleMin,
		inferenceStepsDefault,
		inferenceStepsTabs,
		initImageStrengthDefault,
		initImageStrengthMax,
		initImageStrengthMin,
		maxProPixelSteps,
		maxPromptLength,
		numOutputsDefault,
		numOutputsMax,
		numOutputsMin
	} from '$ts/constants/main';
	import {
		aspectRatioTooltipSettingsPanel,
		guidanceScaleTooltipSettingsPanel,
		inferenceStepsTooltipSettingsPanel,
		modelTooltipSettingsPanel,
		negativePromptTooltipSettingsPanel,
		numOutputsTooltipSettingsPanel,
		schedulerTooltipSettingsPanel,
		seedTooltipSettingsPanel
	} from '$ts/constants/tooltips';
	import { calculateGenerationCost, generationCostCompletionPerMs } from '$ts/stores/cost';
	import {
		generationAspectRatio,
		generationGuidanceScale,
		generationHeight,
		generationInferenceSteps,
		generationInitImageStrength,
		generationModelId,
		generationNegativePrompt,
		generationNumOutputs,
		generationPrompt,
		generationSchedulerId,
		generationSeed,
		generationWidth,
		guidanceScale,
		imageSize,
		inferenceSteps,
		initImageStrength,
		modelId,
		negativePrompt,
		numOutputs,
		prompt,
		schedulerId,
		seed
	} from '$ts/stores/generationSettings';
	import { onMount } from 'svelte';
	import type { TCreatePageData } from './proxy+page.server';
	import { isValue } from '$ts/helpers/isValue';
	import {
		availableSchedulerIdDropdownItems,
		availableSchedulerIds,
		schedulerIdDefault
	} from '$ts/constants/schedulers';
	import { advancedMode, advancedModeApp } from '$ts/stores/advancedMode';
	import TabBar from '$components/tabBars/TabBar.svelte';
	import IconSteps from '$components/icons/IconSteps.svelte';
	import IconScale from '$components/icons/IconScale.svelte';
	import IconBubbles from '$components/icons/IconBubbles.svelte';
	import type { TTab } from '$ts/types/main';
	import IconChevronDown from '$components/icons/IconChevronDown.svelte';
	import { expandCollapse } from '$ts/animation/transitions';
	import { quadOut } from 'svelte/easing';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import IconSeed from '$components/icons/IconSeed.svelte';
	import TabLikeInput from '$components/tabBars/TabLikeInput.svelte';

	export let rounding: 'all' | 'top' | 'bottom' = 'all';
	export let serverData: TCreatePageData;

	let settingsContainer: HTMLDivElement;
	let containerDropdownPadding = 16;
	let isCheckCompleted = false;

	generationNegativePrompt.set(
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
	generationNumOutputs.set(
		isValue(serverData.num_outputs) && serverData.num_outputs !== null
			? serverData.num_outputs
			: numOutputsDefault
	);

	$: [$generationModelId], withCheck(setLocalModelId);
	$: [$generationAspectRatio], withCheck(setLocalImageSizeBasedOnAspectRatio);
	$: [$generationNumOutputs], withCheck(setLocalNumOutputs);
	$: [$generationNegativePrompt], withCheck(setLocalNegativePrompt);
	$: [$generationInferenceSteps], withCheck(setLocalInferenceSteps);
	$: [$generationGuidanceScale], withCheck(setLocalGuidanceScale);
	$: [$generationSchedulerId], withCheck(setLocalSchedulerId);
	$: [$generationSeed], withCheck(setLocalSeed);
	$: [$advancedModeApp], withCheck(setLocalAdvancedMode);

	$: [
		$generationWidth,
		$generationHeight,
		$generationInferenceSteps,
		$generationNumOutputs,
		$generationCostCompletionPerMs
	],
		setEstimatedGenerationDuration();

	$: isInferenceStepsValid = <T>(s: T) => {
		return Number(s) * Number($generationHeight) * Number($generationWidth) < maxProPixelSteps;
	};

	$: [$generationHeight, $generationWidth], adjustInferenceSteps();

	function setEstimatedGenerationDuration() {
		if ($generationCostCompletionPerMs !== null) {
			const cost = calculateGenerationCost(
				Number($generationWidth),
				Number($generationHeight),
				Number($generationInferenceSteps),
				Number($generationNumOutputs)
			);
			estimatedGenerationDurationMs.set(cost / $generationCostCompletionPerMs);
		}
	}

	$: $generationModelId, adjustSchedulerId();

	const adjustSchedulerId = () => {
		if (
			!browser ||
			generationModels[$generationModelId].supportedSchedulerIds.includes($generationSchedulerId)
		) {
			return;
		}
		generationSchedulerId.set(generationModels[$generationModelId].supportedSchedulerIds[0]);
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

	function setLocalImageSizeBasedOnAspectRatio() {
		setWidthAndHeightBasedOnAspectRatio();
		imageSize.set({
			width: $generationWidth,
			height: $generationHeight,
			aspectRatio: $generationAspectRatio
		});
	}

	function setLocalModelId() {
		modelId.set($generationModelId);
		setLocalImageSizeBasedOnAspectRatio();
	}

	function setLocalNumOutputs() {
		numOutputs.set($generationNumOutputs);
	}

	function setLocalNegativePrompt() {
		negativePrompt.set(
			$generationNegativePrompt !== '' && $generationNegativePrompt !== undefined
				? $generationNegativePrompt
				: ''
		);
	}

	function setLocalInferenceSteps() {
		inferenceSteps.set($generationInferenceSteps);
	}

	function setLocalGuidanceScale() {
		guidanceScale.set($generationGuidanceScale);
	}

	function setLocalSchedulerId() {
		schedulerId.set($generationSchedulerId);
	}

	function setLocalSeed() {
		seed.set(typeof $generationSeed === 'number' ? $generationSeed : null);
	}

	function setLocalAdvancedMode() {
		advancedMode.set($advancedModeApp);
	}

	function withCheck(fn: () => void) {
		if (!isCheckCompleted) return;
		fn();
	}

	function adjustInferenceSteps() {
		generationInferenceSteps.set(
			getValidValue($generationInferenceSteps, inferenceStepsTabs, isInferenceStepsValid)
		);
	}

	function getValidValue<T>(value: T, tabs: TTab<T>[], isValid: (s: T) => boolean) {
		if (!isValid(value)) {
			const index = tabs.map((t) => t.value).indexOf(value);
			for (let i = index - 1; i >= 0; i--) {
				if (isValid(tabs[i].value)) {
					return tabs[i].value;
				}
			}
		}
		return value;
	}

	onMount(() => {
		isCheckCompleted = true;
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
			generationPrompt.set($prompt);
		}
		if (
			!isValue(serverData.negative_prompt) &&
			!isValue(serverData.prompt) &&
			isValue($negativePrompt) &&
			$negativePrompt !== null
		) {
			generationNegativePrompt.set($negativePrompt);
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
			advancedModeApp.set(true);
		} else if (serverData.advanced_mode === false) {
			advancedModeApp.set(false);
		} else if (
			($advancedMode === true || $advancedMode === false) &&
			$advancedMode !== $advancedModeApp
		) {
			advancedModeApp.set($advancedMode);
		}
		if (
			!isValue(serverData.num_outputs) &&
			$numOutputs >= numOutputsMin &&
			$numOutputs <= numOutputsMax
		) {
			generationNumOutputs.set($numOutputs);
		}
		setEstimatedGenerationDuration();
		isCheckCompleted = true;
	});
</script>

<SidebarWrapper {rounding}>
	<div
		bind:this={settingsContainer}
		class="w-full h-full flex flex-col overflow-auto px-3 md:px-4 pt-4 md:pt-5 pb-36 gap-7"
	>
		<div class="w-full flex flex-col items-start gap-3">
			<div
				use:tooltip={$aspectRatioTooltipSettingsPanel}
				class="max-w-full px-2 flex items-center text-c-on-bg/75 gap-2"
			>
				<IconDimensions class="w-5 h-5" />
				<p class="flex-shrink font-medium">{$LL.Home.AspectRatioDropdown.Title()}</p>
			</div>
			<TabLikeDropdown
				class="w-full"
				iconSet={IconAspectRatio}
				container={settingsContainer}
				containerTopMinDistance={containerDropdownPadding}
				containerBottomMinDistance={containerDropdownPadding}
				items={$aspectRatioDropdownItems}
				hasTitle={false}
				bind:value={$generationAspectRatio}
				name={$LL.Home.AspectRatioDropdown.Title()}
			/>
		</div>
		<div class="w-full flex flex-col items-start gap-3">
			<div
				use:tooltip={$modelTooltipSettingsPanel}
				class="max-w-full px-2 flex items-center text-c-on-bg/75 gap-2"
			>
				<IconBrain class="w-5 h-5" />
				<p class="flex-shrink font-medium">{$LL.Home.ModelDropdown.Title()}</p>
			</div>
			<TabLikeDropdown
				class="w-full"
				container={settingsContainer}
				containerTopMinDistance={containerDropdownPadding}
				containerBottomMinDistance={containerDropdownPadding}
				items={$availableModelIdDropdownItems}
				hasTitle={false}
				bind:value={$generationModelId}
				name="Model"
			/>
		</div>
		<div class="w-full flex flex-col items-start gap-3">
			<div
				use:tooltip={$numOutputsTooltipSettingsPanel}
				class="max-w-full px-2 flex items-center text-c-on-bg/75 gap-2"
			>
				<IconImage class="w-5 h-5" />
				<p class="flex-shrink font-medium">{$LL.Home.NumOutputsSlider.Title()}</p>
			</div>
			<TabLikeRangeInput
				hasTitle={false}
				disabled={!isCheckCompleted}
				class="w-full"
				min={1}
				max={4}
				valueSize="md"
				bind:value={$generationNumOutputs}
			/>
		</div>
		<div class="w-full flex flex-col items-start gap-3">
			<div
				use:tooltip={$negativePromptTooltipSettingsPanel}
				class="max-w-full px-2 flex items-center text-c-on-bg/75 gap-2"
			>
				<IconChatBubbleCancel class="w-5 h-5" />
				<p class="flex-shrink font-medium">{$LL.Home.NegativePromptInput.Title()}</p>
			</div>
			<TabLikeTextArea
				max={maxPromptLength}
				placeholder={$LL.Home.NegativePromptInput.PlaceholderAlt()}
				class="w-full"
				bind:value={$generationNegativePrompt}
				hasTitle={false}
			/>
		</div>
		<div class="w-[calc(100%+2rem)] flex flex-col ring-2 ring-c-bg-secondary -mx-4">
			<button
				class="w-full group font-medium text-c-on-bg/75 px-4 py-4.5 flex justify-start transition {$advancedModeApp
					? 'bg-c-bg-secondary'
					: 'bg-c-bg'}
					items-center gap-3 overflow-hidden relative z-0"
				on:click={() => advancedModeApp.set(!$advancedModeApp)}
			>
				<div class="w-full h-full absolute left-0 top-0 overflow-hidden z-0">
					<div class="w-[200%] h-full absolute left-0 top-0 flex items-center justify-center">
						<div
							class="w-full aspect-square origin-left rounded-full transition transform -translate-x-full opacity-0
							bg-c-primary/10 {!$isTouchscreen ? 'group-hover:translate-x-[-45%] group-hover:opacity-100' : ''}"
						/>
					</div>
				</div>
				<IconChevronDown
					class="w-5 h-5 transform transition flex-shrink-0 text-c-on-bg/75 {!$isTouchscreen
						? 'group-hover:text-c-primary'
						: ''} {$advancedModeApp ? 'rotate-180' : ''}"
				/>
				<p
					class="flex-1 flex min-w-0 text-c-on-bg/75 {!$isTouchscreen
						? 'group-hover:text-c-primary'
						: ''}"
				>
					{$LL.Shared.AdvancedSettingsButton()}
				</p>
			</button>
			{#if $advancedModeApp}
				<div
					transition:expandCollapse|local={{ duration: 200, easing: quadOut }}
					class="w-full flex flex-col"
				>
					<div class="w-full px-4 pt-4 pb-6 flex flex-col gap-7">
						<div class="w-full flex flex-col items-start gap-3">
							<div
								use:tooltip={$guidanceScaleTooltipSettingsPanel}
								class="max-w-full px-2 flex items-center text-c-on-bg/75 gap-2"
							>
								<IconScale class="w-5 h-5" />
								<p class="flex-shrink font-medium">{$LL.Home.GuidanceScaleSlider.Title()}</p>
							</div>
							<TabLikeRangeInput
								class="w-full"
								hasTitle={false}
								min={guidanceScaleMin}
								max={guidanceScaleMax}
								valueSize="md"
								bind:value={$generationGuidanceScale}
							/>
						</div>
						<div class="w-full flex flex-col items-start gap-3">
							<div
								use:tooltip={$schedulerTooltipSettingsPanel}
								class="max-w-full px-2 flex items-center text-c-on-bg/75 gap-2"
							>
								<IconBubbles class="w-5 h-5" />
								<p class="flex-shrink font-medium">{$LL.Home.SchedulerDropdown.Title()}</p>
							</div>
							<TabLikeDropdown
								class="w-full"
								container={settingsContainer}
								containerTopMinDistance={containerDropdownPadding}
								containerBottomMinDistance={containerDropdownPadding}
								items={$availableSchedulerIdDropdownItems}
								hasTitle={false}
								bind:value={$generationSchedulerId}
								name={$LL.Home.AspectRatioDropdown.Title()}
							/>
						</div>
						<div class="w-full flex flex-col items-start gap-3">
							<div
								use:tooltip={$inferenceStepsTooltipSettingsPanel}
								class="max-w-full px-2 flex items-center text-c-on-bg/75 gap-2"
							>
								<IconSteps class="w-5 h-5" />
								<p class="flex-shrink font-medium">{$LL.Home.InferenceStepsTabBar.Title()}</p>
							</div>
							<TabBar
								class="w-full"
								isValid={isInferenceStepsValid}
								name={$LL.Home.InferenceStepsTabBar.Title()}
								bind:value={$generationInferenceSteps}
								hasTitle={false}
								tabs={inferenceStepsTabs}
							/>
						</div>
						<div class="w-full flex flex-col items-start gap-3">
							<div
								use:tooltip={$seedTooltipSettingsPanel}
								class="max-w-full px-2 flex items-center text-c-on-bg/75 gap-2"
							>
								<IconSeed class="w-5 h-5" />
								<p class="flex-shrink font-medium">{$LL.Home.SeedInput.Title()}</p>
							</div>
							<TabLikeInput
								class="w-full"
								bind:value={$generationSeed}
								hasTitle={false}
								placeholder={$LL.Home.SeedInput.Placeholder()}
							/>
						</div>
					</div>
				</div>
			{/if}
		</div>
	</div>
</SidebarWrapper>
