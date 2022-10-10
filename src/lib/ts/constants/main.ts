import type { TServerHealth, TTab } from '$ts/types/main';

export const estimatedDurationBufferRatio = 0.1;
export const estimatedDurationDefault = 30;
export const canonicalUrl = 'https://stablecog.com';

export const computeRatePerSecDefault = 150000;

export type TAvailableWidths = '256' | '512' | '768';
export const widthTabs: TWidthTab[] = [
	{ label: '256', value: '256' },
	{ label: '512', value: '512' },
	{ label: '768', value: '768' } /* ,
	{ label: '1024', value: '1024' } */
];
export const widthDefault = widthTabs[1].value;

export type TAvailableHeights = '256' | '512' | '768';
export const heightTabs: THeightTab[] = [
	{ label: '256', value: '256' },
	{ label: '512', value: '512' },
	{ label: '768', value: '768' } /* ,
	{ label: '1024', value: '1024' } */
];
export const heightDefault = heightTabs[1].value;

export type TAvailableInferenceSteps = '25' | '50' | '75' | '100';
export const inferenceStepsTabs: TInferenceStepsTab[] = [
	{ label: '25', value: '25' },
	{ label: '50', value: '50' },
	{ label: '75', value: '75' },
	{ label: '100', value: '100' }
];
export const inferenceStepsDefault = inferenceStepsTabs[1].value;

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
