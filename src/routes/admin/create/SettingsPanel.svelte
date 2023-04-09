<script lang="ts">
	import { browser } from '$app/environment';
	import IconAspectRatio from '$components/icons/IconAspectRatio.svelte';
	import IconBrain from '$components/icons/IconBrain.svelte';
	import IconDimensions from '$components/icons/IconDimensions.svelte';
	import TabLikeDropdown from '$components/tabBars/TabLikeDropdown.svelte';
	import LL from '$i18n/i18n-svelte';
	import SidebarWrapper from '$routes/admin/create/SidebarWrapper.svelte';
	import { estimatedGenerationDurationMs } from '$routes/admin/create/estimatedGenerationDurationMs';
	import { tooltip } from '$ts/actions/tooltip';
	import { availableModelIdDropdownItems, generationModels } from '$ts/constants/generationModels';
	import {
		AspectRatioDropdownItems,
		aspectRatioToImageSize,
		type TAvailableHeight,
		type TAvailableWidth
	} from '$ts/constants/generationSize';
	import { aspectRatioTooltip, modelTooltip } from '$ts/constants/tooltips';
	import { calculateGenerationCost, generationCostCompletionPerMs } from '$ts/stores/cost';
	import {
		generationAspectRatio,
		generationHeight,
		generationInferenceSteps,
		generationModelId,
		generationNumOutputs,
		generationSchedulerId,
		generationWidth,
		imageSize,
		modelId,
		promptInputValue
	} from '$ts/stores/generationSettings';

	export let withCheck: (callback: () => void) => void;

	$: [$generationModelId], withCheck(setLocalModelId);
	$: [$generationAspectRatio], withCheck(setLocalImageSizeBasedOnAspectRatio);

	function onAspectRatioChanged() {
		setWidthAndHeightBasedOnAspectRatio();
	}

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
</script>

<SidebarWrapper>
	<div class="w-full h-full flex flex-col overflow-auto p-5 gap-7">
		<div class="w-full flex flex-col items-start gap-3">
			<div
				use:tooltip={$aspectRatioTooltip}
				class="max-w-full px-2 flex items-center text-c-on-bg/75 gap-2"
			>
				<IconDimensions class="w-5 h-5" />
				<p class="flex-shrink font-medium">{$LL.Home.AspectRatioTabBar.Title()}</p>
			</div>
			<TabLikeDropdown
				class="w-full"
				iconSet={IconAspectRatio}
				items={$AspectRatioDropdownItems}
				hasTitle={false}
				bind:value={$generationAspectRatio}
				name="Aspect Ratio"
			/>
		</div>
		<div class="w-full flex flex-col items-start gap-3">
			<div
				use:tooltip={$modelTooltip}
				class="max-w-full px-2 flex items-center text-c-on-bg/75 gap-2"
			>
				<IconBrain class="w-5 h-5" />
				<p class="flex-shrink font-medium">{$LL.Home.ModelDropdown.Title()}</p>
			</div>
			<TabLikeDropdown
				class="w-full"
				items={$availableModelIdDropdownItems}
				hasTitle={false}
				bind:value={$generationModelId}
				name="Model"
			/>
		</div>
	</div>
</SidebarWrapper>
