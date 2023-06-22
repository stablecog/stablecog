export const voiceoverStabilityDefault = 30;
export const voiceoverStabilityMin = 0;
export const voiceoverStabilityMax = 100;
export const voiceoverStabilityHardMax = 99;
export const voiceoverDenoiseAudioDefault = true;
export const voiceoverRemoveSilenceDefault = true;

export const maxVoiceoverCharacterCount = 500;

export const voiceoverCreditCostPerCharacter = 0.0175;
export const getVoiceoverCreditCost = (s: string) => {
	const characterCount = s.length;
	return Math.ceil(characterCount * voiceoverCreditCostPerCharacter);
};
