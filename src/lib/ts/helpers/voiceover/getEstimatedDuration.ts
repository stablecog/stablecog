const secondsPerCharacter = 0.15;
const durationMin = 3;

export const getEstimatedVoiceoverDurationInSeconds = (text: string): number => {
	return Math.max(text.length * secondsPerCharacter, durationMin);
};
