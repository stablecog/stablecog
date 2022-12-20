import { writable as writableLocal } from 'svelte-local-storage-store';
import { guidanceScaleDefault } from '$ts/constants/main';
import { inferenceStepsDefault, type TAvailableInferenceSteps } from '$ts/constants/main';
import { modelIdDefault, type TAvailableModelId } from '$ts/constants/main';
import { schedulerIdDefault, type TAvailableSchedulerId } from '$ts/constants/main';
import {
	heightDefault,
	widthDefault,
	type TAvailableHeight,
	type TAvailableWidth
} from '$ts/constants/main';
import { writable } from 'svelte/store';

export const prompt = writableLocal<string | null>('prompt', null);
export const negativePrompt = writableLocal<string | null>('negativePrompt', null);

export const imageSize = writableLocal<TImageSize>('imageSize', {
	width: widthDefault,
	height: heightDefault
});

export const seed = writableLocal<number | null>('seed', null);

export const guidanceScale = writableLocal<number>('guidanceScale', guidanceScaleDefault);

export const inferenceSteps = writableLocal<TAvailableInferenceSteps>(
	'inferenceSteps',
	inferenceStepsDefault
);

export const modelId = writableLocal<TAvailableModelId>('modelId', modelIdDefault);

export const schedulerId = writableLocal<TAvailableSchedulerId>('schedulerId', schedulerIdDefault);

export interface TImageSize {
	width: TAvailableWidth;
	height: TAvailableHeight;
}

export const promptInputValue = writable<string | undefined>(undefined);
export const negativePromptInputValue = writable<string | undefined>(undefined);
export const generationWidth = writable<TAvailableWidth>(widthDefault);
export const generationHeight = writable<TAvailableHeight>(heightDefault);
export const generationInferenceSteps = writable<TAvailableInferenceSteps>(inferenceStepsDefault);
export const generationGuidanceScale = writable<number>(guidanceScaleDefault);
export const generationSeed = writable<string | number | undefined | null>(undefined);
export const generationModelId = writable<TAvailableModelId>(modelIdDefault);
export const generationSchedulerId = writable<TAvailableSchedulerId>(schedulerIdDefault);
