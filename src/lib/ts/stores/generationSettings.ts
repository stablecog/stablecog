import { writable as writableLocal } from '@macfja/svelte-persistent-store';
import {
	guidanceScaleDefault,
	initImageStrengthDefault,
	numOutputsDefault
} from '$ts/constants/main';
import { inferenceStepsDefault, type TAvailableInferenceSteps } from '$ts/constants/main';
import { writable } from 'svelte/store';
import { schedulerIdDefault, type TAvailableSchedulerId } from '$ts/constants/schedulers';
import {
	generationModelIdDefault,
	type TAvailableGenerationModelId
} from '$ts/constants/generationModels';
import {
	aspectRatioDefault,
	heightDefault,
	widthDefault,
	type TAvailableAspectRatio,
	type TAvailableHeight,
	type TAvailableWidth
} from '$ts/constants/generationSize';

export const prompt = writableLocal<string | null>('prompt', null);
export const negativePrompt = writableLocal<string | null>('negativePrompt', null);

export const imageSize = writableLocal<TImageSize>('imageSize', {
	width: widthDefault,
	height: heightDefault,
	aspectRatio: aspectRatioDefault
});

export const initImageStrength = writableLocal<number>(
	'initImageStrength',
	initImageStrengthDefault
);

export const seed = writableLocal<number | null>('seed', null);

export const guidanceScale = writableLocal<number>('guidanceScale', guidanceScaleDefault);

export const inferenceSteps = writableLocal<TAvailableInferenceSteps>(
	'inferenceSteps',
	inferenceStepsDefault
);

export const modelId = writableLocal<TAvailableGenerationModelId>(
	'modelId',
	generationModelIdDefault
);

export const schedulerId = writableLocal<TAvailableSchedulerId>('schedulerId', schedulerIdDefault);

export const numOutputs = writableLocal<number>('numOutputs', numOutputsDefault);

export interface TImageSize {
	width: TAvailableWidth;
	height: TAvailableHeight;
	aspectRatio: TAvailableAspectRatio;
}

export const generationPrompt = writable<string | undefined>(undefined);
export const generationNegativePrompt = writable<string | undefined>(undefined);
export const generationWidth = writable<TAvailableWidth>(widthDefault);
export const generationHeight = writable<TAvailableHeight>(heightDefault);
export const generationAspectRatio = writable<TAvailableAspectRatio>(aspectRatioDefault);
export const generationInferenceSteps = writable<TAvailableInferenceSteps>(inferenceStepsDefault);
export const generationGuidanceScale = writable<number>(guidanceScaleDefault);
export const generationSeed = writable<string | number | undefined | null>(undefined);
export const generationModelId = writable<TAvailableGenerationModelId>(generationModelIdDefault);
export const generationSchedulerId = writable<TAvailableSchedulerId>(schedulerIdDefault);
export const generationNumOutputs = writable<number>(numOutputsDefault);
export const generationInitImageUrl = writable<string | undefined>(undefined);
export const generationInitImageStrength = writable<number>(initImageStrengthDefault);
export const generationInitImageFiles = writable<FileList | undefined>(undefined);
export const generationInitImageFilesState = writable<'idle' | 'uploading' | 'uploaded' | 'error'>(
	'idle'
);
export const generationInitImageFilesError = writable<string | undefined>(undefined);
export const generationInitImageSrc = writable<string | undefined>(undefined);
export const generationInitImageWidth = writable<number | undefined>(undefined);
export const generationInitImageHeight = writable<number | undefined>(undefined);
export const generationShouldSubmitToGallery = writable<boolean>(false);
