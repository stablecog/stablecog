<script lang="ts">
	import { browser } from '$app/environment';
	import { estimatedGenerationDurationMs } from '$components/generate/estimatedGenerationDurationMs';
	import {
		availableGenerationModelIds,
		generationModelIdDefault,
		generationModels
	} from '$ts/constants/generationModels';
	import {
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
		numOutputsDefault,
		numOutputsMax,
		numOutputsMin
	} from '$ts/constants/main';
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
	import type { TIsReadyMap } from '$components/generate/types';
	import { generations } from '$ts/stores/user/generation';
	import type { TCreatePageData } from '$routes/generate/+page.server';
	import { afterNavigate } from '$app/navigation';
	import type { TTab } from '$ts/types/main';

	export let serverData: TCreatePageData;
	export let isReadyMap: TIsReadyMap;

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

	$: $generationModelId, enforceSupportedSchedulerId();

	$: [$generationWidth, $generationHeight, $generationNumOutputs], setGenerationOnStage();

	$: isInferenceStepsValid = <T>(s: T) => {
		return Number(s) * Number($generationHeight) * Number($generationWidth) < maxProPixelSteps;
	};

	$: [$generationHeight, $generationWidth], adjustInferenceSteps();

	$: supportedSchedulerIdDropdownItems = $availableSchedulerIdDropdownItems.filter((i) =>
		generationModels[$generationModelId].supportedSchedulerIds.includes(i.value)
	);

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

	function enforceSupportedSchedulerId() {
		if (
			!browser ||
			generationModels[$generationModelId].supportedSchedulerIds.includes($generationSchedulerId)
		) {
			return;
		}
		generationSchedulerId.set(generationModels[$generationModelId].supportedSchedulerIds[0]);
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
		if (!isReadyMap.generationSettings) return;
		fn();
	}

	onMount(() => {
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
		isReadyMap.generationSettings = true;
	});

	afterNavigate(() => {
		if (serverData.negative_prompt !== null) {
			generationNegativePrompt.set(serverData.negative_prompt);
		}
		if (serverData.width !== null && isValue(serverData.width)) {
			generationWidth.set(serverData.width);
		}
		if (serverData.height !== null && isValue(serverData.height)) {
			generationHeight.set(serverData.height);
		}
		if (serverData.model_id !== null && isValue(serverData.model_id)) {
			generationModelId.set(serverData.model_id);
		}
		if (
			!isValue(serverData.width) &&
			!isValue(serverData.height) &&
			isValue(serverData.aspect_ratio) &&
			serverData.aspect_ratio !== null
		) {
			generationAspectRatio.set(serverData.aspect_ratio);
			setWidthAndHeightBasedOnAspectRatio();
		} else if (isValue(serverData.width) && isValue(serverData.height)) {
			const ratio = getAspectRatioFromWidthAndHeight(serverData.width, serverData.height);
			if (ratio) {
				generationAspectRatio.set(ratio);
			}
		}
		if (
			isValue(serverData.num_inference_steps) &&
			serverData.num_inference_steps !== null &&
			inferenceStepsTabs
				.map((i) => i.value)
				.findIndex((i) => i === serverData.num_inference_steps) >= 0
		) {
			generationInferenceSteps.set(serverData.num_inference_steps);
		}
		if (isValue(serverData.guidance_scale) && serverData.guidance_scale !== null) {
			generationGuidanceScale.set(serverData.guidance_scale);
		}
		if (isValue(serverData.scheduler_id) && serverData.scheduler_id !== null) {
			generationSchedulerId.set(serverData.scheduler_id);
		}
		if (isValue(serverData.seed) && serverData.seed !== null) {
			generationSeed.set(serverData.seed);
		}
		if (isValue(serverData.init_image_strength) && serverData.init_image_strength !== null) {
			generationInitImageStrength.set(serverData.init_image_strength);
		}
		if (isValue(serverData.num_outputs) && serverData.num_outputs !== null) {
			generationNumOutputs.set(serverData.num_outputs);
		}
		if (serverData.advanced_mode === true) {
			advancedModeApp.set(true);
		} else if (serverData.advanced_mode === false) {
			advancedModeApp.set(false);
		}
	});
</script>

<slot {isInferenceStepsValid} {supportedSchedulerIdDropdownItems} />
