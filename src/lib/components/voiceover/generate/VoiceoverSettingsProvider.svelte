<script lang="ts">
	import {
		voiceoverLocale,
		voiceoverModelId,
		voiceoverSpeakerDropdownItems,
		voiceoverSpeakers,
		voiceoverSpeakersArray
	} from '$ts/constants/voiceover/models';
	import {
		voiceoverDenoiseAudio,
		voiceoverDenoiseAudioLocal,
		voiceoverLocaleLocal,
		voiceoverModelIdLocal,
		voiceoverRemoveSilence,
		voiceoverRemoveSilenceLocal,
		voiceoverSeed,
		voiceoverSeedLocal,
		voiceoverSpeakerId,
		voiceoverSpeakerIdLocal,
		voiceoverStability,
		voiceoverStabilityLocal
	} from '$ts/stores/voiceover/voiceoverSettings';
	import { onMount } from 'svelte';

	$: [$voiceoverModelId],
		withCheck(() => {
			voiceoverModelIdLocal.set($voiceoverModelId);
		});
	$: [$voiceoverSpeakerId],
		withCheck(() => {
			voiceoverSpeakerIdLocal.set($voiceoverSpeakerId);
		});
	$: [$voiceoverStability],
		withCheck(() => {
			voiceoverStabilityLocal.set($voiceoverStability);
		});
	$: [$voiceoverSeed],
		withCheck(() => {
			voiceoverSeedLocal.set($voiceoverSeed);
		});
	$: [$voiceoverLocale],
		withCheck(() => {
			if (voiceoverSpeakers[$voiceoverSpeakerId].locale !== $voiceoverLocale) {
				voiceoverSpeakerId.set($voiceoverSpeakerDropdownItems[0].value);
			}
			voiceoverLocaleLocal.set($voiceoverLocale);
		});
	$: [$voiceoverDenoiseAudio],
		withCheck(() => voiceoverDenoiseAudioLocal.set($voiceoverDenoiseAudio));
	$: [$voiceoverRemoveSilence],
		withCheck(() => voiceoverRemoveSilenceLocal.set($voiceoverRemoveSilence));

	function withCheck(fn: () => void) {
		if (!mounted) return;
		fn();
	}

	let mounted = false;
	onMount(() => {
		if ($voiceoverModelIdLocal !== null && $voiceoverModelIdLocal !== undefined) {
			voiceoverModelId.set($voiceoverModelIdLocal);
		}
		if ($voiceoverSpeakerIdLocal !== null && $voiceoverSpeakerIdLocal !== undefined) {
			voiceoverSpeakerId.set($voiceoverSpeakerIdLocal);
		}
		if ($voiceoverStabilityLocal !== null && $voiceoverStabilityLocal !== undefined) {
			voiceoverStability.set($voiceoverStabilityLocal);
		}
		if ($voiceoverSeedLocal !== null && $voiceoverSeedLocal !== undefined) {
			voiceoverSeed.set($voiceoverSeedLocal);
		}
		if ($voiceoverLocaleLocal !== null && $voiceoverLocaleLocal !== undefined) {
			voiceoverLocale.set($voiceoverLocaleLocal);
		}
		if ($voiceoverDenoiseAudioLocal !== null && $voiceoverDenoiseAudioLocal !== undefined) {
			voiceoverDenoiseAudio.set($voiceoverDenoiseAudioLocal);
		}
		if ($voiceoverRemoveSilenceLocal !== null && $voiceoverRemoveSilenceLocal !== undefined) {
			voiceoverRemoveSilence.set($voiceoverRemoveSilenceLocal);
		}
		mounted = true;
	});
</script>

<slot />
