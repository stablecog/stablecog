import { modelIdToDisplayName } from '$ts/constants/generationModels';
import { get } from 'svelte/store';

const maxPromptLength = 100;

export function getImageFileNameFromGeneration({
	url,
	isUpscaled,
	prompt,
	seed,
	inferenceSteps,
	guidanceScale,
	outputIndex,
	modelId
}: IGetImageFileNameFromGenerationProps) {
	let extension: string;
	if (url.startsWith('data:image/')) {
		extension = url.split(';')[0].split('/')[1];
	} else {
		extension = url.split('.').pop() || 'jpeg';
	}
	const modelName = toSlug(get(modelIdToDisplayName)[modelId]);
	return `[s_${seed}]-[gs_${guidanceScale}]-[is_${inferenceSteps}]-[u_${
		isUpscaled ? '1' : '0'
	}]-[oi_${outputIndex}]-[m_${modelName}]-${replaceSpaces(
		prompt.slice(0, maxPromptLength)
	)}.${extension}`;
}

function replaceSpaces(str: string) {
	return str.replace(/ /g, '_');
}

interface IGetImageFileNameFromGenerationProps {
	url: string;
	isUpscaled: boolean;
	prompt: string;
	seed: number;
	guidanceScale: number;
	inferenceSteps: number;
	outputIndex: number;
	modelId: string;
}

function toSlug(str: string): string {
	return str
		.toLowerCase()
		.trim()
		.replace(/[^a-z0-9 -]/g, '') // Remove special characters
		.replace(/\s+/g, '-') // Replace spaces with hyphens
		.replace(/-+/g, '-'); // Replace multiple hyphens with a single one
}
