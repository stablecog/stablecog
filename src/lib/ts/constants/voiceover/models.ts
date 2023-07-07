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
	'aad61bf9-0710-40f6-8050-8c412852f717': {
		name_in_worker: 'v2/en_speaker_7',
		model_id: '0f442a3e-cf53-490b-b4a9-b0dda63e9523',
		locale: 'en'
	},
	'37c069ec-f124-4be8-9d4c-e74157738877': {
		name_in_worker: 'v2/en_speaker_4',
		model_id: '0f442a3e-cf53-490b-b4a9-b0dda63e9523',
		locale: 'en'
	},
	'38f9bd69-fa4c-4e53-b398-9a0f5865e927': {
		name_in_worker: 'v2/en_speaker_1',
		model_id: '0f442a3e-cf53-490b-b4a9-b0dda63e9523',
		locale: 'en'
	},
	'c161fde3-621f-44cd-b64d-60b00963ef37': {
		name_in_worker: 'c_en_0',
		model_id: '0f442a3e-cf53-490b-b4a9-b0dda63e9523',
		locale: 'en'
	},
	'2e4e9572-2ea6-48a3-b134-381c68c9d516': {
		name_in_worker: 'c_en_1',
		model_id: '0f442a3e-cf53-490b-b4a9-b0dda63e9523',
		locale: 'en'
	},
	'b8e5e45b-4fe3-4a0f-9fa6-5893c67287c0': {
		name_in_worker: 'c_en_2',
		model_id: '0f442a3e-cf53-490b-b4a9-b0dda63e9523',
		locale: 'en'
	},
	'2364bfb5-cdce-4a30-b979-a12f9f49cd39': {
		name_in_worker: 'c_en_3',
		model_id: '0f442a3e-cf53-490b-b4a9-b0dda63e9523',
		locale: 'en'
	},
	'55e8e18e-fcd7-4967-8734-672d2e173c23': {
		name_in_worker: 'c_en_4',
		model_id: '0f442a3e-cf53-490b-b4a9-b0dda63e9523',
		locale: 'en'
	},
	'91bf1331-a234-4478-a2a5-4dba4ac647fc': {
		name_in_worker: 'c_en_5',
		model_id: '0f442a3e-cf53-490b-b4a9-b0dda63e9523',
		locale: 'en'
	},
	'3aebf12b-a7b8-41cf-9411-5808a231138e': {
		name_in_worker: 'c_en_6',
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
	'0188871e-c4d1-4ad9-ab3d-ec958c443822': {
		name_in_worker: 'v2/tr_speaker_6',
		model_id: '0f442a3e-cf53-490b-b4a9-b0dda63e9523',
		locale: 'tr'
	},
	'4802af70-6d40-429d-8b9d-8df591e30743': {
		name_in_worker: 'v2/tr_speaker_5',
		model_id: '0f442a3e-cf53-490b-b4a9-b0dda63e9523',
		locale: 'tr'
	},
	'e10d4dac-7c39-4e96-9622-6d4e46fc384b': {
		name_in_worker: 'v2/tr_speaker_2',
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
	},
	'4f5c8c3e-0a17-4a68-8be7-1a126fda9a0f': {
		name_in_worker: 'v2/es_speaker_8',
		model_id: '0f442a3e-cf53-490b-b4a9-b0dda63e9523',
		locale: 'es'
	},
	'9206e75b-2b28-47f0-899e-76ab476e1c3f': {
		name_in_worker: 'v2/es_speaker_2',
		model_id: '0f442a3e-cf53-490b-b4a9-b0dda63e9523',
		locale: 'es'
	},
	'573c37c7-f741-4d36-80dc-f126131c6343': {
		name_in_worker: 'v2/es_speaker_9',
		model_id: '0f442a3e-cf53-490b-b4a9-b0dda63e9523',
		locale: 'es'
	},
	'b06d6333-1e35-45a6-b18b-3187d34cc387': {
		name_in_worker: 'v2/es_speaker_5',
		model_id: '0f442a3e-cf53-490b-b4a9-b0dda63e9523',
		locale: 'es'
	},
	'90ba9324-476b-48ae-b88e-aed1975a51fd': {
		name_in_worker: 'v2/es_speaker_4',
		model_id: '0f442a3e-cf53-490b-b4a9-b0dda63e9523',
		locale: 'es'
	},
	'babbbc15-5040-4e97-a89f-8309b13d7785': {
		name_in_worker: 'v2/es_speaker_8',
		model_id: '0f442a3e-cf53-490b-b4a9-b0dda63e9523',
		locale: 'de'
	},
	'cafafcaa-45bf-45e0-901c-8ca63575ad2a': {
		name_in_worker: 'v2/es_speaker_3',
		model_id: '0f442a3e-cf53-490b-b4a9-b0dda63e9523',
		locale: 'de'
	},
	'31d7c264-b674-422b-9b8f-13195c3289b6': {
		name_in_worker: 'v2/es_speaker_0',
		model_id: '0f442a3e-cf53-490b-b4a9-b0dda63e9523',
		locale: 'de'
	},
	'b349543b-c727-4934-9f4f-249aa2a6b184': {
		name_in_worker: 'v2/es_speaker_2',
		model_id: '0f442a3e-cf53-490b-b4a9-b0dda63e9523',
		locale: 'de'
	},
	'c4796108-0e8a-4a7a-9a8a-bb66ff21e215': {
		name_in_worker: 'v2/es_speaker_6',
		model_id: '0f442a3e-cf53-490b-b4a9-b0dda63e9523',
		locale: 'de'
	},
	'83c0ee48-c8ef-4a4c-bca8-9dae843d25da': {
		name_in_worker: 'v2/ru_speaker_3',
		model_id: '0f442a3e-cf53-490b-b4a9-b0dda63e9523',
		locale: 'ru'
	},
	'947786c1-810d-44ce-808f-cdcf732d97fd': {
		name_in_worker: 'v2/ru_speaker_6',
		model_id: '0f442a3e-cf53-490b-b4a9-b0dda63e9523',
		locale: 'ru'
	},
	'2885a060-badc-4896-a4fa-f3656a58bb82': {
		name_in_worker: 'v2/ru_speaker_2',
		model_id: '0f442a3e-cf53-490b-b4a9-b0dda63e9523',
		locale: 'ru'
	},
	'92929922-0608-4b62-8a0d-f9d87a4ca2f5': {
		name_in_worker: 'v2/ru_speaker_0',
		model_id: '0f442a3e-cf53-490b-b4a9-b0dda63e9523',
		locale: 'ru'
	},
	'cb8a2dc4-fce9-4f17-b977-050aa78d8101': {
		name_in_worker: 'v2/zh_speaker_8',
		model_id: '0f442a3e-cf53-490b-b4a9-b0dda63e9523',
		locale: 'zh'
	},
	'5001a3c9-557c-4775-ad6f-b71c47c3b4f1': {
		name_in_worker: 'v2/zh_speaker_9',
		model_id: '0f442a3e-cf53-490b-b4a9-b0dda63e9523',
		locale: 'zh'
	},
	'd45f479f-42e5-4f15-b1a0-c9feabcdb3aa': {
		name_in_worker: 'v2/zh_speaker_1',
		model_id: '0f442a3e-cf53-490b-b4a9-b0dda63e9523',
		locale: 'zh'
	},
	'56714211-532c-479b-ac8f-f2449af2310a': {
		name_in_worker: 'v2/zh_speaker_6',
		model_id: '0f442a3e-cf53-490b-b4a9-b0dda63e9523',
		locale: 'zh'
	},
	'052b721a-da7e-4614-b352-826411c262e2': {
		name_in_worker: 'v2/zh_speaker_2',
		model_id: '0f442a3e-cf53-490b-b4a9-b0dda63e9523',
		locale: 'zh'
	}
};

export const voiceoverSpeakersArray = Object.keys(voiceoverSpeakers).map((k) => ({
	id: k,
	...voiceoverSpeakers[k]
}));

export const voiceoverModelIdDefault: TVoiceoverModelId = '0f442a3e-cf53-490b-b4a9-b0dda63e9523';
export const voiceoverSpeakerIdDefault: TVoiceoverSpeakerId =
	'3aebf12b-a7b8-41cf-9411-5808a231138e';
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
				label: $voiceoverSpeakerIdToDisplayName['3aebf12b-a7b8-41cf-9411-5808a231138e'],
				value: '3aebf12b-a7b8-41cf-9411-5808a231138e'
			},
			{
				label: $voiceoverSpeakerIdToDisplayName['4a19f17c-eedc-4cf8-a45d-1f9d69547125'],
				value: '4a19f17c-eedc-4cf8-a45d-1f9d69547125'
			},
			{
				label: $voiceoverSpeakerIdToDisplayName['39f7fc5d-9031-4932-a4d5-b196bb06e203'],
				value: '39f7fc5d-9031-4932-a4d5-b196bb06e203'
			},
			{
				label: $voiceoverSpeakerIdToDisplayName['2e4e9572-2ea6-48a3-b134-381c68c9d516'],
				value: '2e4e9572-2ea6-48a3-b134-381c68c9d516'
			},
			{
				label: $voiceoverSpeakerIdToDisplayName['82bc1e69-2aa3-4317-9bc9-d9ed2afad0ff'],
				value: '82bc1e69-2aa3-4317-9bc9-d9ed2afad0ff'
			},
			{
				label: $voiceoverSpeakerIdToDisplayName['2364bfb5-cdce-4a30-b979-a12f9f49cd39'],
				value: '2364bfb5-cdce-4a30-b979-a12f9f49cd39'
			},
			{
				label: $voiceoverSpeakerIdToDisplayName['0140c5dc-af12-4643-bfec-650d3cd03c56'],
				value: '0140c5dc-af12-4643-bfec-650d3cd03c56'
			},
			{
				label: $voiceoverSpeakerIdToDisplayName['91bf1331-a234-4478-a2a5-4dba4ac647fc'],
				value: '91bf1331-a234-4478-a2a5-4dba4ac647fc'
			},
			{
				label: $voiceoverSpeakerIdToDisplayName['38f9bd69-fa4c-4e53-b398-9a0f5865e927'],
				value: '38f9bd69-fa4c-4e53-b398-9a0f5865e927'
			},
			{
				label: $voiceoverSpeakerIdToDisplayName['b8e5e45b-4fe3-4a0f-9fa6-5893c67287c0'],
				value: 'b8e5e45b-4fe3-4a0f-9fa6-5893c67287c0'
			},
			{
				label: $voiceoverSpeakerIdToDisplayName['aad61bf9-0710-40f6-8050-8c412852f717'],
				value: 'aad61bf9-0710-40f6-8050-8c412852f717'
			},
			// tr
			{
				label: $voiceoverSpeakerIdToDisplayName['7c3f8e30-9957-4d5e-a70e-c8269ff5f550'],
				value: '7c3f8e30-9957-4d5e-a70e-c8269ff5f550'
			},
			{
				label: $voiceoverSpeakerIdToDisplayName['5bd0610f-f073-487e-a74c-2a89105ce282'],
				value: '5bd0610f-f073-487e-a74c-2a89105ce282'
			},
			{
				label: $voiceoverSpeakerIdToDisplayName['0188871e-c4d1-4ad9-ab3d-ec958c443822'],
				value: '0188871e-c4d1-4ad9-ab3d-ec958c443822'
			},
			{
				label: $voiceoverSpeakerIdToDisplayName['4802af70-6d40-429d-8b9d-8df591e30743'],
				value: '4802af70-6d40-429d-8b9d-8df591e30743'
			},
			{
				label: $voiceoverSpeakerIdToDisplayName['e10d4dac-7c39-4e96-9622-6d4e46fc384b'],
				value: 'e10d4dac-7c39-4e96-9622-6d4e46fc384b'
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
			},
			// es
			{
				label: $voiceoverSpeakerIdToDisplayName['4f5c8c3e-0a17-4a68-8be7-1a126fda9a0f'],
				value: '4f5c8c3e-0a17-4a68-8be7-1a126fda9a0f'
			},
			{
				label: $voiceoverSpeakerIdToDisplayName['9206e75b-2b28-47f0-899e-76ab476e1c3f'],
				value: '9206e75b-2b28-47f0-899e-76ab476e1c3f'
			},
			{
				label: $voiceoverSpeakerIdToDisplayName['573c37c7-f741-4d36-80dc-f126131c6343'],
				value: '573c37c7-f741-4d36-80dc-f126131c6343'
			},
			{
				label: $voiceoverSpeakerIdToDisplayName['b06d6333-1e35-45a6-b18b-3187d34cc387'],
				value: 'b06d6333-1e35-45a6-b18b-3187d34cc387'
			},
			{
				label: $voiceoverSpeakerIdToDisplayName['90ba9324-476b-48ae-b88e-aed1975a51fd'],
				value: '90ba9324-476b-48ae-b88e-aed1975a51fd'
			},
			// de
			{
				label: $voiceoverSpeakerIdToDisplayName['babbbc15-5040-4e97-a89f-8309b13d7785'],
				value: 'babbbc15-5040-4e97-a89f-8309b13d7785'
			},
			{
				label: $voiceoverSpeakerIdToDisplayName['31d7c264-b674-422b-9b8f-13195c3289b6'],
				value: '31d7c264-b674-422b-9b8f-13195c3289b6'
			},
			{
				label: $voiceoverSpeakerIdToDisplayName['cafafcaa-45bf-45e0-901c-8ca63575ad2a'],
				value: 'cafafcaa-45bf-45e0-901c-8ca63575ad2a'
			},
			{
				label: $voiceoverSpeakerIdToDisplayName['b349543b-c727-4934-9f4f-249aa2a6b184'],
				value: 'b349543b-c727-4934-9f4f-249aa2a6b184'
			},
			{
				label: $voiceoverSpeakerIdToDisplayName['c4796108-0e8a-4a7a-9a8a-bb66ff21e215'],
				value: 'c4796108-0e8a-4a7a-9a8a-bb66ff21e215'
			},
			// ru
			{
				label: $voiceoverSpeakerIdToDisplayName['2885a060-badc-4896-a4fa-f3656a58bb82'],
				value: '2885a060-badc-4896-a4fa-f3656a58bb82'
			},
			{
				label: $voiceoverSpeakerIdToDisplayName['947786c1-810d-44ce-808f-cdcf732d97fd'],
				value: '947786c1-810d-44ce-808f-cdcf732d97fd'
			},
			{
				label: $voiceoverSpeakerIdToDisplayName['92929922-0608-4b62-8a0d-f9d87a4ca2f5'],
				value: '92929922-0608-4b62-8a0d-f9d87a4ca2f5'
			},
			{
				label: $voiceoverSpeakerIdToDisplayName['83c0ee48-c8ef-4a4c-bca8-9dae843d25da'],
				value: '83c0ee48-c8ef-4a4c-bca8-9dae843d25da'
			},
			// zh
			{
				label: $voiceoverSpeakerIdToDisplayName['cb8a2dc4-fce9-4f17-b977-050aa78d8101'],
				value: 'cb8a2dc4-fce9-4f17-b977-050aa78d8101'
			},
			{
				label: $voiceoverSpeakerIdToDisplayName['5001a3c9-557c-4775-ad6f-b71c47c3b4f1'],
				value: '5001a3c9-557c-4775-ad6f-b71c47c3b4f1'
			},
			{
				label: $voiceoverSpeakerIdToDisplayName['d45f479f-42e5-4f15-b1a0-c9feabcdb3aa'],
				value: 'd45f479f-42e5-4f15-b1a0-c9feabcdb3aa'
			},
			{
				label: $voiceoverSpeakerIdToDisplayName['56714211-532c-479b-ac8f-f2449af2310a'],
				value: '56714211-532c-479b-ac8f-f2449af2310a'
			},
			{
				label: $voiceoverSpeakerIdToDisplayName['052b721a-da7e-4614-b352-826411c262e2'],
				value: '052b721a-da7e-4614-b352-826411c262e2'
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
