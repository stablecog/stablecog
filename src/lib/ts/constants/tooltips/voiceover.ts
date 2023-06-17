import LL from '$i18n/i18n-svelte';
import type { TTooltipProps } from '$ts/actions/tooltip';
import { tooltipStylePropsSettingsPanel } from '$ts/constants/tooltips/shared';
import { derived, type Readable } from 'svelte/store';

export let voiceoverSpeakerTooltipSettingsPanel: Readable<TTooltipProps> = derived(LL, ($LL) => ({
	title: $LL.Voiceover.Settings.Speaker.Title(),
	description: $LL.Voiceover.Settings.Speaker.Paragraph(),
	...tooltipStylePropsSettingsPanel
}));

export let voiceoverLanguageTooltipSettingsPanel: Readable<TTooltipProps> = derived(LL, ($LL) => ({
	title: $LL.Voiceover.Settings.Language.Title(),
	description: $LL.Voiceover.Settings.Language.Paragraph(),
	...tooltipStylePropsSettingsPanel
}));

export let voiceStabilityTooltipSettingsPanel: Readable<TTooltipProps> = derived(LL, ($LL) => ({
	title: $LL.Voiceover.Settings.VoiceStability.Title(),
	description: $LL.Voiceover.Settings.VoiceStability.Paragraph(),
	...tooltipStylePropsSettingsPanel
}));

export let denoiseAudioTooltipSettingsPanel: Readable<TTooltipProps> = derived(LL, ($LL) => ({
	title: $LL.Voiceover.Settings.DenoiseAudio.Title(),
	description: $LL.Voiceover.Settings.DenoiseAudio.Paragraph(),
	...tooltipStylePropsSettingsPanel
}));

export let removeSilenceTooltipSettingsPanel: Readable<TTooltipProps> = derived(LL, ($LL) => ({
	title: $LL.Voiceover.Settings.RemoveSilence.Title(),
	description: $LL.Voiceover.Settings.RemoveSilence.Paragraph(),
	...tooltipStylePropsSettingsPanel
}));
