import type { TTab } from '$ts/types/main';

export const estimatedDurationBufferRatio = 0.1;
export const estimatedDurationDefault = 10;
export const estimatedDurationUpscaleDefault = 15;
export const canonicalUrl = 'https://stablecog.com';
export const defaultLocale: Locales = 'en';

export const modalCloseDelay = 120;

export const maxSeed = 2147483647;
export const maxPromptLength = 500;

export const computeRatePerSecDefault = 250000;

export type TAvailableWidths = '384' | '512' | '640' | '768';
export const widthTabs: TWidthTab[] = [
	{ label: '384', value: '384' },
	{ label: '512', value: '512' },
	{ label: '640', value: '640' },
	{ label: '768', value: '768' } /* ,
	{ label: '1024', value: '1024' } */
];
export const widthDefault = widthTabs[1].value;

export type TAvailableHeights = '384' | '512' | '640' | '768';
export const heightTabs: THeightTab[] = [
	{ label: '384', value: '384' },
	{ label: '512', value: '512' },
	{ label: '640', value: '640' },
	{ label: '768', value: '768' } /* ,
	{ label: '1024', value: '1024' } */
];
export const heightDefault = heightTabs[1].value;

export type TAvailableInferenceSteps = '30' | '40' | '50' | '60' /* | '100' */;
export const inferenceStepsTabs: TInferenceStepsTab[] = [
	{ label: '30', value: '30' },
	{ label: '40', value: '40' },
	{ label: '50', value: '50' },
	{ label: '60', value: '60' }
	/* 	{ label: '100', value: '100' } */
];
export const inferenceStepsDefault = inferenceStepsTabs[2].value;

export const guidanceScaleMax = 20;
export const guidanceScaleMin = 1;
export const guidanceScaleDefault = 7;

export interface TWidthTab extends TTab {
	value: TAvailableWidths;
}
export interface THeightTab extends TTab {
	value: TAvailableHeights;
}
export interface TInferenceStepsTab extends TTab {
	value: TAvailableInferenceSteps;
}
export interface TGuidanceScaleTab extends TTab {
	value: number;
}

export const availableModelIds = [
	'048b4aa3-5586-47ed-900f-f4341c96bdb2',
	'8acfe4c8-751d-4aa6-8c3c-844e3ef478e0'
] as const;
export type TAvailableModelId = typeof availableModelIds[number];
export const modelIdToCogModelName: Record<TAvailableModelId, string> = {
	'048b4aa3-5586-47ed-900f-f4341c96bdb2': 'Stable Diffusion v1.5',
	'8acfe4c8-751d-4aa6-8c3c-844e3ef478e0': 'Openjourney'
};
export const modelIdDefault: TAvailableModelId = '048b4aa3-5586-47ed-900f-f4341c96bdb2';

export const availableSchedulerIds = [
	'55027f8b-f046-4e71-bc51-53d5448661e0',
	'82cf78dd-6afb-48cc-aca6-14224cca6950',
	'6fb13b76-9900-4fa4-abf8-8f843e034a7f',
	'af2679a4-dbbb-4950-8c06-c3bb15416ef6'
] as const;
export type TAvailableSchedulerId = typeof availableSchedulerIds[number];
export const schedulerIdToCogSchedulerName: Record<TAvailableSchedulerId, string> = {
	'55027f8b-f046-4e71-bc51-53d5448661e0': 'K_LMS',
	'82cf78dd-6afb-48cc-aca6-14224cca6950': 'DDIM',
	'6fb13b76-9900-4fa4-abf8-8f843e034a7f': 'K_EULER',
	'af2679a4-dbbb-4950-8c06-c3bb15416ef6': 'K_EULER_ANCESTRAL'
};
export const schedulerIdDefault: TAvailableSchedulerId = '55027f8b-f046-4e71-bc51-53d5448661e0';
