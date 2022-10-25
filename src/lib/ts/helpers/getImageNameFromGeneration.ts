export function getImageNameFromGeneration(
	prompt: string,
	seed: number,
	inferenceSteps: number,
	guidanceScale: number
) {
	return `[sd_${seed}]-[scl_${guidanceScale}]-[stp_${inferenceSteps}]-${prompt}.png`;
}
