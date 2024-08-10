<script lang="ts">
	import { browser } from '$app/environment';
	import { afterNavigate } from '$app/navigation';
	import { estimatedGenerationDurationMs } from '$components/generate/estimatedGenerationDurationMs';
	import type { TIsReadyMap } from '$components/generate/types';
	import type { TGeneratePageData } from '$routes/(app)/generate/+page';
	import {
		availableGenerationModelIds,
		generationModelIdDefault,
		generationModels
	} from '$ts/constants/generationModels';
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
	import {
		guidanceScaleDefault,
		guidanceScaleMax,
		guidanceScaleMin,
		initImageStrengthDefault,
		initImageStrengthMax,
		initImageStrengthMin,
		numOutputsDefault,
		numOutputsMax,
		numOutputsMin
	} from '$ts/constants/main';
	import {
		availableSchedulerIdDropdownItems,
		availableSchedulerIds,
		schedulerIdDefault
	} from '$ts/constants/schedulers';
	import { isValue } from '$ts/helpers/isValue';
	import { advancedMode, advancedModeApp } from '$ts/stores/advancedMode';
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
		generationShouldSubmitToGallery,
		generationWidth,
		guidanceScale,
		imageSize,
		initImageStrength,
		modelId,
		negativePrompt,
		numOutputs,
		prompt,
		schedulerId,
		seed
	} from '$ts/stores/generationSettings';
	import { shouldSubmitToGallery } from '$ts/stores/shouldSubmitToGallery';
	import { generations } from '$ts/stores/user/generation';
	import { onMount } from 'svelte';

	export let serverData: TGeneratePageData;
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
	$: [$generationGuidanceScale], withCheck(setLocalGuidanceScale);
	$: [$generationSchedulerId], withCheck(setLocalSchedulerId);
	$: [$generationSeed], withCheck(setLocalSeed);
	$: [$advancedModeApp], withCheck(setLocalAdvancedMode);
	$: [$generationShouldSubmitToGallery], withCheck(setLocalShouldSubmitToGallery);

	$: [$generationWidth, $generationHeight, $generationNumOutputs, $generationCostCompletionPerMs],
		setEstimatedGenerationDuration();

	$: $generationModelId, enforceSupportedSchedulerId();

	$: [$generationAspectRatio, $generationNumOutputs], updateGenerationOnStage();

	$: supportedSchedulerIdDropdownItems = $availableSchedulerIdDropdownItems.filter((i) =>
		generationModels[$generationModelId].supportedSchedulerIds.includes(i.value)
	);

	function updateGenerationOnStage() {
		if ($generations && $generations[0] && $generations[0].status === 'pre-submit') {
			generations.update((generations) => {
				generations[0].width = Number($generationWidth);
				generations[0].height = Number($generationHeight);
				generations[0].num_outputs = Number($generationNumOutputs);
				generations[0].outputs = Array.from({ length: Number(generations[0].num_outputs) }).map(
					(i) => ({
						id: '',
						image_url: '',
						was_auto_submitted: false,
						is_public: false,
						like_count: 0
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

	function setLocalShouldSubmitToGallery() {
		if ($generationShouldSubmitToGallery === undefined) return;
		shouldSubmitToGallery.set($generationShouldSubmitToGallery);
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
		const shouldBeWidth =
			aspectRatioToImageSize?.[$generationAspectRatio]?.[$generationModelId]?.width !== undefined
				? aspectRatioToImageSize[$generationAspectRatio][$generationModelId].width
				: aspectRatioToImageSize[$generationAspectRatio].default.width;
		const shouldBeHeight =
			aspectRatioToImageSize?.[$generationAspectRatio]?.[$generationModelId]?.height !== undefined
				? aspectRatioToImageSize[$generationAspectRatio][$generationModelId].height
				: aspectRatioToImageSize[$generationAspectRatio].default.height;
		if (shouldBeWidth !== $generationWidth) {
			generationWidth.set(shouldBeWidth);
		}
		if (shouldBeHeight !== $generationHeight) {
			generationHeight.set(shouldBeHeight);
		}
		if (
			shouldBeWidth !== $imageSize.width ||
			shouldBeHeight !== $imageSize.height ||
			$generationAspectRatio !== $imageSize.aspectRatio
		) {
			imageSize.set({
				width: shouldBeWidth,
				height: shouldBeHeight,
				aspectRatio: $generationAspectRatio
			});
		}
		if ($shouldSubmitToGallery !== null) {
			generationShouldSubmitToGallery.set($shouldSubmitToGallery);
		}
		isReadyMap.generationSettings = true;
	});

	afterNavigate(() => {
		if (serverData.width !== null && isValue(serverData.width)) {
			generationWidth.set(serverData.width);
		}
		if (serverData.height !== null && isValue(serverData.height)) {
			generationHeight.set(serverData.height);
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
		if (serverData.negative_prompt !== null) {
			generationNegativePrompt.set(serverData.negative_prompt);
		}
		if (serverData.model_id !== null && isValue(serverData.model_id)) {
			generationModelId.set(serverData.model_id);
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

<slot {supportedSchedulerIdDropdownItems} />
