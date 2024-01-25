<script lang="ts">
	import IconAspectRatio from '$components/icons/IconAspectRatio.svelte';
	import TabLikeDropdown from '$components/primitives/tabBars/TabLikeDropdown.svelte';
	import TabLikeSliderInput from '$components/primitives/tabBars/TabLikeSliderInput.svelte';
	import TabLikeTextArea from '$components/primitives/tabBars/TabLikeTextArea.svelte';
	import LL from '$i18n/i18n-svelte';
	import SidebarWrapper from '$components/generate/SidebarWrapper.svelte';
	import { availableModelIdDropdownItems } from '$ts/constants/generationModels';
	import { aspectRatioDropdownItems } from '$ts/constants/generationSize';
	import {
		guidanceScaleHighThreshold,
		guidanceScaleLowThreshold,
		guidanceScaleMax,
		guidanceScaleMin,
		maxPromptLength,
		numOutputsMax,
		numOutputsMin
	} from '$ts/constants/main';
	import {
		generationAspectRatio,
		generationGuidanceScale,
		generationModelId,
		generationNegativePrompt,
		generationNumOutputs,
		generationSchedulerId,
		generationSeed,
		generationShouldSubmitToGallery
	} from '$ts/stores/generationSettings';
	import { advancedModeApp } from '$ts/stores/advancedMode';
	import type { TTab } from '$ts/types/main';
	import IconChevronDown from '$components/icons/IconChevronDown.svelte';
	import { expandCollapse } from '$ts/animation/transitions';
	import { quadOut } from 'svelte/easing';
	import IconSeed from '$components/icons/IconSeed.svelte';
	import TabLikeInput from '$components/primitives/tabBars/TabLikeInput.svelte';
	import TabLikeInitImageUploader2 from '$components/primitives/tabBars/TabLikeInitImageUploader2.svelte';
	import SettingsPanelItem from '$components/generate/SettingsPanelItem.svelte';
	import type { TAvailableSchedulerId } from '$ts/constants/schedulers';
	import ModelCard from '$components/cards/modelCard/ModelCard.svelte';
	import IconModelImage from '$components/cards/modelCard/IconModelImage.svelte';
	import TabLikeToggle from '$components/primitives/tabBars/TabLikeToggle.svelte';
	import { userSummary } from '$ts/stores/user/summary';
	import IconWarningOutline from '$components/icons/IconWarningOutline.svelte';
	import { scale } from 'svelte/transition';
	import WithTooltip from '$components/utils/WithTooltip.svelte';
	import IconStar from '$components/icons/IconStar.svelte';
	import { generateMode } from '$ts/stores/generate/generateMode';

	export let rounding: 'all' | 'top' | 'bottom' = 'all';
	export let openSignInModal: () => void;
	export let noWrapper = false;
	export let isCheckCompleted: boolean;
	export let supportedSchedulerIdDropdownItems: TTab<TAvailableSchedulerId>[];

	$: canToggleVisibility =
		$userSummary?.product_id !== undefined || $userSummary?.has_nonfree_credits === true;

	let settingsContainer: HTMLDivElement;
	let containerDropdownPadding = 16;
</script>

<SidebarWrapper {rounding} {noWrapper} hasGradient>
	<div
		bind:this={settingsContainer}
		class="w-full h-full flex flex-col overflow-auto pt-4 md:pt-5 pb-[calc(4rem+env(safe-area-inset-bottom))] md:pb-20 gap-7"
	>
		{#if $generateMode !== 'inpainting'}
			<SettingsPanelItem
				title={$LL.Home.AspectRatioDropdown.Title()}
				iconType="aspect-ratio"
				tooltipTitle={$LL.Home.AspectRatioTabBar.Title()}
				tooltipParagraph={$LL.Home.AspectRatioTabBar.Paragraph()}
			>
				<TabLikeDropdown
					class="w-full"
					iconSet={IconAspectRatio}
					container={settingsContainer}
					containerTopMinDistance={containerDropdownPadding}
					containerBottomMinDistance={containerDropdownPadding}
					items={$aspectRatioDropdownItems}
					bind:value={$generationAspectRatio}
					name={$LL.Home.AspectRatioDropdown.Title()}
				/>
			</SettingsPanelItem>
		{/if}
		<SettingsPanelItem
			title={$LL.Home.ModelDropdown.Title()}
			iconType="model"
			tooltipTitle={$LL.Home.ModelDropdown.Title()}
			tooltipParagraph={$LL.Home.ModelDropdown.Paragraph()}
		>
			<TabLikeDropdown
				class="w-full"
				container={settingsContainer}
				containerTopMinDistance={containerDropdownPadding}
				containerBottomMinDistance={containerDropdownPadding}
				items={$availableModelIdDropdownItems}
				name={$LL.Home.ModelDropdown.Title()}
				iconSet={IconModelImage}
				iconSetClass="w-11 h-11 -mx-4 -my-5 mr-3 rounded-lg bg-c-bg-tertiary"
				listClass="w-full flex flex-wrap px-1 md:px-0 pt-[calc(0.375rem+1px)] pb-1.25"
				bind:value={$generationModelId}
				let:item
				let:onClick
				let:isSelected
				let:isNew
			>
				<ModelCard modelId={item.value} {onClick} {isSelected} {isNew} />
			</TabLikeDropdown>
		</SettingsPanelItem>
		{#if $generateMode !== 'inpainting'}
			<SettingsPanelItem
				title={$LL.Home.ImageInput.Title()}
				iconType="upload-image"
				tooltipTitle={$LL.Home.ImageInput.Title()}
				tooltipParagraph={$LL.Home.InitialImageTabBar.Paragraph()}
			>
				<TabLikeInitImageUploader2 disabled={!isCheckCompleted} class="w-full" {openSignInModal} />
			</SettingsPanelItem>
		{/if}
		<SettingsPanelItem
			title={$LL.Home.NegativePromptInput.Title()}
			iconType="negative-prompt"
			tooltipTitle={$LL.Home.NegativePromptInput.Title()}
			tooltipParagraph={$LL.Home.NegativePromptInput.Paragraph()}
		>
			<TabLikeTextArea
				max={maxPromptLength}
				placeholder={$LL.Home.NegativePromptInput.PlaceholderAlt()}
				class="w-full"
				bind:value={$generationNegativePrompt}
				maxRows={4}
			/>
		</SettingsPanelItem>
		<SettingsPanelItem
			title={$LL.Home.NumOutputsSlider.Title()}
			iconType="number-of-images"
			tooltipTitle={$LL.Home.NumOutputsSlider.Title()}
			tooltipParagraph={$LL.Home.NumOutputsSlider.Paragraph()}
		>
			<TabLikeSliderInput
				name={$LL.Home.NumOutputsSlider.Title()}
				disabled={!isCheckCompleted}
				class="w-full"
				min={numOutputsMin}
				max={numOutputsMax}
				valueSize="md"
				bind:value={$generationNumOutputs}
			/>
		</SettingsPanelItem>
		<SettingsPanelItem
			title={$LL.Home.ShowOnProfileToggle.Title()}
			iconType="show-on-profile"
			tooltipTitle={$LL.Home.ShowOnProfileToggle.Title()}
			tooltipParagraph={$LL.Home.ShowOnProfileToggle.Paragraph()}
		>
			<WithTooltip
				let:trigger
				let:triggerStoreValue
				color="bg-tertiary"
				title={$LL.Shared.ProFeatures.SubscribeTitle()}
				titleIcon={IconStar}
				paragraph={$LL.Shared.ProFeatures.ChangeVisibilityFeatureParagraph()}
				buttonHref="/pricing"
				buttonText={$LL.Pricing.SubscribeButton()}
				isActive={!canToggleVisibility}
				overflowPadding={{ bottom: 100 }}
			>
				<div
					tabindex="-1"
					use:trigger
					{...triggerStoreValue}
					class="w-full {!canToggleVisibility ? 'cursor-not-allowed' : ''}"
				>
					<TabLikeToggle
						class="w-full {!canToggleVisibility ? 'pointer-events-none' : ''}"
						bind:isToggled={$generationShouldSubmitToGallery}
						disabled={!isCheckCompleted || !canToggleVisibility}
						disabledIsToggled={canToggleVisibility ? $generationShouldSubmitToGallery : true}
						text={canToggleVisibility
							? $generationShouldSubmitToGallery
								? $LL.Shared.On()
								: $LL.Shared.Off()
							: $LL.Shared.On()}
					/>
				</div>
			</WithTooltip>
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
						not-touch:group-hover:text-c-primary transition"
					>
						{$LL.Shared.AdvancedSettingsButton()}
					</p>
				</div>
				<div class="flex-shrink-0 flex items-center justify-end gap-1.5">
					{#if $generationGuidanceScale < guidanceScaleLowThreshold || $generationGuidanceScale > guidanceScaleHighThreshold}
						<div transition:scale={{ duration: 100, easing: quadOut, opacity: 0, start: 0.5 }}>
							<IconWarningOutline
								class="flex-shrink-0 w-5 h-5 text-c-on-bg/50 transition 
								not-touch:group-hover:text-c-primary"
							/>
						</div>
					{/if}
					{#if $generationSeed !== null && $generationSeed !== undefined}
						<div transition:scale={{ duration: 100, easing: quadOut, opacity: 0, start: 0.5 }}>
							<IconSeed
								class="flex-shrink-0 w-5 h-5 text-c-on-bg/50 transition 
								not-touch:group-hover:text-c-primary"
							/>
						</div>
					{/if}
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
							iconType="guidance-scale"
							tooltipTitle={$LL.Home.GuidanceScaleSlider.Title()}
							tooltipParagraph={$LL.Home.GuidanceScaleSlider.Paragraph()}
						>
							<TabLikeSliderInput
								name={$LL.Home.GuidanceScaleSlider.Title()}
								class="w-full"
								min={guidanceScaleMin}
								max={guidanceScaleMax}
								valueSize="md"
								bind:value={$generationGuidanceScale}
							/>
							{#if $generationGuidanceScale < guidanceScaleLowThreshold || $generationGuidanceScale > guidanceScaleHighThreshold}
								<div
									transition:expandCollapse={{ duration: 150 }}
									class="w-full flex flex-col justify-start"
								>
									<div class="w-full flex flex-col justify-start pt-3">
										<div
											class="w-full flex items-center justify-start px-3 py-2 text-sm
											bg-c-secondary/10 rounded-lg text-c-secondary gap-2"
										>
											<IconWarningOutline class="w-5 h-5 -ml-0.5 flex-shrink-0" />
											<p class="flex-shrink min-w-0">
												{$generationGuidanceScale < guidanceScaleLowThreshold
													? $LL.Home.GuidanceScaleSlider.Error.TooLow()
													: $LL.Home.GuidanceScaleSlider.Error.TooHigh()}
											</p>
										</div>
									</div>
								</div>
							{/if}
						</SettingsPanelItem>
						<SettingsPanelItem
							title={$LL.Home.SchedulerDropdown.Title()}
							iconType="scheduler"
							tooltipTitle={$LL.Home.SchedulerDropdown.Title()}
							tooltipParagraph={$LL.Home.SchedulerDropdown.Paragraph()}
						>
							<TabLikeDropdown
								class="w-full"
								container={settingsContainer}
								containerTopMinDistance={containerDropdownPadding}
								containerBottomMinDistance={containerDropdownPadding}
								items={supportedSchedulerIdDropdownItems}
								bind:value={$generationSchedulerId}
								name={$LL.Home.AspectRatioDropdown.Title()}
							/>
						</SettingsPanelItem>
						<SettingsPanelItem
							title={$LL.Home.SeedInput.Title()}
							iconType="seed"
							tooltipTitle={$LL.Home.SeedInput.Title()}
							tooltipParagraph={$LL.Home.SeedInput.Paragraph()}
						>
							<TabLikeInput
								name={$LL.Home.SeedInput.Title()}
								class="w-full"
								bind:value={$generationSeed}
								placeholder={$LL.Home.SeedInput.Placeholder()}
							/>
						</SettingsPanelItem>
					</div>
				</div>
			{/if}
		</div>
	</div>
</SidebarWrapper>
