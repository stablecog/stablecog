import { PUBLIC_BUCKET_ORIGIN_URL, PUBLIC_BUCKET_URL } from '$env/static/public';
import { getImageFileNameFromGeneration } from '$ts/helpers/getImageFileNameFromGeneration';

export async function downloadGenerationImage({
	url,
	isUpscaled,
	prompt,
	seed,
	guidanceScale,
	inferenceSteps
}: TDownloadGenerationImageProps) {
	const res = await fetch(url.replace(PUBLIC_BUCKET_URL, PUBLIC_BUCKET_ORIGIN_URL));
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
}

interface TDownloadGenerationImageProps {
	url: string;
	isUpscaled: boolean;
	prompt: string;
	seed: number;
	guidanceScale: number;
	inferenceSteps: number;
}
