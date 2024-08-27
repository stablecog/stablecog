import { browser } from '$app/environment';
import { env } from '$env/dynamic/public';
import { placeholderUrl } from '$ts/constants/placeholderUrl';
import type { TTab } from '$ts/types/main';

export const canonicalUrl = 'https://stablecog.com';
export const auxBucketUrl = 'https://ba.stablecog.com';
export const staticAssetBaseUrl = `${canonicalUrl}`;
export const staticAssetBaseUrlRelative = ``;
export const defaultLocale: Locales = 'en';

const apiUrlStr =
	env.PUBLIC_APP_MODE === 'qa'
		? env.PUBLIC_GO_SERVER_URL_QA
		: env.PUBLIC_APP_MODE === 'dev'
			? env.PUBLIC_GO_SERVER_URL_DEV
			: env.PUBLIC_GO_SERVER_URL_PROD;
const apiUrlStrInternal =
	env.PUBLIC_APP_MODE === 'qa'
		? env.PUBLIC_GO_SERVER_URL_QA_INTERNAL
		: env.PUBLIC_APP_MODE === 'dev'
			? env.PUBLIC_GO_SERVER_URL_DEV_INTERNAL
			: env.PUBLIC_GO_SERVER_URL_PROD_INTERNAL;

export const apiUrl = new URL(apiUrlStr || placeholderUrl);

export const getApiUrl = () => {
	if (!browser && apiUrlStrInternal) {
		console.log('getApiUrl | Internal');
		return new URL(apiUrlStrInternal || placeholderUrl);
	}
	return new URL(apiUrlStr || placeholderUrl);
};

export const authServerUrl = new URL(env.PUBLIC_AUTH_SERVER_URL || placeholderUrl);

export const navbarEstimatedHeight = 72;

export const routesWithHealthCheck = ['/', '/history', '/canvas'];
export const routesWithHiddenFooter = ['/canvas'];

export const maxProPixelSteps = 1024 * 1024 * 30;

export const allowedRedirectRoutes = [
	'/',
	'/generate',
	'/pro',
	'/pricing',
	'/history',
	'/gallery',
	'/live',
	'/account',
	'/admin',
	'/blog',
	'/docs',
	'/guide',
	'/voiceover',
	'/connect'
];

export const isAllowedRedirectRoute = (route: string) => {
	let allowed = false;
	for (const r of allowedRedirectRoutes) {
		if (route === r || (r !== '/' && route.startsWith(r))) {
			allowed = true;
			break;
		}
	}
	return allowed;
};

export const modalCloseDelay = 120;

export const maxSeed = 2147483647;
export const maxPromptLength = 500;

export const numOutputsDefault = 1;
export const numOutputsMin = 1;
export const numOutputsMax = 4;
export const numOutputsMaxFree = 1;

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
export const guidanceScaleLowThreshold = 3;
export const guidanceScaleHighThreshold = 15;
export const guidanceScaleDefault = 7;
export const initImageStrengthDefault = 50;
export const initImageStrengthMin = 10;
export const initImageStrengthMax = 90;
export const initImageStrengthStep = 10;

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
