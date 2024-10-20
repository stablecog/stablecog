import LL from '$i18n/i18n-svelte';
import type { TAvailableSchedulerId } from '$ts/constants/schedulers';
import type { TTab } from '$ts/types/main';
import { derived, type Readable } from 'svelte/store';
import { z } from 'zod';

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

export const availableGenerationModelIds = [
	'0a99668b-45bd-4f7e-aa9c-f9aaa41ef13b',
	'986d447d-c38b-4218-a2c8-6e0b691f47ec',
	'9fa49c00-109d-430f-9ddd-449f02e2c71a',
	'4e54440f-ee17-4712-b4b6-0671b94d685d',
	'8002bc51-7260-468f-8840-cf1e6dbe3f8a',
	'b6c1372f-31a7-457c-907c-d292a6ffef97',
	'fc06f6ab-ed14-4186-a7c0-aaec288d4f38',
	'f7f3d973-ac6f-4a7a-9db8-e89e4fba03a9'
] as const;

export const AvailableGenerationModelIdSchema = z.enum(availableGenerationModelIds);

export type TAvailableGenerationModelId = z.infer<typeof AvailableGenerationModelIdSchema>;

export const generationModels: Record<
	string,
	{
		name: string;
		supportedSchedulerIds: TAvailableSchedulerId[];
		active?: boolean;
		img2imgNotSupported?: boolean;
	}
> = {
	'0a99668b-45bd-4f7e-aa9c-f9aaa41ef13b': {
		name: 'FLUX.1',
		supportedSchedulerIds: sdSharedSchedulerIds,
		img2imgNotSupported: true
	},
	'b6c1372f-31a7-457c-907c-d292a6ffef97': {
		name: 'Luna Diffusion',
		supportedSchedulerIds: sdSharedSchedulerIds
	},
	'fc06f6ab-ed14-4186-a7c0-aaec288d4f38': {
		name: '22h Diffusion',
		supportedSchedulerIds: sdSharedSchedulerIds
	},
	'f7f3d973-ac6f-4a7a-9db8-e89e4fba03a9': {
		name: 'Waifu Diffusion',
		supportedSchedulerIds: sdSharedSchedulerIds
	},
	'8acfe4c8-751d-4aa6-8c3c-844e3ef478e0': {
		name: 'Openjourney',
		supportedSchedulerIds: sdSharedSchedulerIds,
		active: false
	},
	'eaa438e1-dbf9-48fd-be71-206f0f257617': {
		name: 'Redshift Diffusion',
		supportedSchedulerIds: sdSharedSchedulerIds,
		active: false
	},
	'8002bc51-7260-468f-8840-cf1e6dbe3f8a': {
		name: 'SDXL',
		supportedSchedulerIds: sdSharedSchedulerIds
	},
	'22b0857d-7edc-4d00-9cd9-45aa509db093': {
		name: 'Kandinsky',
		supportedSchedulerIds: kandinskySchedulerIds,
		active: false
	},
	'9fa49c00-109d-430f-9ddd-449f02e2c71a': {
		name: 'Kandinsky 2.2',
		supportedSchedulerIds: kandinsky22SchedulerIds
	},
	'3fb1f6d9-c0d3-4ae4-adf4-77f8da78a6f7': {
		name: 'Waifu Diffusion XL',
		supportedSchedulerIds: sdSharedSchedulerIds
	},
	'048b4aa3-5586-47ed-900f-f4341c96bdb2': {
		name: 'Stable Diffusion v1.5',
		supportedSchedulerIds: sdSharedSchedulerIds,
		active: false
	},
	'48a7031d-43b6-4a23-9f8c-8020eb6862e4': {
		name: 'Ghibli Diffusion',
		supportedSchedulerIds: sdSharedSchedulerIds,
		active: false
	},
	'36d9d835-646f-4fc7-b9fe-98654464bf8e': {
		name: 'Arcane Diffusion',
		supportedSchedulerIds: sdSharedSchedulerIds
	},
	'4e54440f-ee17-4712-b4b6-0671b94d685d': {
		name: 'SSD-1B',
		supportedSchedulerIds: sdSharedSchedulerIds
	},
	'986d447d-c38b-4218-a2c8-6e0b691f47ec': {
		name: 'Stable Diffusion 3',
		supportedSchedulerIds: sdSharedSchedulerIds
	}
} as const;

export const generationModelIdDefault: TAvailableGenerationModelId =
	'0a99668b-45bd-4f7e-aa9c-f9aaa41ef13b';

export const modelIdToDisplayName = derived<
	[Readable<TranslationFunctions>],
	Record<TAvailableGenerationModelId, string>
>([LL], ([$LL]) => {
	let obj: Record<TAvailableGenerationModelId, string> = {
		'0a99668b-45bd-4f7e-aa9c-f9aaa41ef13b': 'FLUX.1',
		'986d447d-c38b-4218-a2c8-6e0b691f47ec': 'Stable Diffusion 3',
		'9fa49c00-109d-430f-9ddd-449f02e2c71a': 'Kandinsky 2.2',
		'4e54440f-ee17-4712-b4b6-0671b94d685d': 'SSD-1B',
		'8002bc51-7260-468f-8840-cf1e6dbe3f8a': 'SDXL',
		'b6c1372f-31a7-457c-907c-d292a6ffef97': 'Luna Diffusion',
		'fc06f6ab-ed14-4186-a7c0-aaec288d4f38': '22h Diffusion',
		'f7f3d973-ac6f-4a7a-9db8-e89e4fba03a9': 'Waifu Diffusion'
	};
	for (const modelId in generationModels) {
		obj[modelId as TAvailableGenerationModelId] =
			$LL.Shared.ModelOptions[modelId as TAvailableGenerationModelId].realName();
	}
	return obj;
});

export const availableModelIdDropdownItems = derived(
	modelIdToDisplayName,
	($modelIdToDisplayName) => {
		const items: TTab<TAvailableGenerationModelId>[] = [
			{
				label: $modelIdToDisplayName['0a99668b-45bd-4f7e-aa9c-f9aaa41ef13b'],
				value: '0a99668b-45bd-4f7e-aa9c-f9aaa41ef13b',
				isNew: true
			},
			{
				label: $modelIdToDisplayName['986d447d-c38b-4218-a2c8-6e0b691f47ec'],
				value: '986d447d-c38b-4218-a2c8-6e0b691f47ec'
			},
			{
				label: $modelIdToDisplayName['9fa49c00-109d-430f-9ddd-449f02e2c71a'],
				value: '9fa49c00-109d-430f-9ddd-449f02e2c71a'
			},
			{
				label: $modelIdToDisplayName['4e54440f-ee17-4712-b4b6-0671b94d685d'],
				value: '4e54440f-ee17-4712-b4b6-0671b94d685d'
			},
			{
				label: $modelIdToDisplayName['8002bc51-7260-468f-8840-cf1e6dbe3f8a'],
				value: '8002bc51-7260-468f-8840-cf1e6dbe3f8a'
			},
			{
				label: $modelIdToDisplayName['b6c1372f-31a7-457c-907c-d292a6ffef97'],
				value: 'b6c1372f-31a7-457c-907c-d292a6ffef97'
			},
			{
				label: $modelIdToDisplayName['fc06f6ab-ed14-4186-a7c0-aaec288d4f38'],
				value: 'fc06f6ab-ed14-4186-a7c0-aaec288d4f38'
			},
			{
				label: $modelIdToDisplayName['f7f3d973-ac6f-4a7a-9db8-e89e4fba03a9'],
				value: 'f7f3d973-ac6f-4a7a-9db8-e89e4fba03a9'
			}
		];
		return items;
	}
);

export type TGenerationModelNameCog = (typeof generationModels)[TAvailableGenerationModelId];
