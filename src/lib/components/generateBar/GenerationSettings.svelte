<script lang="ts">
	import NoBgButton from '$components/buttons/NoBgButton.svelte';
	import IconBrain from '$components/icons/IconBrain.svelte';
	import IconBubbles from '$components/icons/IconBubbles.svelte';
	import IconChatBubbleCancel from '$components/icons/IconChatBubbleCancel.svelte';
	import IconChevronDown from '$components/icons/IconChevronDown.svelte';
	import IconScale from '$components/icons/IconScale.svelte';
	import IconSeed from '$components/icons/IconSeed.svelte';
	import IconSteps from '$components/icons/IconSteps.svelte';
	import TabBar from '$components/tabBars/TabBar.svelte';
	import TabLikeDropdown from '$components/tabBars/TabLikeDropdown.svelte';
	import TabLikeInput from '$components/tabBars/TabLikeInput.svelte';
	import TabLikeRangeInput from '$components/tabBars/TabLikeRangeInput.svelte';
	import LL from '$i18n/i18n-svelte';
	import { tooltip } from '$ts/actions/tooltip';
	import {
		guidanceScaleMax,
		guidanceScaleMin,
		inferenceStepsTabs,
		maxProPixelSteps,
		maxPromptLength,
		maxSeed
	} from '$ts/constants/main';
	import { availableModelIdDropdownItems, generationModels } from '$ts/constants/generationModels';
	import {
		availableSchedulerIdDropdownItems,
		type TAvailableSchedulerId
	} from '$ts/constants/schedulers';
	import {
		guidanceScaleTooltip,
		inferenceStepsTooltip,
		modelTooltip,
		negativePromptTooltip,
		schedulerTooltip,
		seedTooltip,
		initImageTabBarTooltip,
		aspectRatioTooltip,
		initImageStrengthTabBarTooltip
	} from '$ts/constants/tooltips';
	import { logAdvancedMode } from '$ts/helpers/loggers';
	import { advancedMode, advancedModeApp } from '$ts/stores/advancedMode';
	import {
		generationAspectRatio,
		generationInitImageFilesState,
		generationGuidanceScale,
		generationHeight,
		generationInferenceSteps,
		generationModelId,
		generationSchedulerId,
		generationSeed,
		generationWidth,
		generationNegativePrompt
	} from '$ts/stores/generationSettings';
	import { isTouchscreen } from '$ts/stores/isTouchscreen';
	import type { TTab } from '$ts/types/main';
	import { userSummary } from '$ts/stores/user/summary';
	import { aspectRatioTabs } from '$ts/constants/generationSize';
	import { appVersion } from '$ts/stores/appVersion';
	import IconDimensions from '$components/icons/IconDimensions.svelte';
	import IconAspectRatio from '$components/icons/IconAspectRatio.svelte';
	import TabLikeInitImageUploader from '$components/tabBars/TabLikeInitImageUploader.svelte';
	import IconAddImage from '$components/icons/IconAddImage.svelte';
	import IconTickOnly from '$components/icons/IconTickOnly.svelte';
	import IconWarningOutline from '$components/icons/IconWarningOutline.svelte';
	import Morpher from '$components/Morpher.svelte';
	import Morpher3 from '$components/Morpher3.svelte';
	import IconAnimatedUploading from '$components/icons/IconAnimatedUploading.svelte';
	import { page } from '$app/stores';
	import { browser } from '$app/environment';

	export let isCheckComplete: boolean;
	export let formElement: HTMLFormElement;
	export let disabled = false;
	export let calculateDistance = true;
	export let container: HTMLDivElement | undefined = undefined;
	export let containerTopMinDistance = 0;
	export let containerBottomMinDistance = 0;
	export let openSignInModal: () => void;

	$: isInferenceStepsValid = <T>(s: T) => {
		return Number(s) * Number($generationHeight) * Number($generationWidth) < maxProPixelSteps;
	};

	$: [$generationHeight, $generationWidth], adjustInferenceSteps();

	const adjustInferenceSteps = () => {
		generationInferenceSteps.set(
			getValidValue($generationInferenceSteps, inferenceStepsTabs, isInferenceStepsValid)
		);
	};

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

	$: schedulerIdDropdownItems = $availableSchedulerIdDropdownItems.filter((i) =>
		generationModels[$generationModelId].supportedSchedulerIds.includes(i.value)
	);

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

	$: logProps = {
		'SC - User Id': $page.data.session?.user.id,
		'SC - Stripe Product Id': $userSummary?.product_id,
		'SC - App Version': $appVersion
	};
</script>

<div class="w-full flex flex-wrap items-start justify-center px-2px py-2 md:py-4 gap-3 md:gap-4">
	{#if $advancedModeApp}
		<TabLikeInput
			disabled={!isCheckComplete || disabled}
			class="w-full md:w-182 max-w-full order-1"
			placeholder={$LL.Home.NegativePromptInput.Placeholder()}
			type="text"
			bind:value={$generationNegativePrompt}
			max={maxPromptLength}
			{formElement}
		>
			<div
				slot="title"
				use:tooltip={$negativePromptTooltip}
				class="p-3.5 flex items-center justify-center"
			>
				<IconChatBubbleCancel class="w-6 h-6 text-c-on-bg/35" />
			</div>
		</TabLikeInput>
	{/if}
	<TabBar
		{disabled}
		class="w-full md:w-89 max-w-full relative {$advancedModeApp ? 'order-2' : 'order-1'}"
		vertical
		iconSet={IconAspectRatio}
		tabs={aspectRatioTabs}
		outline="bg-secondary"
		bind:value={$generationAspectRatio}
		name="Aspect Ratio"
		hideSelected={!isCheckComplete}
	>
		<div
			slot="title"
			use:tooltip={$aspectRatioTooltip}
			class="p-3.5 flex items-center justify-center"
		>
			<IconDimensions class="w-6 h-6 text-c-on-bg/35" />
		</div>
	</TabBar>
	<TabLikeInitImageUploader
		{openSignInModal}
		class="w-full md:w-89 max-w-full relative {$advancedModeApp ? 'order-2' : 'order-3'}"
	>
		<div
			slot="title"
			use:tooltip={$generationInitImageFilesState === 'idle'
				? $initImageTabBarTooltip
				: $initImageStrengthTabBarTooltip}
			class="p-3.5 flex items-center justify-center"
		>
			<Morpher morphed={$generationInitImageFilesState !== 'idle'}>
				<div slot="0" class="w-6 h-6">
					<IconAddImage class="w-6 h-6 text-c-on-bg/35" />
				</div>
				<div slot="1" class="w-6 h-6">
					<Morpher3
						class="w-full h-full"
						state={$generationInitImageFilesState === 'uploaded'
							? 1
							: $generationInitImageFilesState === 'error'
							? 2
							: 0}
					>
						<div class="w-full h-full" slot="0">
							<IconAnimatedUploading
								loading={$generationInitImageFilesState !== 'idle'}
								class="w-full h-full text-c-on-bg/35"
							/>
						</div>
						<div class="w-full h-full" slot="1">
							<IconTickOnly class="w-full h-full text-c-success/85" />
						</div>
						<div class="w-full h-full" slot="2">
							<IconWarningOutline class="w-full h-full text-c-danger/85" />
						</div>
					</Morpher3>
				</div>
			</Morpher>
		</div>
	</TabLikeInitImageUploader>
	<!-- 	<TabBar
		{disabled}
		class="w-full md:w-89 max-w-full order-2 relative"
		tabs={widthTabs}
		outline="bg-secondary"
		bind:value={$generationWidth}
		name="Width"
		hideSelected={!isCheckComplete}
	>
		<div slot="title" use:tooltip={$widthTooltip} class="p-3.5 flex items-center justify-center">
			<IconWidth class="w-6 h-6 text-c-on-bg/35" />
		</div>
	</TabBar>
	<TabBar
		{disabled}
		class="w-full md:w-89 max-w-full order-2 relative"
		tabs={heightTabs}
		outline="bg-secondary"
		bind:value={$generationHeight}
		name="Height"
		hideSelected={!isCheckComplete}
	>
		<div slot="title" use:tooltip={$heightTooltip} class="p-3.5 flex items-center justify-center">
			<IconHeight class="w-6 h-6 text-c-on-bg/35" />
		</div>
	</TabBar> -->

	<TabLikeDropdown
		class="w-full md:w-89 max-w-full {$advancedModeApp ? 'order-1' : 'order-3'}"
		{calculateDistance}
		{container}
		{containerTopMinDistance}
		{containerBottomMinDistance}
		bind:value={$generationModelId}
		{disabled}
		items={$availableModelIdDropdownItems}
		name="Model"
	>
		<div slot="title" use:tooltip={$modelTooltip} class="p-3.5 flex items-center justify-center">
			<IconBrain class="w-6 h-6 text-c-on-bg/35" />
		</div>
	</TabLikeDropdown>
	{#if $advancedModeApp}
		<TabLikeRangeInput
			name={$LL.Home.GuidanceScaleSlider.Title()}
			{disabled}
			class="w-full md:w-89 max-w-full order-2"
			bind:value={$generationGuidanceScale}
			min={guidanceScaleMin}
			max={guidanceScaleMax}
			step={1}
		>
			<div
				slot="title"
				use:tooltip={$guidanceScaleTooltip}
				class="p-3.5 flex items-center justify-center"
			>
				<IconScale class="w-6 h-6 text-c-on-bg/35" />
			</div>
		</TabLikeRangeInput>
		<div class="w-full md:w-89 max-w-full order-2 relative">
			<TabBar
				{disabled}
				class="w-full"
				tabs={inferenceStepsTabs}
				outline="bg-secondary"
				isValid={isInferenceStepsValid}
				bind:value={$generationInferenceSteps}
				name="Steps"
				hideSelected={!isCheckComplete}
			>
				<div
					slot="title"
					use:tooltip={$inferenceStepsTooltip}
					class="p-3.5 flex items-center justify-center"
				>
					<IconSteps class="w-6 h-6 text-c-on-bg/35" />
				</div>
			</TabBar>
		</div>
		<TabLikeDropdown
			class="w-full md:w-89 max-w-full order-2"
			{calculateDistance}
			{container}
			{containerTopMinDistance}
			{containerBottomMinDistance}
			{disabled}
			bind:value={$generationSchedulerId}
			items={schedulerIdDropdownItems}
			name="Scheduler"
		>
			<div
				slot="title"
				use:tooltip={$schedulerTooltip}
				class="p-3.5 flex items-center justify-center"
			>
				<IconBubbles class="w-6 h-6 text-c-on-bg/35" />
			</div>
		</TabLikeDropdown>
		<TabLikeInput
			disabled={!isCheckComplete || disabled}
			class="w-full md:w-89 max-w-full order-2"
			placeholder={$LL.Home.SeedInput.Placeholder()}
			bind:value={$generationSeed}
			type="number"
			max={maxSeed}
			{formElement}
		>
			<div slot="title" use:tooltip={$seedTooltip} class="p-3.5 flex items-center justify-center">
				<IconSeed class="w-6 h-6 text-c-on-bg/35" />
			</div>
		</TabLikeInput>
	{/if}
	<div class="w-full flex items-center justify-center order-last -mb-2 md:mb-0">
		<NoBgButton
			hoverFrom={$advancedModeApp ? 'bottom' : 'top'}
			onClick={() => {
				const val = !$advancedModeApp;
				logAdvancedMode(val === true ? 'On' : 'Off', logProps);
				advancedModeApp.set(val);
				advancedMode.set(val);
			}}
		>
			<div
				class="max-w-full min-w-0 overflow-hidden flex items-center gap-2 text-sm transition-none px-1"
			>
				<div
					class="-ml-1 w-5 h-5 flex-shrink-0 transform transition {$advancedModeApp
						? 'rotate-180'
						: 'rotate-0'}"
				>
					<IconChevronDown
						class="w-full h-full transition text-c-on-bg/40 {!$isTouchscreen
							? 'group-hover:text-c-primary'
							: ''}"
					/>
				</div>
				<p
					class="flex-shrink whitespace-nowrap overflow-hidden overflow-ellipsis text-c-on-bg/40 transition {!$isTouchscreen
						? 'group-hover:text-c-primary'
						: ''}"
				>
					{$advancedModeApp ? $LL.Shared.LessOptionsTitle() : $LL.Shared.MoreOptionsTitle()}
				</p>
			</div>
		</NoBgButton>
	</div>
</div>
