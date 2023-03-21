import { getImageFileNameFromGeneration } from '$ts/helpers/getImageFileNameFromGeneration';
import {
	logGenerationOutputDownloaded,
	type IGenerationOutputActionProps
} from '$ts/helpers/loggers';

export async function downloadGenerationImage({
	url,
	isUpscaled,
	prompt,
	seed,
	guidanceScale,
	inferenceSteps,
	logProps
}: TDownloadGenerationImageProps) {
	const res = await fetch(`${url}?download=true`);
	const blob = await res.blob();
	const fileName = getImageFileNameFromGeneration({
		url,
		isUpscaled,
		prompt,
		seed,
		guidanceScale,
		inferenceSteps
	});
	const a = document.createElement('a');
	a.href = URL.createObjectURL(blob);
	a.download = fileName;
	a.click();
	a.remove();
	logGenerationOutputDownloaded(logProps);
}

interface TDownloadGenerationImageProps {
	url: string;
	isUpscaled: boolean;
	prompt: string;
	seed: number;
	guidanceScale: number;
	inferenceSteps: number;
	logProps: IGenerationOutputActionProps;
}
