import {
	AvailableInferenceStepsSchema,
	guidanceScaleDefault,
	initImageStrengthDefault,
	numOutputsDefault
} from '$ts/constants/main';
import { inferenceStepsDefault, type TAvailableInferenceSteps } from '$ts/constants/main';
import { writable } from 'svelte/store';
import {
	AvailableSchedulerIdSchema,
	schedulerIdDefault,
	type TAvailableSchedulerId
} from '$ts/constants/schedulers';
import {
	AvailableGenerationModelIdSchema,
	generationModelIdDefault,
	type TAvailableGenerationModelId
} from '$ts/constants/generationModels';
import {
	aspectRatioDefault,
	AvailableAspectRatiosSchema,
	AvailableHeightsSchema,
	AvailableWidthsSchema,
	heightDefault,
	widthDefault,
	type TAvailableAspectRatio,
	type TAvailableHeight,
	type TAvailableWidth
} from '$ts/constants/generationSize';
import { writableLocal } from '$ts/stores/writableLocal';
import { z } from 'zod';

export const prompt = writableLocal({
	key: 'prompt',
	defaultValue: null,
	schema: z.string().nullable()
});
export const negativePrompt = writableLocal({
	key: 'negativePrompt',
	defaultValue: null,
	schema: z.string().nullable()
});

export const ImageSizeSchema = z.object({
	width: AvailableWidthsSchema,
	height: AvailableHeightsSchema,
	aspectRatio: AvailableAspectRatiosSchema
});

export const imageSize = writableLocal<TImageSize>({
	key: 'imageSize',
	defaultValue: {
		width: widthDefault,
		height: heightDefault,
		aspectRatio: aspectRatioDefault
	},
	schema: ImageSizeSchema
});

export const initImageStrength = writableLocal({
	key: 'initImageStrength',
	defaultValue: initImageStrengthDefault,
	schema: z.number()
});

export const seed = writableLocal({
	key: 'seed',
	defaultValue: null,
	schema: z.number().nullable()
});

export const guidanceScale = writableLocal({
	key: 'guidanceScale',
	defaultValue: guidanceScaleDefault,
	schema: z.number()
});

export const inferenceSteps = writableLocal({
	key: 'inferenceSteps',
	defaultValue: inferenceStepsDefault,
	schema: AvailableInferenceStepsSchema
});

export const modelId = writableLocal({
	key: 'modelId',
	defaultValue: generationModelIdDefault,
	schema: AvailableGenerationModelIdSchema
});

export const schedulerId = writableLocal({
	key: 'schedulerId',
	defaultValue: schedulerIdDefault,
	schema: AvailableSchedulerIdSchema
});

export const numOutputs = writableLocal<number>({
	key: 'numOutputs',
	defaultValue: numOutputsDefault,
	schema: z.number()
});

export type TImageSize = z.infer<typeof ImageSizeSchema>;

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
