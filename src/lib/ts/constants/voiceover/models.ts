import LL from '$i18n/i18n-svelte';
import type { TVoiceoverLocale } from '$ts/constants/voiceover/locales';
import type { TTab } from '$ts/types/main';
import { derived, writable, type Readable } from 'svelte/store';

export const voiceoverModels = {
	'0f442a3e-cf53-490b-b4a9-b0dda63e9523': {
		name_in_worker: 'bark'
	}
};

export const voiceoverSpeakers: { [id: string]: TSpeaker } = {
	'0140c5dc-af12-4643-bfec-650d3cd03c56': {
		name_in_worker: 'v2/en_speaker_0',
		model_id: '0f442a3e-cf53-490b-b4a9-b0dda63e9523',
		locale: 'en'
	},
	'82bc1e69-2aa3-4317-9bc9-d9ed2afad0ff': {
		name_in_worker: 'v2/en_speaker_6',
		model_id: '0f442a3e-cf53-490b-b4a9-b0dda63e9523',
		locale: 'en'
	},
	'39f7fc5d-9031-4932-a4d5-b196bb06e203': {
		name_in_worker: 'v2/en_speaker_3',
		model_id: '0f442a3e-cf53-490b-b4a9-b0dda63e9523',
		locale: 'en'
	},
	'4a19f17c-eedc-4cf8-a45d-1f9d69547125': {
		name_in_worker: 'v2/en_speaker_9',
		model_id: '0f442a3e-cf53-490b-b4a9-b0dda63e9523',
		locale: 'en'
	},
	'5bd0610f-f073-487e-a74c-2a89105ce282': {
		name_in_worker: 'v2/tr_speaker_4',
		model_id: '0f442a3e-cf53-490b-b4a9-b0dda63e9523',
		locale: 'tr'
	},
	'7c3f8e30-9957-4d5e-a70e-c8269ff5f550': {
		name_in_worker: 'v2/tr_speaker_0',
		model_id: '0f442a3e-cf53-490b-b4a9-b0dda63e9523',
		locale: 'tr'
	}
};

export const voiceoverSpeakersArray = Object.keys(voiceoverSpeakers).map((k) => ({
	id: k,
	...voiceoverSpeakers[k]
}));

export const voiceoverModelIdDefault: TVoiceoverModelId = '0f442a3e-cf53-490b-b4a9-b0dda63e9523';
export const voiceoverSpeakerIdDefault: TVoiceoverSpeakerId =
	'82bc1e69-2aa3-4317-9bc9-d9ed2afad0ff';
export const voiceoverLocaleDefault: TVoiceoverLocale = 'en';

export const voiceoverLocale = writable<TVoiceoverLocale>(voiceoverLocaleDefault);
export const voiceoverModelId = writable<TVoiceoverModelId>(voiceoverModelIdDefault);

export const availableVoiceoverModelIds = Object.keys(voiceoverModels) as TVoiceoverModelId[];

export type TVoiceoverModelId = string;
export type TVoiceoverSpeakerId = string;

export const voiceoverModelIdToDisplayName = derived<
	[Readable<TranslationFunctions>],
	Record<TVoiceoverModelId, string>
>([LL], ([$LL]) => {
	let obj: Record<TVoiceoverModelId, string> = {};
	for (const modelId in voiceoverModels) {
		// @ts-ignore
		obj[modelId as TVoiceoverModelId] = $LL.Voiceover.ModelOptions[modelId].Name();
	}
	return obj;
});

export const voiceoverSpeakerIdToDisplayName = derived<
	[Readable<TranslationFunctions>],
	Record<TVoiceoverSpeakerId, string>
>([LL], ([$LL]) => {
	let obj: Record<TVoiceoverSpeakerId, string> = {};
	for (const speakerId in voiceoverSpeakers) {
		// @ts-ignore
		obj[speakerId as TVoiceoverModelId] = $LL.Voiceover.SpeakerOptions[speakerId].Name();
	}
	return obj;
});

export const voiceoverModelDropdownItems = derived(
	voiceoverModelIdToDisplayName,
	($modelIdToDisplayName) => {
		const items: TTab<TVoiceoverModelId>[] = [
			{
				label: $modelIdToDisplayName['0f442a3e-cf53-490b-b4a9-b0dda63e9523'],
				value: '0f442a3e-cf53-490b-b4a9-b0dda63e9523'
			}
		];
		return items;
	}
);

export const voiceoverSpeakerDropdownItems = derived(
	[voiceoverSpeakerIdToDisplayName, voiceoverModelId, voiceoverLocale],
	([$voiceoverSpeakerIdToDisplayName, $voiceoverModelId, $voiceoverLocale]) => {
		const items: TTab<TVoiceoverSpeakerId>[] = [
			{
				label: $voiceoverSpeakerIdToDisplayName['82bc1e69-2aa3-4317-9bc9-d9ed2afad0ff'],
				value: '82bc1e69-2aa3-4317-9bc9-d9ed2afad0ff'
			},
			{
				label: $voiceoverSpeakerIdToDisplayName['4a19f17c-eedc-4cf8-a45d-1f9d69547125'],
				value: '4a19f17c-eedc-4cf8-a45d-1f9d69547125'
			},
			{
				label: $voiceoverSpeakerIdToDisplayName['0140c5dc-af12-4643-bfec-650d3cd03c56'],
				value: '0140c5dc-af12-4643-bfec-650d3cd03c56'
			},
			{
				label: $voiceoverSpeakerIdToDisplayName['39f7fc5d-9031-4932-a4d5-b196bb06e203'],
				value: '39f7fc5d-9031-4932-a4d5-b196bb06e203'
			},
			{
				label: $voiceoverSpeakerIdToDisplayName['5bd0610f-f073-487e-a74c-2a89105ce282'],
				value: '5bd0610f-f073-487e-a74c-2a89105ce282'
			},
			{
				label: $voiceoverSpeakerIdToDisplayName['7c3f8e30-9957-4d5e-a70e-c8269ff5f550'],
				value: '7c3f8e30-9957-4d5e-a70e-c8269ff5f550'
			}
		];
		return items.filter(
			(item) =>
				voiceoverSpeakers[item.value].model_id === $voiceoverModelId &&
				voiceoverSpeakers[item.value].locale === $voiceoverLocale
		);
	}
);

interface TSpeaker {
	name_in_worker: string;
	model_id: TVoiceoverModelId;
	locale: TVoiceoverLocale;
}
