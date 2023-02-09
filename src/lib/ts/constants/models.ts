import LL from '$i18n/i18n-svelte';
import { advancedModeApp } from '$ts/stores/advancedMode';
import type { TTab } from '$ts/types/main';
import { derived, type Readable, type Writable } from 'svelte/store';

export type TModelNameCog =
	| 'Stable Diffusion v1.5'
	| 'Stable Diffusion v1.5 Inpaint'
	| 'Openjourney'
	| 'Arcane Diffusion'
	| 'Ghibli Diffusion'
	| 'Mo-Di Diffusion'
	| 'Redshift Diffusion'
	| 'Waifu Diffusion v1.4'
	| '22h Diffusion v0.1';

export const availableModelIds = [
	'048b4aa3-5586-47ed-900f-f4341c96bdb2',
	'897461c5-d8e8-49f6-95a2-1c7d697b8644',
	'8acfe4c8-751d-4aa6-8c3c-844e3ef478e0',
	'36d9d835-646f-4fc7-b9fe-98654464bf8e',
	'48a7031d-43b6-4a23-9f8c-8020eb6862e4',
	'790c80e1-65b1-4556-9332-196344389572',
	'eaa438e1-dbf9-48fd-be71-206f0f257617',
	'f7f3d973-ac6f-4a7a-9db8-e89e4fba03a9',
	'fc06f6ab-ed14-4186-a7c0-aaec288d4f38'
] as const;

export type TAvailableModelId = typeof availableModelIds[number];

export const modelIdDefault: TAvailableModelId = '048b4aa3-5586-47ed-900f-f4341c96bdb2';

export const modelIdToModelNameCog: Record<TAvailableModelId, TModelNameCog> = {
	'048b4aa3-5586-47ed-900f-f4341c96bdb2': 'Stable Diffusion v1.5',
	'897461c5-d8e8-49f6-95a2-1c7d697b8644': 'Stable Diffusion v1.5 Inpaint',
	'8acfe4c8-751d-4aa6-8c3c-844e3ef478e0': 'Openjourney',
	'eaa438e1-dbf9-48fd-be71-206f0f257617': 'Redshift Diffusion',
	'36d9d835-646f-4fc7-b9fe-98654464bf8e': 'Arcane Diffusion',
	'790c80e1-65b1-4556-9332-196344389572': 'Mo-Di Diffusion',
	'48a7031d-43b6-4a23-9f8c-8020eb6862e4': 'Ghibli Diffusion',
	'f7f3d973-ac6f-4a7a-9db8-e89e4fba03a9': 'Waifu Diffusion v1.4',
	'fc06f6ab-ed14-4186-a7c0-aaec288d4f38': '22h Diffusion v0.1'
} as const;

export const modelIdToDisplayName = derived<
	[Writable<boolean>, Readable<TranslationFunctions>],
	Record<TAvailableModelId, string>
>([advancedModeApp, LL], ([$advancedModeApp, $LL]) => {
	return {
		'048b4aa3-5586-47ed-900f-f4341c96bdb2': $advancedModeApp
			? $LL.Shared.ModelOptions['048b4aa3-5586-47ed-900f-f4341c96bdb2'].realName()
			: $LL.Shared.ModelOptions['048b4aa3-5586-47ed-900f-f4341c96bdb2'].simpleName(),
		'897461c5-d8e8-49f6-95a2-1c7d697b8644': $advancedModeApp ? 'SD v1.5 Inpaint' : 'Inpaint',
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
			: $LL.Shared.ModelOptions['eaa438e1-dbf9-48fd-be71-206f0f257617'].simpleName(),
		'f7f3d973-ac6f-4a7a-9db8-e89e4fba03a9': $advancedModeApp
			? $LL.Shared.ModelOptions['f7f3d973-ac6f-4a7a-9db8-e89e4fba03a9'].realName()
			: $LL.Shared.ModelOptions['f7f3d973-ac6f-4a7a-9db8-e89e4fba03a9'].simpleName(),
		'fc06f6ab-ed14-4186-a7c0-aaec288d4f38': $advancedModeApp
			? $LL.Shared.ModelOptions['fc06f6ab-ed14-4186-a7c0-aaec288d4f38'].realName()
			: $LL.Shared.ModelOptions['fc06f6ab-ed14-4186-a7c0-aaec288d4f38'].simpleName()
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
				label: $modelIdToDisplayName['790c80e1-65b1-4556-9332-196344389572'],
				value: '790c80e1-65b1-4556-9332-196344389572'
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
