export const voiceoverStabilityDefault = 70;
export const voiceoverStabilityMin = 0;
export const voiceoverStabilityMax = 100;

export const maxVoiceoverCharacterCount = 500;

export const voiceoverCreditCostPerCharacter = 0.0175;
export const getVoiceoverCreditCost = (characterCount: number) => {
	return Math.ceil(characterCount * voiceoverCreditCostPerCharacter);
};
