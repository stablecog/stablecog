import { env } from '$env/dynamic/public';
import type { TTab } from '$ts/types/main';

export const serverUrl = env.PUBLIC_DEFAULT_SERVER_URL;
export const canonicalUrl = 'https://stablecog.com';
export const defaultLocale: Locales = 'en';
export const apiUrl = new URL(
	env.PUBLIC_APP_MODE === 'qa'
		? env.PUBLIC_GO_SERVER_URL_QA
		: env.PUBLIC_APP_MODE === 'dev'
		? env.PUBLIC_GO_SERVER_URL_DEV
		: env.PUBLIC_GO_SERVER_URL_PROD
);

export const routesWithHealthCheck = ['/', '/history', '/canvas'];
export const routesWithHiddenFooter = ['/canvas'];

export const maxProPixelSteps = 640 * 640 * 50;

export const allowedRedirectRoutes = [
	'/',
	'/generate',
	'/pro',
	'/pricing',
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
		if (route === r || (r !== '/' && route.startsWith(`${r}`))) {
			allowed = true;
			break;
		}
	}
	return allowed;
};

export const modalCloseDelay = 120;

export const maxSeed = 2147483647;
export const maxPromptLength = 500;

export const numOutputsDefault = 4;
export const numOutputsMin = 1;
export const numOutputsMax = 4;

export const availableInferenceSteps = ['30', '40', '50'] as const;
export type TAvailableInferenceSteps = (typeof availableInferenceSteps)[number];
export const inferenceStepsTabs: TTab<TAvailableInferenceSteps>[] = [
	{ label: '30', value: '30' },
	{ label: '40', value: '40' },
	{ label: '50', value: '50' }
];
export const inferenceStepsDefault: TAvailableInferenceSteps = '30';

export const guidanceScaleMax = 20;
export const guidanceScaleMin = 1;
export const guidanceScaleDefault = 7;
export const initImageStrengthDefault = 0.4;
export const initImageStrengthMin = 0.1;
export const initImageStrengthMax = 0.9;
export const initImageStrengthStep = 0.1;

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
