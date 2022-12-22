export function getImageFileNameFromGeneration({
	prompt,
	seed,
	inferenceSteps,
	guidanceScale,
	b64
}: IGetImageFileNameFromGenerationProps) {
	return `[s_${seed}]-[gs_${guidanceScale}]-[is_${inferenceSteps}]-${prompt}.${
		b64.startsWith('data:image/jpeg') ? 'jpeg' : b64.startsWith('data:image/jpg') ? 'jpg' : 'png'
	}`;
}

interface IGetImageFileNameFromGenerationProps {
	prompt: string;
	seed: number;
	guidanceScale: number;
	inferenceSteps: number;
	b64: string;
}
