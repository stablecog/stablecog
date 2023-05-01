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
	import SidebarWrapper from '$components/generate/SidebarWrapper.svelte';
	import { estimatedGenerationDurationMs } from '$components/generate/estimatedGenerationDurationMs';
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
		initImageTooltipSettingsPanel,
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
	import type { TIsReadyMap } from '$components/generate/types';
	import { generations } from '$ts/stores/user/generation';
	import TabLikeInitImageUploader2 from '$components/tabBars/TabLikeInitImageUploader2.svelte';
	import type { TCreatePageData } from '$routes/generate/+page.server';
	import SettingsPanelItem from '$components/generate/SettingsPanelItem.svelte';
	import IconAddImage from '$components/icons/IconAddImage.svelte';

	export let rounding: 'all' | 'top' | 'bottom' = 'all';
	export let serverData: TCreatePageData;
	export let isReadyMap: TIsReadyMap;
	export let openSignInModal: () => void;
	export let noWrapper = false;

	let settingsContainer: HTMLDivElement;
	let containerDropdownPadding = 16;
	let isCheckCompleted = false;

	$: generationNegativePrompt.set(
		serverData.negative_prompt !== null ? serverData.negative_prompt : undefined
	);
	$: generationWidth.set(
		isValue(serverData.width) && serverData.width !== null ? serverData.width : widthDefault
	);
	$: generationHeight.set(
		isValue(serverData.height) && serverData.height !== null && serverData
			? serverData.height
			: heightDefault
	);
	$: generationModelId.set(
		isValue(serverData.model_id) && serverData.model_id !== null
			? serverData.model_id
			: generationModelIdDefault
	);
	$: if (!isValue(serverData.width) && !isValue(serverData.height)) {
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
	$: generationInferenceSteps.set(
		isValue(serverData.num_inference_steps) &&
			serverData.num_inference_steps !== null &&
			inferenceStepsTabs
				.map((i) => i.value)
				.findIndex((i) => i === serverData.num_inference_steps) >= 0
			? serverData.num_inference_steps
			: inferenceStepsDefault
	);
	$: generationGuidanceScale.set(
		isValue(serverData.guidance_scale) && serverData.guidance_scale !== null
			? serverData.guidance_scale
			: guidanceScaleDefault
	);
	$: generationSchedulerId.set(
		isValue(serverData.scheduler_id) && serverData.scheduler_id !== null
			? serverData.scheduler_id
			: schedulerIdDefault
	);
	$: generationSeed.set(
		isValue(serverData.seed) && serverData.seed !== null ? serverData.seed : undefined
	);
	$: generationInitImageStrength.set(
		isValue(serverData.init_image_strength) && serverData.init_image_strength !== null
			? serverData.init_image_strength
			: initImageStrengthDefault
	);
	$: generationNumOutputs.set(
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

	$: [$generationWidth, $generationHeight, $generationNumOutputs], setGenerationOnStage();

	$: isInferenceStepsValid = <T>(s: T) => {
		return Number(s) * Number($generationHeight) * Number($generationWidth) < maxProPixelSteps;
	};

	$: [$generationHeight, $generationWidth], adjustInferenceSteps();
	$: supportedSchedulerIdDropdownItems = $availableSchedulerIdDropdownItems.filter((i) =>
		generationModels[$generationModelId].supportedSchedulerIds.includes(i.value)
	);
	$: $generationModelId, enforceSupportedSchedulerId();

	function setGenerationOnStage() {
		if ($generations && $generations[0] && $generations[0].status === 'pre-submit') {
			generations.update((generations) => {
				generations[0].width = Number($generationWidth);
				generations[0].height = Number($generationHeight);
				generations[0].num_outputs = Number($generationNumOutputs);
				generations[0].outputs = Array.from({ length: Number(generations[0].num_outputs) }).map(
					(i) => ({
						id: '',
						image_url: ''
					})
				);
				return generations;
			});
		}
	}

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

	const enforceSupportedSchedulerId = () => {
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
		if ($generationModelId === undefined) return;
		modelId.set($generationModelId);
		setLocalImageSizeBasedOnAspectRatio();
	}

	function setLocalNumOutputs() {
		if ($generationNumOutputs === undefined) return;
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
		if ($generationInferenceSteps === undefined) return;
		inferenceSteps.set($generationInferenceSteps);
	}

	function setLocalGuidanceScale() {
		if ($generationGuidanceScale === undefined) return;
		guidanceScale.set($generationGuidanceScale);
	}

	function setLocalSchedulerId() {
		if ($generationSchedulerId === undefined) return;
		schedulerId.set($generationSchedulerId);
	}

	function setLocalSeed() {
		if ($generationSeed === undefined) return;
		seed.set(typeof $generationSeed === 'number' ? $generationSeed : null);
	}

	function setLocalAdvancedMode() {
		if ($advancedModeApp === undefined) return;
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
		isReadyMap.generationSettings = true;
	});
</script>

<SidebarWrapper {rounding} {noWrapper}>
	<div
		bind:this={settingsContainer}
		class="w-full h-full flex flex-col overflow-auto pt-4 md:pt-5 pb-36 gap-7"
	>
		<SettingsPanelItem
			title={$LL.Home.AspectRatioDropdown.Title()}
			icon={IconDimensions}
			tooltipObj={$aspectRatioTooltipSettingsPanel}
		>
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
		</SettingsPanelItem>
		<SettingsPanelItem
			title={$LL.Home.ModelDropdown.Title()}
			icon={IconBrain}
			tooltipObj={$modelTooltipSettingsPanel}
		>
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
		</SettingsPanelItem>
		<SettingsPanelItem
			title={$LL.Home.ImageInput.Title()}
			icon={IconAddImage}
			tooltipObj={$initImageTooltipSettingsPanel}
		>
			<TabLikeInitImageUploader2 disabled={!isCheckCompleted} class="w-full" {openSignInModal} />
		</SettingsPanelItem>
		<SettingsPanelItem
			title={$LL.Home.NegativePromptInput.Title()}
			icon={IconChatBubbleCancel}
			tooltipObj={$negativePromptTooltipSettingsPanel}
		>
			<TabLikeTextArea
				max={maxPromptLength}
				placeholder={$LL.Home.NegativePromptInput.PlaceholderAlt()}
				class="w-full"
				bind:value={$generationNegativePrompt}
				hasTitle={false}
			/>
		</SettingsPanelItem>
		<SettingsPanelItem
			title={$LL.Home.NumOutputsSlider.Title()}
			icon={IconImage}
			tooltipObj={$numOutputsTooltipSettingsPanel}
		>
			<TabLikeRangeInput
				name={$LL.Home.NumOutputsSlider.Title()}
				hasTitle={false}
				disabled={!isCheckCompleted}
				class="w-full"
				min={numOutputsMin}
				max={numOutputsMax}
				valueSize="md"
				bind:value={$generationNumOutputs}
			/>
		</SettingsPanelItem>
		<div class="w-full flex flex-col ring-2 ring-c-bg-secondary">
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
				<div
					class="flex-1 max-w-full min-w-0 flex items-center justify-start gap-3 overflow-hidden"
				>
					<IconChevronDown
						class="w-5 h-5 transform transition flex-shrink-0 text-c-on-bg/75 {!$isTouchscreen
							? 'group-hover:text-c-primary'
							: ''} {$advancedModeApp ? 'rotate-180' : ''}"
					/>
					<p
						class="flex-1 break-words min-w-0 overflow-hidden overflow-ellipsis text-left text-c-on-bg/75 {!$isTouchscreen
							? 'group-hover:text-c-primary'
							: ''}"
					>
						{$LL.Shared.AdvancedSettingsButton()}
					</p>
				</div>
				<div class="flex-shrink-0">
					<div
						class="transform transition {$generationSeed !== null &&
						$generationSeed !== undefined &&
						!$advancedModeApp
							? 'scale-100 opacity-100'
							: 'scale-50 opacity-0'}"
					>
						<IconSeed
							class="flex-shrink-0 w-4 h-4 text-c-on-bg/50 transition {!$isTouchscreen
								? 'group-hover:text-c-primary'
								: ''}"
						/>
					</div>
				</div>
			</button>
			{#if $advancedModeApp}
				<div
					transition:expandCollapse|local={{ duration: 200, easing: quadOut }}
					class="w-full flex flex-col"
				>
					<div class="w-full pt-4 pb-6 flex flex-col gap-7">
						<SettingsPanelItem
							title={$LL.Home.GuidanceScaleSlider.Title()}
							icon={IconScale}
							tooltipObj={$guidanceScaleTooltipSettingsPanel}
						>
							<TabLikeRangeInput
								name={$LL.Home.GuidanceScaleSlider.Title()}
								class="w-full"
								hasTitle={false}
								min={guidanceScaleMin}
								max={guidanceScaleMax}
								valueSize="md"
								bind:value={$generationGuidanceScale}
							/>
						</SettingsPanelItem>
						<SettingsPanelItem
							title={$LL.Home.SchedulerDropdown.Title()}
							icon={IconBubbles}
							tooltipObj={$schedulerTooltipSettingsPanel}
						>
							<TabLikeDropdown
								class="w-full"
								container={settingsContainer}
								containerTopMinDistance={containerDropdownPadding}
								containerBottomMinDistance={containerDropdownPadding}
								items={supportedSchedulerIdDropdownItems}
								hasTitle={false}
								bind:value={$generationSchedulerId}
								name={$LL.Home.AspectRatioDropdown.Title()}
							/>
						</SettingsPanelItem>
						<SettingsPanelItem
							title={$LL.Home.InferenceStepsTabBar.Title()}
							icon={IconSteps}
							tooltipObj={$inferenceStepsTooltipSettingsPanel}
						>
							<TabBar
								class="w-full"
								isValid={isInferenceStepsValid}
								name={$LL.Home.InferenceStepsTabBar.Title()}
								bind:value={$generationInferenceSteps}
								hasTitle={false}
								tabs={inferenceStepsTabs}
							/>
						</SettingsPanelItem>
						<SettingsPanelItem
							title={$LL.Home.SeedInput.Title()}
							icon={IconSeed}
							tooltipObj={$seedTooltipSettingsPanel}
						>
							<TabLikeInput
								class="w-full"
								bind:value={$generationSeed}
								hasTitle={false}
								placeholder={$LL.Home.SeedInput.Placeholder()}
							/>
						</SettingsPanelItem>
					</div>
				</div>
			{/if}
		</div>
	</div>
</SidebarWrapper>
