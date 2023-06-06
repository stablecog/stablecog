import {
	voiceoverModelIdDefault,
	type TVoiceoverModelId,
	type TVoiceoverSpeakerId,
	voiceoverSpeakerIdDefault,
	voiceoverLocaleDefault
} from '$ts/constants/voiceover/models';
import { voiceoverStabilityDefault } from '$ts/constants/voiceover/rest';
import { writable } from 'svelte/store';
import { writable as writableLocal } from 'svelte-local-storage-store';
import type { TVoiceoverLocale } from '$ts/constants/voiceover/locales';

export const voiceoverPrompt = writable<string | null>(null);
export const voiceoverStability = writable<number>(voiceoverStabilityDefault);
export const voiceoverSpeakerId = writable<TVoiceoverSpeakerId>(voiceoverSpeakerIdDefault);
export const voiceoverSeed = writable<number | null>(null);

export const voiceoverPromptLocal = writableLocal<string | null>('voiceoverPrompt', null);
export const voiceoverStabilityLocal = writableLocal<number | null>(
	'voiceoverStability',
	voiceoverStabilityDefault
);
export const voiceoverModelIdLocal = writableLocal<TVoiceoverModelId>(
	'voiceoverModelId',
	voiceoverModelIdDefault
);
export const voiceoverSpeakerIdLocal = writableLocal<TVoiceoverSpeakerId>(
	'voiceoverSpeakerId',
	voiceoverSpeakerIdDefault
);
export const voiceoverSeedLocal = writableLocal<number | null>('voiceoverSeed', null);
export const voiceoverLocaleLocal = writableLocal<TVoiceoverLocale>(
	'voiceoverLocale',
	voiceoverLocaleDefault
);
