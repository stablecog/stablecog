import LL from '$i18n/i18n-svelte';
import { advancedModeApp } from '$ts/stores/advancedMode';
import type { TTab } from '$ts/types/main';
import { derived, type Readable, type Writable } from 'svelte/store';

export const availableGenerationModelIds = [
	'048b4aa3-5586-47ed-900f-f4341c96bdb2',
	'8acfe4c8-751d-4aa6-8c3c-844e3ef478e0',
	'fc06f6ab-ed14-4186-a7c0-aaec288d4f38',
	'f7f3d973-ac6f-4a7a-9db8-e89e4fba03a9',
	'eaa438e1-dbf9-48fd-be71-206f0f257617',
	'36d9d835-646f-4fc7-b9fe-98654464bf8e',
	'48a7031d-43b6-4a23-9f8c-8020eb6862e4'
] as const;

export type TAvailableGenerationModelId = typeof availableGenerationModelIds[number];

export const generationModelIdDefault: TAvailableGenerationModelId =
	'048b4aa3-5586-47ed-900f-f4341c96bdb2';

export const generationModelIdToNameCog: Record<
	TAvailableGenerationModelId,
	TGenerationModelNameCog
> = {
	'048b4aa3-5586-47ed-900f-f4341c96bdb2': 'Stable Diffusion v1.5',
	'8acfe4c8-751d-4aa6-8c3c-844e3ef478e0': 'Openjourney',
	'fc06f6ab-ed14-4186-a7c0-aaec288d4f38': '22h Diffusion v0.1',
	'f7f3d973-ac6f-4a7a-9db8-e89e4fba03a9': 'Waifu Diffusion v1.4',
	'eaa438e1-dbf9-48fd-be71-206f0f257617': 'Redshift Diffusion',
	'36d9d835-646f-4fc7-b9fe-98654464bf8e': 'Arcane Diffusion',
	'48a7031d-43b6-4a23-9f8c-8020eb6862e4': 'Ghibli Diffusion'
};

export const modelIdToDisplayName = derived<
	[Readable<TranslationFunctions>],
	Record<TAvailableGenerationModelId, string>
>([LL], ([$LL]) => {
	return {
		'048b4aa3-5586-47ed-900f-f4341c96bdb2':
			$LL.Shared.ModelOptions['048b4aa3-5586-47ed-900f-f4341c96bdb2'].realName(),
		'8acfe4c8-751d-4aa6-8c3c-844e3ef478e0':
			$LL.Shared.ModelOptions['8acfe4c8-751d-4aa6-8c3c-844e3ef478e0'].realName(),
		'fc06f6ab-ed14-4186-a7c0-aaec288d4f38':
			$LL.Shared.ModelOptions['fc06f6ab-ed14-4186-a7c0-aaec288d4f38'].realName(),
		'f7f3d973-ac6f-4a7a-9db8-e89e4fba03a9':
			$LL.Shared.ModelOptions['f7f3d973-ac6f-4a7a-9db8-e89e4fba03a9'].realName(),
		'eaa438e1-dbf9-48fd-be71-206f0f257617':
			$LL.Shared.ModelOptions['eaa438e1-dbf9-48fd-be71-206f0f257617'].realName(),
		'36d9d835-646f-4fc7-b9fe-98654464bf8e':
			$LL.Shared.ModelOptions['36d9d835-646f-4fc7-b9fe-98654464bf8e'].realName(),
		'48a7031d-43b6-4a23-9f8c-8020eb6862e4':
			$LL.Shared.ModelOptions['48a7031d-43b6-4a23-9f8c-8020eb6862e4'].realName()
	};
});

export const availableModelIdDropdownItems = derived(
	modelIdToDisplayName,
	($modelIdToDisplayName) => {
		const items: TTab<TAvailableGenerationModelId>[] = [
			{
				label: $modelIdToDisplayName['048b4aa3-5586-47ed-900f-f4341c96bdb2'],
				value: '048b4aa3-5586-47ed-900f-f4341c96bdb2'
			},
			{
				label: $modelIdToDisplayName['8acfe4c8-751d-4aa6-8c3c-844e3ef478e0'],
				value: '8acfe4c8-751d-4aa6-8c3c-844e3ef478e0'
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

export type TGenerationModelNameCog =
	| 'Stable Diffusion v1.5'
	| 'Openjourney'
	| 'Arcane Diffusion'
	| 'Ghibli Diffusion'
	| 'Redshift Diffusion'
	| 'Waifu Diffusion v1.4'
	| '22h Diffusion v0.1';
