import { env } from '$env/dynamic/public';
import type { TTab } from '$ts/types/main';

export const serverUrl = env.PUBLIC_DEFAULT_SERVER_URL;
export const estimatedDurationBufferRatio = 0.1;
export const estimatedDurationDefault = 20;
export const estimatedDurationUpscaleDefault = 15;
export const canonicalUrl = 'https://stablecog.com';
export const defaultLocale: Locales = 'en';
export const apiBase =
	env.PUBLIC_APP_MODE === 'development'
		? env.PUBLIC_GO_SERVER_URL_DEV
		: env.PUBLIC_GO_SERVER_URL_PROD;

export const routesWithHealthCheck = ['/', '/history', '/canvas'];
export const routesWithHiddenFooter = ['/canvas'];

export const maxProPixelSteps = 640 * 640 * 50;

export const allowedRedirectRoutes = [
	'/',
	'/pro',
	'/history',
	'/gallery',
	'/live',
	'/blog',
	'/account',
	'/admin',
	'/admin/servers',
	'/admin/users',
	'/admin/gallery'
];

export const isAllowedRedirectRoute = (route: string) => {
	let allowed = false;
	for (const r of allowedRedirectRoutes) {
		if (route === r || (r !== '/' && route.startsWith(`${r}/`))) {
			allowed = true;
			break;
		}
	}
	return allowed;
};

export const modalCloseDelay = 120;

export const maxSeed = 2147483647;
export const maxPromptLength = 500;

export const availableWidths = ['384', '512', '640', '768'] as const;
export type TAvailableWidth = typeof availableWidths[number];
export const availableWidthsFree: TAvailableWidth[] = ['512'];
export const widthTabs: TTab<TAvailableWidth>[] = [
	{ label: '384', value: '384' },
	{ label: '512', value: '512' },
	{ label: '640', value: '640' },
	{ label: '768', value: '768' }
];
export const widthDefault: TAvailableWidth = '512';

export const availableHeights = ['384', '512', '640', '768'] as const;
export type TAvailableHeight = typeof availableWidths[number];
export const availableHeightsFree: TAvailableHeight[] = ['512'];
export const heightTabs: TTab<TAvailableHeight>[] = [
	{ label: '384', value: '384' },
	{ label: '512', value: '512' },
	{ label: '640', value: '640' },
	{ label: '768', value: '768' }
];
export const heightDefault: TAvailableHeight = '512';

export const availableInferenceSteps = ['30', '40', '50'] as const;
export type TAvailableInferenceSteps = typeof availableInferenceSteps[number];
export const availableInferenceStepsFree: TAvailableInferenceSteps[] = ['30'];
export const inferenceStepsTabs: TTab<TAvailableInferenceSteps>[] = [
	{ label: '30', value: '30' },
	{ label: '40', value: '40' },
	{ label: '50', value: '50' }
];
export const inferenceStepsDefault: TAvailableInferenceSteps = '30';

export const guidanceScaleMax = 20;
export const guidanceScaleMin = 1;
export const guidanceScaleDefault = 7;

export const eurCountryCodes = [
	'BE',
	'BG',
	'CY',
	'CZ',
	'DE',
	'DK',
	'EE',
	'ES',
	'FI',
	'FR',
	'HR',
	'HU',
	'IT',
	'LT',
	'LU',
	'LV',
	'MT',
	'NL',
	'PL',
	'PT',
	'RO',
	'SE',
	'SI',
	'SK'
];
