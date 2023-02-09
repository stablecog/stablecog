export function getImageFileNameFromGeneration({
	prompt,
	seed,
	inferenceSteps,
	guidanceScale,
	imageUrl
}: IGetImageFileNameFromGenerationProps) {
	const extension = imageUrl.split('.').pop();
	return `[s_${seed}]-[gs_${guidanceScale}]-[is_${inferenceSteps}]-${prompt}.${extension}`;
}

interface IGetImageFileNameFromGenerationProps {
	prompt: string;
	seed: number;
	guidanceScale: number;
	inferenceSteps: number;
	imageUrl: string;
}
