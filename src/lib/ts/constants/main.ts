import type { TTooltipProps } from '$ts/actions/tooltip';
import type { TTab } from '$ts/types/main';

export const estimatedDurationBufferRatio = 0.1;
export const estimatedDurationDefault = 10;
export const estimatedDurationUpscaleDefault = 15;
export const canonicalUrl = 'https://stablecog.com';

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
