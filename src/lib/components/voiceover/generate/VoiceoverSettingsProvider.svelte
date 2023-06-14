<script lang="ts">
	import {
		voiceoverLocale,
		voiceoverModelId,
		voiceoverSpeakerDropdownItems,
		voiceoverSpeakers,
		voiceoverSpeakersArray
	} from '$ts/constants/voiceover/models';
	import {
		voiceoverLocaleLocal,
		voiceoverModelIdLocal,
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

	function withCheck(fn: () => void) {
		if (!mounted) return;
		fn();
	}

	let mounted = false;
	onMount(() => {
		if ($voiceoverModelIdLocal !== null) {
			voiceoverModelId.set($voiceoverModelIdLocal);
		}
		if ($voiceoverSpeakerIdLocal !== null) {
			voiceoverSpeakerId.set($voiceoverSpeakerIdLocal);
		}
		if ($voiceoverStabilityLocal !== null) {
			voiceoverStability.set($voiceoverStabilityLocal);
		}
		if ($voiceoverSeedLocal !== null) {
			voiceoverSeed.set($voiceoverSeedLocal);
		}
		if ($voiceoverLocaleLocal !== null) {
			voiceoverLocale.set($voiceoverLocaleLocal);
		}
		mounted = true;
	});
</script>

<slot />
