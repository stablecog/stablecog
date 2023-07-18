<script lang="ts">
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
	import { availableModelIdDropdownItems } from '$ts/constants/generationModels';
	import { aspectRatioDropdownItems } from '$ts/constants/generationSize';
	import {
		guidanceScaleMax,
		guidanceScaleMin,
		inferenceStepsTabs,
		maxPromptLength,
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
	} from '$ts/constants/tooltips/image';
	import {
		generationAspectRatio,
		generationGuidanceScale,
		generationInferenceSteps,
		generationModelId,
		generationNegativePrompt,
		generationNumOutputs,
		generationSchedulerId,
		generationSeed
	} from '$ts/stores/generationSettings';
	import { advancedModeApp } from '$ts/stores/advancedMode';
	import TabBar from '$components/tabBars/TabBar.svelte';
	import IconSteps from '$components/icons/IconSteps.svelte';
	import IconScale from '$components/icons/IconScale.svelte';
	import IconBubbles from '$components/icons/IconBubbles.svelte';
	import type { TTab } from '$ts/types/main';
	import IconChevronDown from '$components/icons/IconChevronDown.svelte';
	import { expandCollapse } from '$ts/animation/transitions';
	import { quadOut } from 'svelte/easing';
	import IconSeed from '$components/icons/IconSeed.svelte';
	import TabLikeInput from '$components/tabBars/TabLikeInput.svelte';
	import TabLikeInitImageUploader2 from '$components/tabBars/TabLikeInitImageUploader2.svelte';
	import SettingsPanelItem from '$components/generate/SettingsPanelItem.svelte';
	import IconAddImage from '$components/icons/IconAddImage.svelte';
	import type { TAvailableSchedulerId } from '$ts/constants/schedulers';
	import ModelCard from '$components/tabBars/ModelCard.svelte';
	import IconModelImage from '$components/icons/IconModelImage.svelte';

	export let rounding: 'all' | 'top' | 'bottom' = 'all';
	export let openSignInModal: () => void;
	export let noWrapper = false;
	export let isCheckCompleted: boolean;
	export let supportedSchedulerIdDropdownItems: TTab<TAvailableSchedulerId>[];
	export let isInferenceStepsValid: <T>(s: T) => boolean;

	let settingsContainer: HTMLDivElement;
	let containerDropdownPadding = 8;
</script>

<SidebarWrapper {rounding} {noWrapper} hasGradient>
	<div
		bind:this={settingsContainer}
		class="w-full h-full flex flex-col overflow-auto pt-4 md:pt-5 pb-[calc(7rem+env(safe-area-inset-bottom))] md:pb-32 gap-7"
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
				name={$LL.Home.ModelDropdown.Title()}
				iconSet={IconModelImage}
				iconSetClass="w-11 h-11 -mx-4 -my-5 mr-3 rounded-lg bg-c-bg-tertiary"
				listClass="w-full flex flex-wrap px-1 md:px-0 pt-[calc(0.375rem+2px)] pb-1.5"
				bind:value={$generationModelId}
				withFadedChevron
				let:item
				let:onClick
				let:isSelected
			>
				<ModelCard modelId={item.value} {onClick} {isSelected} />
			</TabLikeDropdown>
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
							bg-c-primary/10 not-touch:group-hover:translate-x-[-45%] not-touch:group-hover:opacity-100"
						/>
					</div>
				</div>
				<div
					class="flex-1 max-w-full min-w-0 flex items-center justify-start gap-3 overflow-hidden"
				>
					<IconChevronDown
						class="w-5 h-5 transform transition flex-shrink-0 text-c-on-bg/75
						not-touch:group-hover:text-c-primary {$advancedModeApp ? 'rotate-180' : ''}"
					/>
					<p
						class="flex-1 break-words min-w-0 overflow-hidden overflow-ellipsis text-left text-c-on-bg/75
						not-touch:group-hover:text-c-primary"
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
							class="flex-shrink-0 w-4 h-4 text-c-on-bg/50 transition 
							not-touch:group-hover:text-c-primary"
						/>
					</div>
				</div>
			</button>
			{#if $advancedModeApp}
				<div
					transition:expandCollapse={{ duration: 200, easing: quadOut }}
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
