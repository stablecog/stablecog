export const voiceoverModels = {
	'0f442a3e-cf53-490b-b4a9-b0dda63e9523': {
		name: 'Bark',
		name_in_worker: 'bark',
		speakers: {
			'82bc1e69-2aa3-4317-9bc9-d9ed2afad0ff': {
				name: 'Jack',
				name_in_worker: 'v2/en_speaker_6'
			},
			'573c37c7-f741-4d36-80dc-f126131c6343': {
				name: 'Rachel',
				name_in_worker: 'v2/en_speaker_9'
			}
		}
	}
};

export const availableVoiceoverModelIds = Object.keys(
	voiceoverModels
) as TAvailableVoiceoverModelId[];

export type TAvailableVoiceoverModelId = string;
export type TAvailableSpeakerForVoiceoverModel = string;
