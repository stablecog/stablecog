import {
	type TVoiceoverModelId,
	type TVoiceoverSpeakerId,
	voiceoverSpeakerIdDefault
} from '$ts/constants/voiceover/models';
import {
	voiceoverDenoiseAudioDefault,
	voiceoverRemoveSilenceDefault,
	voiceoverStabilityDefault
} from '$ts/constants/voiceover/rest';
import { writable } from 'svelte/store';
import { AvailableVoiceoverLocaleSchema } from '$ts/constants/voiceover/locales';
import { writableLocal } from '$ts/stores/writableLocal';
import { z } from 'zod';

export const voiceoverPrompt = writable<string | null>(null);
export const voiceoverStability = writable<number>(voiceoverStabilityDefault);
export const voiceoverSpeakerId = writable<TVoiceoverSpeakerId>(voiceoverSpeakerIdDefault);
export const voiceoverSeed = writable<number | null>(null);
export const voiceoverDenoiseAudio = writable<boolean>(voiceoverDenoiseAudioDefault);
export const voiceoverRemoveSilence = writable<boolean>(voiceoverRemoveSilenceDefault);

export const voiceoverPromptLocal = writableLocal({
	key: 'voiceoverPrompt',
	defaultValue: null,
	schema: z.string().nullable()
});
export const voiceoverStabilityLocal = writableLocal({
	key: 'voiceoverStability',
	defaultValue: voiceoverStabilityDefault,
	schema: z.number()
});
export const voiceoverModelIdLocal = writableLocal<TVoiceoverModelId | null>({
	key: 'voiceoverModelId',
	defaultValue: null,
	schema: z.string().nullable()
});
export const voiceoverSpeakerIdLocal = writableLocal<TVoiceoverSpeakerId | null>({
	key: 'voiceoverSpeakerId',
	defaultValue: null,
	schema: z.string().nullable()
});
export const voiceoverSeedLocal = writableLocal({
	key: 'voiceoverSeed',
	defaultValue: null,
	schema: z.number().nullable()
});
export const voiceoverLocaleLocal = writableLocal({
	key: 'voiceoverLocale',
	defaultValue: null,
	schema: AvailableVoiceoverLocaleSchema.nullable()
});
export const voiceoverDenoiseAudioLocal = writableLocal({
	key: 'voiceoverDenoiseAudio',
	defaultValue: null,
	schema: z.boolean().nullable()
});
export const voiceoverRemoveSilenceLocal = writableLocal({
	key: 'voiceoverRemoveSilence',
	defaultValue: null,
	schema: z.boolean().nullable()
});
