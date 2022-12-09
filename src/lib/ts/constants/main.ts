import { env } from '$env/dynamic/public';
import LL from '$i18n/i18n-svelte';
import { advancedModeApp } from '$ts/stores/advancedMode';
import type { TModelNameCog, TSchedulerNameCog } from '$ts/types/cog';
import type { TTab } from '$ts/types/main';
import { derived, type Readable, type Writable } from 'svelte/store';

export const estimatedDurationBufferRatio = 0.1;
export const estimatedDurationDefault = 10;
export const estimatedDurationUpscaleDefault = 15;
export const canonicalUrl = 'https://stablecog.com';
export const defaultLocale: Locales = 'en';
export const apiBase =
	env.PUBLIC_APP_MODE === 'development'
		? env.PUBLIC_GO_SERVER_URL_DEV
		: env.PUBLIC_GO_SERVER_URL_PROD;

export const modalCloseDelay = 120;

export const maxSeed = 2147483647;
export const maxPromptLength = 500;

export const computeRatePerSecDefault = 250000;

export type TAvailableWidth = '384' | '512' | '640' | '768';
export const widthTabs: TTab<TAvailableWidth>[] = [
	{ label: '384', value: '384' },
	{ label: '512', value: '512' },
	{ label: '640', value: '640' },
	{ label: '768', value: '768' } /* ,
	{ label: '1024', value: '1024' } */
];
export const widthDefault = widthTabs[1].value;

export type TAvailableHeight = '384' | '512' | '640' | '768';
export const heightTabs: TTab<TAvailableHeight>[] = [
	{ label: '384', value: '384' },
	{ label: '512', value: '512' },
	{ label: '640', value: '640' },
	{ label: '768', value: '768' }
];
export const heightDefault = heightTabs[1].value;

export type TAvailableInferenceSteps = '30' | '40' | '50';
export const inferenceStepsTabs: TTab<TAvailableInferenceSteps>[] = [
	{ label: '30', value: '30' },
	{ label: '40', value: '40' },
	{ label: '50', value: '50' }
];
export const inferenceStepsDefault = inferenceStepsTabs[0].value;

export const guidanceScaleMax = 20;
export const guidanceScaleMin = 1;
export const guidanceScaleDefault = 7;

// Model IDs
export const availableModelIds = [
	'048b4aa3-5586-47ed-900f-f4341c96bdb2',
	'8acfe4c8-751d-4aa6-8c3c-844e3ef478e0',
	'36d9d835-646f-4fc7-b9fe-98654464bf8e',
	'48a7031d-43b6-4a23-9f8c-8020eb6862e4',
	'790c80e1-65b1-4556-9332-196344389572',
	'eaa438e1-dbf9-48fd-be71-206f0f257617'
] as const;

export type TAvailableModelId = typeof availableModelIds[number];

export const modelIdDefault: TAvailableModelId = '048b4aa3-5586-47ed-900f-f4341c96bdb2';

export const modelIdToModelNameCog: Record<TAvailableModelId, TModelNameCog> = {
	'048b4aa3-5586-47ed-900f-f4341c96bdb2': 'Stable Diffusion v1.5',
	'8acfe4c8-751d-4aa6-8c3c-844e3ef478e0': 'Openjourney',
	'eaa438e1-dbf9-48fd-be71-206f0f257617': 'Redshift Diffusion',
	'36d9d835-646f-4fc7-b9fe-98654464bf8e': 'Arcane Diffusion',
	'790c80e1-65b1-4556-9332-196344389572': 'Mo-Di Diffusion',
	'48a7031d-43b6-4a23-9f8c-8020eb6862e4': 'Ghibli Diffusion'
};

export const modelIdToDisplayName = derived<
	[Writable<boolean>, Readable<TranslationFunctions>],
	Record<TAvailableModelId, string>
>([advancedModeApp, LL], ([$advancedModeApp, $LL]) => {
	return {
		'048b4aa3-5586-47ed-900f-f4341c96bdb2': $advancedModeApp
			? $LL.Shared.ModelOptions['048b4aa3-5586-47ed-900f-f4341c96bdb2'].realName()
			: $LL.Shared.ModelOptions['048b4aa3-5586-47ed-900f-f4341c96bdb2'].simpleName(),
		'8acfe4c8-751d-4aa6-8c3c-844e3ef478e0': $advancedModeApp
			? $LL.Shared.ModelOptions['8acfe4c8-751d-4aa6-8c3c-844e3ef478e0'].realName()
			: $LL.Shared.ModelOptions['8acfe4c8-751d-4aa6-8c3c-844e3ef478e0'].simpleName(),
		'36d9d835-646f-4fc7-b9fe-98654464bf8e': $advancedModeApp
			? $LL.Shared.ModelOptions['36d9d835-646f-4fc7-b9fe-98654464bf8e'].realName()
			: $LL.Shared.ModelOptions['36d9d835-646f-4fc7-b9fe-98654464bf8e'].simpleName(),
		'48a7031d-43b6-4a23-9f8c-8020eb6862e4': $advancedModeApp
			? $LL.Shared.ModelOptions['48a7031d-43b6-4a23-9f8c-8020eb6862e4'].realName()
			: $LL.Shared.ModelOptions['48a7031d-43b6-4a23-9f8c-8020eb6862e4'].simpleName(),
		'790c80e1-65b1-4556-9332-196344389572': $advancedModeApp
			? $LL.Shared.ModelOptions['790c80e1-65b1-4556-9332-196344389572'].realName()
			: $LL.Shared.ModelOptions['790c80e1-65b1-4556-9332-196344389572'].simpleName(),
		'eaa438e1-dbf9-48fd-be71-206f0f257617': $advancedModeApp
			? $LL.Shared.ModelOptions['eaa438e1-dbf9-48fd-be71-206f0f257617'].realName()
			: $LL.Shared.ModelOptions['eaa438e1-dbf9-48fd-be71-206f0f257617'].simpleName()
	};
});

export const availableModelIdDropdownItems = derived(
	modelIdToDisplayName,
	($modelIdToDisplayName) => {
		const items: TTab<TAvailableModelId>[] = [
			{
				label: $modelIdToDisplayName['048b4aa3-5586-47ed-900f-f4341c96bdb2'],
				value: '048b4aa3-5586-47ed-900f-f4341c96bdb2'
			},
			{
				label: $modelIdToDisplayName['8acfe4c8-751d-4aa6-8c3c-844e3ef478e0'],
				value: '8acfe4c8-751d-4aa6-8c3c-844e3ef478e0'
			},
			{
				label: $modelIdToDisplayName['36d9d835-646f-4fc7-b9fe-98654464bf8e'],
				value: '36d9d835-646f-4fc7-b9fe-98654464bf8e'
			},
			{
				label: $modelIdToDisplayName['790c80e1-65b1-4556-9332-196344389572'],
				value: '790c80e1-65b1-4556-9332-196344389572'
			},
			{
				label: $modelIdToDisplayName['eaa438e1-dbf9-48fd-be71-206f0f257617'],
				value: 'eaa438e1-dbf9-48fd-be71-206f0f257617'
			},
			{
				label: $modelIdToDisplayName['48a7031d-43b6-4a23-9f8c-8020eb6862e4'],
				value: '48a7031d-43b6-4a23-9f8c-8020eb6862e4'
			}
		];
		return items;
	}
);

// Scheduler IDs
export const availableSchedulerIds = [
	'55027f8b-f046-4e71-bc51-53d5448661e0',
	'6fb13b76-9900-4fa4-abf8-8f843e034a7f',
	'af2679a4-dbbb-4950-8c06-c3bb15416ef6',
	'162b6989-f635-4bfe-a2f5-24d4246df318'
] as const;

export type TAvailableSchedulerId = typeof availableSchedulerIds[number];

export const schedulerIdDefault: TAvailableSchedulerId = '6fb13b76-9900-4fa4-abf8-8f843e034a7f';

export const schedulerIdToSchedulerNameCog: Record<TAvailableSchedulerId, TSchedulerNameCog> = {
	'55027f8b-f046-4e71-bc51-53d5448661e0': 'K_LMS',
	'6fb13b76-9900-4fa4-abf8-8f843e034a7f': 'K_EULER',
	'af2679a4-dbbb-4950-8c06-c3bb15416ef6': 'K_EULER_ANCESTRAL',
	'162b6989-f635-4bfe-a2f5-24d4246df318': 'PNDM'
};

export const schedulerIdToDisplayName = derived<
	[Readable<TranslationFunctions>],
	Record<TAvailableSchedulerId, string>
>([LL], ([$LL]) => {
	return {
		'55027f8b-f046-4e71-bc51-53d5448661e0':
			$LL.Shared.SchedulerOptions['55027f8b-f046-4e71-bc51-53d5448661e0'].realName(),
		'6fb13b76-9900-4fa4-abf8-8f843e034a7f':
			$LL.Shared.SchedulerOptions['6fb13b76-9900-4fa4-abf8-8f843e034a7f'].realName(),
		'af2679a4-dbbb-4950-8c06-c3bb15416ef6':
			$LL.Shared.SchedulerOptions['af2679a4-dbbb-4950-8c06-c3bb15416ef6'].realName(),
		'162b6989-f635-4bfe-a2f5-24d4246df318': 'PNDM'
	};
});

export const availableSchedulerIdDropdownItems = derived(
	[schedulerIdToDisplayName],
	([$schedulerIdToDisplayName]) => {
		const items: TTab<TAvailableSchedulerId>[] = [
			{
				label: $schedulerIdToDisplayName['55027f8b-f046-4e71-bc51-53d5448661e0'],
				value: '55027f8b-f046-4e71-bc51-53d5448661e0'
			},
			{
				label: $schedulerIdToDisplayName['6fb13b76-9900-4fa4-abf8-8f843e034a7f'],
				value: '6fb13b76-9900-4fa4-abf8-8f843e034a7f'
			},
			{
				label: $schedulerIdToDisplayName['af2679a4-dbbb-4950-8c06-c3bb15416ef6'],
				value: 'af2679a4-dbbb-4950-8c06-c3bb15416ef6'
			}
		];
		return items;
	}
);
