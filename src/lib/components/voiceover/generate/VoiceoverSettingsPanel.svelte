<script lang="ts">
	import SettingsPanelItem from '$components/generate/SettingsPanelItem.svelte';
	import SidebarWrapper from '$components/generate/SidebarWrapper.svelte';
	import IconLanguage from '$components/icons/IconLanguage.svelte';
	import IconLocale from '$components/icons/IconLocale.svelte';
	import IconMicrophone from '$components/icons/IconMicrophone.svelte';
	import IconSpeaker from '$components/icons/IconSpeaker.svelte';
	import IconWave from '$components/icons/IconWave.svelte';
	import TabLikeDropdown from '$components/tabBars/TabLikeDropdown.svelte';
	import TabLikeRangeInput from '$components/tabBars/TabLikeRangeInput.svelte';
	import { aspectRatioTooltipSettingsPanel } from '$ts/constants/tooltips';
	import { voiceoverLocaleDropdownItems } from '$ts/constants/voiceover/locales';
	import { voiceoverLocale, voiceoverSpeakerDropdownItems } from '$ts/constants/voiceover/models';
	import { voiceoverStabilityMax, voiceoverStabilityMin } from '$ts/constants/voiceover/rest';
	import { voiceoverSpeakerId, voiceoverStability } from '$ts/stores/voiceover/voiceoverSettings';

	export let rounding: 'all' | 'top' | 'bottom' = 'all';
	export let openSignInModal: () => void;
	export let noWrapper = false;
	export let isCheckCompleted: boolean;

	let settingsContainer: HTMLDivElement;
	let containerDropdownPadding = 16;
</script>

<SidebarWrapper {rounding} {noWrapper} hasGradient>
	<div
		bind:this={settingsContainer}
		class="w-full h-full flex flex-col overflow-auto pt-4 md:pt-5 pb-36 gap-7"
	>
		<SettingsPanelItem
			title={'Speaker'}
			icon={IconMicrophone}
			tooltipObj={$aspectRatioTooltipSettingsPanel}
		>
			<TabLikeDropdown
				class="w-full"
				iconSet={IconSpeaker}
				iconSetClass="w-8 h-8 -m-2 mr-3 rounded-md"
				container={settingsContainer}
				containerTopMinDistance={containerDropdownPadding}
				containerBottomMinDistance={containerDropdownPadding}
				items={$voiceoverSpeakerDropdownItems}
				hasTitle={false}
				bind:value={$voiceoverSpeakerId}
				name={'Speaker'}
			/>
		</SettingsPanelItem>
		<SettingsPanelItem
			title={'Language'}
			icon={IconLanguage}
			tooltipObj={$aspectRatioTooltipSettingsPanel}
		>
			<TabLikeDropdown
				class="w-full"
				iconSet={IconLocale}
				iconSetClass="w-8 h-8 -m-2 mr-3 rounded-md"
				container={settingsContainer}
				containerTopMinDistance={containerDropdownPadding}
				containerBottomMinDistance={containerDropdownPadding}
				items={$voiceoverLocaleDropdownItems}
				hasTitle={false}
				bind:value={$voiceoverLocale}
				name={'Language'}
			/>
		</SettingsPanelItem>
		<SettingsPanelItem
			title={'Voice Stability'}
			icon={IconWave}
			tooltipObj={$aspectRatioTooltipSettingsPanel}
		>
			<TabLikeRangeInput
				name={'Voice Stability'}
				hasTitle={false}
				disabled={!isCheckCompleted}
				class="w-full"
				min={voiceoverStabilityMin}
				max={voiceoverStabilityMax}
				step={10}
				valueSize="md"
				bind:value={$voiceoverStability}
				numeratorFormatter={(v) => `${v.toString()}%`}
			/>
		</SettingsPanelItem>
	</div>
</SidebarWrapper>
