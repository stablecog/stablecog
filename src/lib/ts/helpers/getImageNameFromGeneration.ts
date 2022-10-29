export function getImageNameFromGeneration(
	prompt: string,
	seed: number,
	inferenceSteps: number,
	guidanceScale: number,
	b64: string
) {
	return `[sd_${seed}]-[scl_${guidanceScale}]-[stp_${inferenceSteps}]-${prompt}.${
		b64.startsWith('data:image/jpeg') ? 'jpeg' : b64.startsWith('data:image/jpg') ? 'jpg' : 'png'
	}`;
}
