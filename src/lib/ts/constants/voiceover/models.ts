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
	},
	'9354180b-9735-412c-947f-9d15af6edfe0': {
		name_in_worker: 'v2/ja_speaker_7',
		model_id: '0f442a3e-cf53-490b-b4a9-b0dda63e9523',
		locale: 'ja'
	},
	'bcb7ac57-fd61-4630-82f0-ae3f836bb7c2': {
		name_in_worker: 'v2/ja_speaker_2',
		model_id: '0f442a3e-cf53-490b-b4a9-b0dda63e9523',
		locale: 'ja'
	},
	'b7542bad-e5fc-4c02-89ce-0ec22f6deceb': {
		name_in_worker: 'v2/ja_speaker_0',
		model_id: '0f442a3e-cf53-490b-b4a9-b0dda63e9523',
		locale: 'ja'
	},
	'2cdb9e2c-42c1-49d0-959b-43d4bfc1828f': {
		name_in_worker: 'v2/ja_speaker_6',
		model_id: '0f442a3e-cf53-490b-b4a9-b0dda63e9523',
		locale: 'ja'
	},
	'37bb1326-d83e-425a-b21a-1a03ffea4d05': {
		name_in_worker: 'v2/ja_speaker_3',
		model_id: '0f442a3e-cf53-490b-b4a9-b0dda63e9523',
		locale: 'ja'
	},
	'1eca6e55-53fb-4d70-995f-7e4da9266574': {
		name_in_worker: 'v2/ja_speaker_4',
		model_id: '0f442a3e-cf53-490b-b4a9-b0dda63e9523',
		locale: 'ja'
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
			// en
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
			// tr
			{
				label: $voiceoverSpeakerIdToDisplayName['5bd0610f-f073-487e-a74c-2a89105ce282'],
				value: '5bd0610f-f073-487e-a74c-2a89105ce282'
			},
			{
				label: $voiceoverSpeakerIdToDisplayName['7c3f8e30-9957-4d5e-a70e-c8269ff5f550'],
				value: '7c3f8e30-9957-4d5e-a70e-c8269ff5f550'
			},
			// ja
			{
				label: $voiceoverSpeakerIdToDisplayName['9354180b-9735-412c-947f-9d15af6edfe0'],
				value: '9354180b-9735-412c-947f-9d15af6edfe0'
			},
			{
				label: $voiceoverSpeakerIdToDisplayName['bcb7ac57-fd61-4630-82f0-ae3f836bb7c2'],
				value: 'bcb7ac57-fd61-4630-82f0-ae3f836bb7c2'
			},
			{
				label: $voiceoverSpeakerIdToDisplayName['b7542bad-e5fc-4c02-89ce-0ec22f6deceb'],
				value: 'b7542bad-e5fc-4c02-89ce-0ec22f6deceb'
			},
			{
				label: $voiceoverSpeakerIdToDisplayName['2cdb9e2c-42c1-49d0-959b-43d4bfc1828f'],
				value: '2cdb9e2c-42c1-49d0-959b-43d4bfc1828f'
			},
			{
				label: $voiceoverSpeakerIdToDisplayName['37bb1326-d83e-425a-b21a-1a03ffea4d05'],
				value: '37bb1326-d83e-425a-b21a-1a03ffea4d05'
			},
			{
				label: $voiceoverSpeakerIdToDisplayName['1eca6e55-53fb-4d70-995f-7e4da9266574'],
				value: '1eca6e55-53fb-4d70-995f-7e4da9266574'
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
