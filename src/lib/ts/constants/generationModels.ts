import LL from '$i18n/i18n-svelte';
import type { TTab } from '$ts/types/main';
import { derived, type Readable } from 'svelte/store';

export const generationModelIdToNameCog = {
	'b6c1372f-31a7-457c-907c-d292a6ffef97': 'Luna Diffusion',
	'048b4aa3-5586-47ed-900f-f4341c96bdb2': 'Stable Diffusion v1.5',
	'fc06f6ab-ed14-4186-a7c0-aaec288d4f38': '22h Diffusion',
	'f7f3d973-ac6f-4a7a-9db8-e89e4fba03a9': 'Waifu Diffusion v1.4',
	'8acfe4c8-751d-4aa6-8c3c-844e3ef478e0': 'Openjourney',
	'eaa438e1-dbf9-48fd-be71-206f0f257617': 'Redshift Diffusion',
	'36d9d835-646f-4fc7-b9fe-98654464bf8e': 'Arcane Diffusion',
	'48a7031d-43b6-4a23-9f8c-8020eb6862e4': 'Ghibli Diffusion'
} as const;

export const generationModelIdDefault: TAvailableGenerationModelId =
	'b6c1372f-31a7-457c-907c-d292a6ffef97';

export const availableGenerationModelIds = Object.keys(
	generationModelIdToNameCog
) as TAvailableGenerationModelId[];

export const modelIdToDisplayName = derived<
	[Readable<TranslationFunctions>],
	Record<TAvailableGenerationModelId, string>
>([LL], ([$LL]) => {
	// @ts-ignore
	let obj: Record<TAvailableGenerationModelId, string> = {};
	for (const modelId in generationModelIdToNameCog) {
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
				label: $modelIdToDisplayName['b6c1372f-31a7-457c-907c-d292a6ffef97'],
				value: 'b6c1372f-31a7-457c-907c-d292a6ffef97'
			},
			{
				label: $modelIdToDisplayName['048b4aa3-5586-47ed-900f-f4341c96bdb2'],
				value: '048b4aa3-5586-47ed-900f-f4341c96bdb2'
			},
			{
				label: $modelIdToDisplayName['f7f3d973-ac6f-4a7a-9db8-e89e4fba03a9'],
				value: 'f7f3d973-ac6f-4a7a-9db8-e89e4fba03a9'
			},
			{
				label: $modelIdToDisplayName['fc06f6ab-ed14-4186-a7c0-aaec288d4f38'],
				value: 'fc06f6ab-ed14-4186-a7c0-aaec288d4f38'
			},
			{
				label: $modelIdToDisplayName['8acfe4c8-751d-4aa6-8c3c-844e3ef478e0'],
				value: '8acfe4c8-751d-4aa6-8c3c-844e3ef478e0'
			},
			{
				label: $modelIdToDisplayName['eaa438e1-dbf9-48fd-be71-206f0f257617'],
				value: 'eaa438e1-dbf9-48fd-be71-206f0f257617'
			},
			{
				label: $modelIdToDisplayName['36d9d835-646f-4fc7-b9fe-98654464bf8e'],
				value: '36d9d835-646f-4fc7-b9fe-98654464bf8e'
			},
			{
				label: $modelIdToDisplayName['48a7031d-43b6-4a23-9f8c-8020eb6862e4'],
				value: '48a7031d-43b6-4a23-9f8c-8020eb6862e4'
			}
		];
		return items;
	}
);

export type TAvailableGenerationModelId = keyof typeof generationModelIdToNameCog;
export type TGenerationModelNameCog =
	typeof generationModelIdToNameCog[TAvailableGenerationModelId];
