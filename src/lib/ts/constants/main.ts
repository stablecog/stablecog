import type { TTooltipProps } from '$ts/actions/tooltip';
import type { TTab } from '$ts/types/main';

export const estimatedDurationBufferRatio = 0.1;
export const estimatedDurationDefault = 10;
export const estimatedDurationUpscaleDefault = 15;
export const canonicalUrl = 'https://stablecog.com';

export const maxSeed = 2147483647;
export const maxPromptLength = 500;

export const computeRatePerSecDefault = 250000;

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

export type TAvailableInferenceSteps = '25' | '50' | '75' /* | '100' */;
export const inferenceStepsTabs: TInferenceStepsTab[] = [
	{ label: '25', value: '25' },
	{ label: '50', value: '50' },
	{ label: '75', value: '75' }
	/* 	{ label: '100', value: '100' } */
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

export const tooltipStyleProps: TTooltipProps = {
	parentContainerId: 'tooltip-container',
	titleClass: 'font-bold text-sm leading-relaxed',
	descriptionClass: 'text-c-on-bg/50 text-xs leading-relaxed',
	wrapperClass: 'w-full transition duration-250 transform -mt-0.25',
	animationTime: 250,
	animateFrom: 'opacity-0 translate-y-3',
	animateTo: 'opacity-100 translate-y-0',
	containerClass:
		'max-w-[min(100vw-32px,18rem)] px-5 py-3 transform -translate-y-3 text-c-on-bg/75 flex flex-col gap-0.5 rounded-xl bg-c-bg-secondary overflow-hidden shadow-lg shadow-c-shadow/[var(--o-shadow-normal)]',
	containerAlign: 'left',
	indicatorClass: 'w-5 h-5',
	indicatorInnerClass: `w-5 h-5 transform rotate-135 bg-c-bg-secondary rounded`
};
