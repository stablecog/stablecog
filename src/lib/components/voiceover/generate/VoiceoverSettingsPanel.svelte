<script lang="ts">
	import SettingsPanelItem from '$components/generate/SettingsPanelItem.svelte';
	import SidebarWrapper from '$components/generate/SidebarWrapper.svelte';
	import IconDenoise from '$components/icons/IconDenoise.svelte';
	import IconLanguage from '$components/icons/IconLanguage.svelte';
	import IconLocale from '$components/icons/IconLocale.svelte';
	import IconMicrophone from '$components/icons/IconMicrophone.svelte';
	import IconRemoveSilence from '$components/icons/IconRemoveSilence.svelte';
	import IconUpscale from '$components/icons/IconUpscale.svelte';
	import IconSpeaker from '$components/icons/IconVoiceoverSpeaker.svelte';
	import IconWave from '$components/icons/IconWave.svelte';
	import TabLikeDropdown from '$components/tabBars/TabLikeDropdown.svelte';
	import TabLikeRangeInput from '$components/tabBars/TabLikeRangeInput.svelte';
	import TabLikeToggle from '$components/tabBars/TabLikeToggle.svelte';
	import LL from '$i18n/i18n-svelte';
	import {
		denoiseAudioTooltipSettingsPanel,
		removeSilenceTooltipSettingsPanel,
		voiceoverLanguageTooltipSettingsPanel,
		voiceoverSpeakerTooltipSettingsPanel,
		voiceStabilityTooltipSettingsPanel
	} from '$ts/constants/tooltips/voiceover';
	import { voiceoverLocaleDropdownItems } from '$ts/constants/voiceover/locales';
	import { voiceoverLocale, voiceoverSpeakerDropdownItems } from '$ts/constants/voiceover/models';
	import { voiceoverStabilityMax, voiceoverStabilityMin } from '$ts/constants/voiceover/rest';
	import {
		voiceoverDenoiseAudio,
		voiceoverRemoveSilence,
		voiceoverSpeakerId,
		voiceoverStability
	} from '$ts/stores/voiceover/voiceoverSettings';

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
			title={$LL.Voiceover.Settings.Speaker.Title()}
			icon={IconMicrophone}
			tooltipObj={$voiceoverSpeakerTooltipSettingsPanel}
		>
			<TabLikeDropdown
				name={$LL.Voiceover.Settings.Speaker.Title()}
				class="w-full"
				iconSet={IconSpeaker}
				iconSetClass="w-8 h-8 -m-2 mr-3 rounded-md"
				container={settingsContainer}
				containerTopMinDistance={containerDropdownPadding}
				containerBottomMinDistance={containerDropdownPadding}
				items={$voiceoverSpeakerDropdownItems}
				hasTitle={false}
				bind:value={$voiceoverSpeakerId}
			/>
		</SettingsPanelItem>
		<SettingsPanelItem
			title={$LL.Voiceover.Settings.Language.Title()}
			icon={IconLanguage}
			tooltipObj={$voiceoverLanguageTooltipSettingsPanel}
		>
			<TabLikeDropdown
				name={$LL.Voiceover.Settings.Language.Title()}
				class="w-full"
				iconSet={IconLocale}
				iconSetClass="w-8 h-8 -m-2 mr-3 rounded-md"
				container={settingsContainer}
				containerTopMinDistance={containerDropdownPadding}
				containerBottomMinDistance={containerDropdownPadding}
				items={$voiceoverLocaleDropdownItems}
				hasTitle={false}
				bind:value={$voiceoverLocale}
			/>
		</SettingsPanelItem>
		<SettingsPanelItem
			title={$LL.Voiceover.Settings.VoiceStability.Title()}
			icon={IconWave}
			tooltipObj={$voiceStabilityTooltipSettingsPanel}
		>
			<TabLikeRangeInput
				name={$LL.Voiceover.Settings.VoiceStability.Title()}
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
		<SettingsPanelItem
			title={$LL.Voiceover.Settings.RemoveSilence.Title()}
			icon={IconRemoveSilence}
			tooltipObj={$removeSilenceTooltipSettingsPanel}
		>
			<TabLikeToggle
				class="w-full"
				text={$voiceoverRemoveSilence ? $LL.Shared.On() : $LL.Shared.Off()}
				isToggled={$voiceoverRemoveSilence}
				onClick={() => {
					voiceoverRemoveSilence.set(!$voiceoverRemoveSilence);
				}}
			/>
		</SettingsPanelItem>
		<SettingsPanelItem
			title={$LL.Voiceover.Settings.DenoiseAudio.Title()}
			icon={IconDenoise}
			tooltipObj={$denoiseAudioTooltipSettingsPanel}
		>
			<TabLikeToggle
				class="w-full"
				text={$voiceoverDenoiseAudio ? $LL.Shared.On() : $LL.Shared.Off()}
				isToggled={$voiceoverDenoiseAudio}
				onClick={() => {
					voiceoverDenoiseAudio.set(!$voiceoverDenoiseAudio);
				}}
			/>
		</SettingsPanelItem>
	</div>
</SidebarWrapper>
