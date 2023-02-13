export function getImageFileNameFromGeneration({
	url,
	isUpscaled,
	prompt,
	seed,
	inferenceSteps,
	guidanceScale
}: IGetImageFileNameFromGenerationProps) {
	const extension = url.split('.').pop();
	return `[s_${seed}]-[gs_${guidanceScale}]-[is_${inferenceSteps}]-[u_${
		isUpscaled ? '1' : '0'
	}]-${prompt}.${extension}`;
}

interface IGetImageFileNameFromGenerationProps {
	url: string;
	isUpscaled: boolean;
	prompt: string;
	seed: number;
	guidanceScale: number;
	inferenceSteps: number;
}
