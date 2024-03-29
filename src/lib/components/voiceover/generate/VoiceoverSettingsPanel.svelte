<script lang="ts">
	import SettingsPanelItem from '$components/generate/SettingsPanelItem.svelte';
	import SidebarWrapper from '$components/generate/SidebarWrapper.svelte';
	import IconDenoise from '$components/icons/IconDenoise.svelte';
	import IconLanguage from '$components/icons/IconLanguage.svelte';
	import IconLocale from '$components/icons/IconLocale.svelte';
	import IconMicrophone from '$components/icons/IconMicrophone.svelte';
	import IconRemoveSilence from '$components/icons/IconRemoveSilence.svelte';
	import IconSpeaker from '$components/icons/IconVoiceoverSpeaker.svelte';
	import IconWave from '$components/icons/IconWave.svelte';
	import TabLikeDropdown from '$components/primitives/tabBars/TabLikeDropdown.svelte';
	import TabLikeSliderInput from '$components/primitives/tabBars/TabLikeSliderInput.svelte';
	import TabLikeToggle from '$components/primitives/tabBars/TabLikeToggle.svelte';
	import LL from '$i18n/i18n-svelte';
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
	export let noWrapper = false;
	export let isCheckCompleted: boolean;

	let settingsContainer: HTMLDivElement;
	let containerDropdownPadding = 16;
</script>

<SidebarWrapper {rounding} {noWrapper} hasGradient>
	<div
		bind:this={settingsContainer}
		class="flex h-full w-full flex-col gap-7 overflow-auto pb-[calc(5.5rem+env(safe-area-inset-bottom))] pt-4 md:pb-32 md:pt-5"
	>
		<SettingsPanelItem
			title={$LL.Voiceover.Settings.Speaker.Title()}
			icon={IconMicrophone}
			tooltipTitle={$LL.Voiceover.Settings.Speaker.Title()}
			tooltipParagraph={$LL.Voiceover.Settings.Speaker.Paragraph()}
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
				bind:value={$voiceoverSpeakerId}
			/>
		</SettingsPanelItem>
		<SettingsPanelItem
			title={$LL.Voiceover.Settings.Language.Title()}
			icon={IconLanguage}
			tooltipTitle={$LL.Voiceover.Settings.Language.Title()}
			tooltipParagraph={$LL.Voiceover.Settings.Language.Paragraph()}
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
				bind:value={$voiceoverLocale}
			/>
		</SettingsPanelItem>
		<SettingsPanelItem
			title={$LL.Voiceover.Settings.VoiceStability.Title()}
			icon={IconWave}
			tooltipTitle={$LL.Voiceover.Settings.VoiceStability.Title()}
			tooltipParagraph={$LL.Voiceover.Settings.VoiceStability.Paragraph()}
		>
			<TabLikeSliderInput
				name={$LL.Voiceover.Settings.VoiceStability.Title()}
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
			tooltipTitle={$LL.Voiceover.Settings.RemoveSilence.Title()}
			tooltipParagraph={$LL.Voiceover.Settings.RemoveSilence.Paragraph()}
		>
			<TabLikeToggle
				class="w-full"
				text={$voiceoverRemoveSilence ? $LL.Shared.On() : $LL.Shared.Off()}
				bind:isToggled={$voiceoverRemoveSilence}
			/>
		</SettingsPanelItem>
		<SettingsPanelItem
			title={$LL.Voiceover.Settings.DenoiseAudio.Title()}
			icon={IconDenoise}
			tooltipTitle={$LL.Voiceover.Settings.DenoiseAudio.Title()}
			tooltipParagraph={$LL.Voiceover.Settings.DenoiseAudio.Paragraph()}
		>
			<TabLikeToggle
				class="w-full"
				text={$voiceoverDenoiseAudio ? $LL.Shared.On() : $LL.Shared.Off()}
				bind:isToggled={$voiceoverDenoiseAudio}
			/>
		</SettingsPanelItem>
	</div>
</SidebarWrapper>
