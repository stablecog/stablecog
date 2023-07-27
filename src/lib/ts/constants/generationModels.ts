import LL from '$i18n/i18n-svelte';
import type { TAvailableSchedulerId } from '$ts/constants/schedulers';
import type { TTab } from '$ts/types/main';
import { derived, type Readable } from 'svelte/store';

const sdSharedSchedulerIds: TAvailableSchedulerId[] = [
	'6fb13b76-9900-4fa4-abf8-8f843e034a7f',
	'af2679a4-dbbb-4950-8c06-c3bb15416ef6',
	'9d175114-9a26-4371-861c-729ba9ecb4da',
	'55027f8b-f046-4e71-bc51-53d5448661e0',
	'01e94c28-501d-4c6d-8f00-079f3230bf58'
];

const kandinskySchedulerIds: TAvailableSchedulerId[] = [
	'82cf78dd-6afb-48cc-aca6-14224cca6950',
	'b7224e56-1440-43b9-ac86-66d66f9e8c91'
];

const kandinsky22SchedulerIds: TAvailableSchedulerId[] = [
	'cc1b8dbf-0aec-4e52-8110-8082506fb7ba',
	'9d175114-9a26-4371-861c-729ba9ecb4da'
];

export const generationModels: {
	[key: string]: {
		name: string;
		supportedSchedulerIds: TAvailableSchedulerId[];
	};
} = {
	'b6c1372f-31a7-457c-907c-d292a6ffef97': {
		name: 'Luna Diffusion',
		supportedSchedulerIds: sdSharedSchedulerIds
	},
	'048b4aa3-5586-47ed-900f-f4341c96bdb2': {
		name: 'Stable Diffusion v1.5',
		supportedSchedulerIds: sdSharedSchedulerIds
	},
	'fc06f6ab-ed14-4186-a7c0-aaec288d4f38': {
		name: '22h Diffusion',
		supportedSchedulerIds: sdSharedSchedulerIds
	},
	'f7f3d973-ac6f-4a7a-9db8-e89e4fba03a9': {
		name: 'Waifu Diffusion v1.4',
		supportedSchedulerIds: sdSharedSchedulerIds
	},
	'8acfe4c8-751d-4aa6-8c3c-844e3ef478e0': {
		name: 'Openjourney',
		supportedSchedulerIds: sdSharedSchedulerIds
	},
	'eaa438e1-dbf9-48fd-be71-206f0f257617': {
		name: 'Redshift Diffusion',
		supportedSchedulerIds: sdSharedSchedulerIds
	},
	'36d9d835-646f-4fc7-b9fe-98654464bf8e': {
		name: 'Arcane Diffusion',
		supportedSchedulerIds: sdSharedSchedulerIds
	},
	'8002bc51-7260-468f-8840-cf1e6dbe3f8a': {
		name: 'SDXL',
		supportedSchedulerIds: sdSharedSchedulerIds
	},
	'22b0857d-7edc-4d00-9cd9-45aa509db093': {
		name: 'Kandinsky',
		supportedSchedulerIds: kandinskySchedulerIds
	},
	'9fa49c00-109d-430f-9ddd-449f02e2c71a': {
		name: 'Kandinsky 2.2',
		supportedSchedulerIds: kandinsky22SchedulerIds
	},
	'3fb1f6d9-c0d3-4ae4-adf4-77f8da78a6f7': {
		name: 'Waifu Diffusion XL',
		supportedSchedulerIds: sdSharedSchedulerIds
	}
} as const;

export const generationModelIdDefault: TAvailableGenerationModelId =
	'9fa49c00-109d-430f-9ddd-449f02e2c71a';

export const availableGenerationModelIds = Object.keys(
	generationModels
) as TAvailableGenerationModelId[];

export const modelIdToDisplayName = derived<
	[Readable<TranslationFunctions>],
	Record<TAvailableGenerationModelId, string>
>([LL], ([$LL]) => {
	let obj: Record<TAvailableGenerationModelId, string> = {};
	for (const modelId in generationModels) {
		// @ts-ignore
		obj[modelId as TAvailableGenerationModelId] = $LL.Shared.ModelOptions[modelId].realName();
	}
	return obj;
});

export const availableModelIdDropdownItems = derived(
	modelIdToDisplayName,
	($modelIdToDisplayName) => {
		const items: TTab<TAvailableGenerationModelId>[] = [
			{
				label: $modelIdToDisplayName['9fa49c00-109d-430f-9ddd-449f02e2c71a'],
				value: '9fa49c00-109d-430f-9ddd-449f02e2c71a'
			},
			{
				label: $modelIdToDisplayName['8002bc51-7260-468f-8840-cf1e6dbe3f8a'],
				value: '8002bc51-7260-468f-8840-cf1e6dbe3f8a'
			},
			{
				label: $modelIdToDisplayName['22b0857d-7edc-4d00-9cd9-45aa509db093'],
				value: '22b0857d-7edc-4d00-9cd9-45aa509db093'
			},
			/* {
				label: $modelIdToDisplayName['3fb1f6d9-c0d3-4ae4-adf4-77f8da78a6f7'],
				value: '3fb1f6d9-c0d3-4ae4-adf4-77f8da78a6f7'
			}, */
			{
				label: $modelIdToDisplayName['b6c1372f-31a7-457c-907c-d292a6ffef97'],
				value: 'b6c1372f-31a7-457c-907c-d292a6ffef97'
			},
			{
				label: $modelIdToDisplayName['048b4aa3-5586-47ed-900f-f4341c96bdb2'],
				value: '048b4aa3-5586-47ed-900f-f4341c96bdb2'
			},
			{
				label: $modelIdToDisplayName['8acfe4c8-751d-4aa6-8c3c-844e3ef478e0'],
				value: '8acfe4c8-751d-4aa6-8c3c-844e3ef478e0'
			},
			{
				label: $modelIdToDisplayName['fc06f6ab-ed14-4186-a7c0-aaec288d4f38'],
				value: 'fc06f6ab-ed14-4186-a7c0-aaec288d4f38'
			},
			{
				label: $modelIdToDisplayName['f7f3d973-ac6f-4a7a-9db8-e89e4fba03a9'],
				value: 'f7f3d973-ac6f-4a7a-9db8-e89e4fba03a9'
			},
			{
				label: $modelIdToDisplayName['eaa438e1-dbf9-48fd-be71-206f0f257617'],
				value: 'eaa438e1-dbf9-48fd-be71-206f0f257617'
			},
			{
				label: $modelIdToDisplayName['36d9d835-646f-4fc7-b9fe-98654464bf8e'],
				value: '36d9d835-646f-4fc7-b9fe-98654464bf8e'
			}
			/* {
				label: $modelIdToDisplayName['48a7031d-43b6-4a23-9f8c-8020eb6862e4'],
				value: '48a7031d-43b6-4a23-9f8c-8020eb6862e4'
			} */
		];
		return items;
	}
);

export type TAvailableGenerationModelId = string;
export type TGenerationModelNameCog = (typeof generationModels)[TAvailableGenerationModelId];
