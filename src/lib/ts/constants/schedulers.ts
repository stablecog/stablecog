import LL from '$i18n/i18n-svelte';
import type { TTab } from '$ts/types/main';
import { derived, type Readable } from 'svelte/store';

export const schedulerIdToSchedulerNameCog = {
	'6fb13b76-9900-4fa4-abf8-8f843e034a7f': 'K_EULER',
	'af2679a4-dbbb-4950-8c06-c3bb15416ef6': 'K_EULER_ANCESTRAL',
	'9d175114-9a26-4371-861c-729ba9ecb4da': 'DPM++_2M',
	'55027f8b-f046-4e71-bc51-53d5448661e0': 'K_LMS',
	'82cf78dd-6afb-48cc-aca6-14224cca6950': 'DDIM',
	'b7224e56-1440-43b9-ac86-66d66f9e8c91': 'P_SAMPLER',
	'cc1b8dbf-0aec-4e52-8110-8082506fb7ba': 'DDPM',
	'01e94c28-501d-4c6d-8f00-079f3230bf58': 'UNI_PC'
} as const;

export const schedulerIdDefault: TAvailableSchedulerId = 'af2679a4-dbbb-4950-8c06-c3bb15416ef6';

export const availableSchedulerIds = Object.keys(
	schedulerIdToSchedulerNameCog
) as TAvailableSchedulerId[];

export const schedulerIdToDisplayName = derived<
	[Readable<TranslationFunctions>],
	Record<TAvailableSchedulerId, string>
>([LL], ([$LL]) => {
	// @ts-ignore
	let obj: Record<TAvailableSchedulerId, string> = {};
	for (const schedulerId in schedulerIdToSchedulerNameCog) {
		obj[schedulerId as TAvailableSchedulerId] =
			$LL.Shared.SchedulerOptions[schedulerId as TAvailableSchedulerId].realName();
	}
	return obj;
});

export const availableSchedulerIdDropdownItems = derived(
	[schedulerIdToDisplayName],
	([$schedulerIdToDisplayName]) => {
		const items: TTab<TAvailableSchedulerId>[] = [
			{
				label: $schedulerIdToDisplayName['cc1b8dbf-0aec-4e52-8110-8082506fb7ba'],
				value: 'cc1b8dbf-0aec-4e52-8110-8082506fb7ba'
			},
			{
				label: $schedulerIdToDisplayName['6fb13b76-9900-4fa4-abf8-8f843e034a7f'],
				value: '6fb13b76-9900-4fa4-abf8-8f843e034a7f'
			},
			{
				label: $schedulerIdToDisplayName['af2679a4-dbbb-4950-8c06-c3bb15416ef6'],
				value: 'af2679a4-dbbb-4950-8c06-c3bb15416ef6'
			},
			{
				label: $schedulerIdToDisplayName['9d175114-9a26-4371-861c-729ba9ecb4da'],
				value: '9d175114-9a26-4371-861c-729ba9ecb4da'
			},
			{
				label: $schedulerIdToDisplayName['55027f8b-f046-4e71-bc51-53d5448661e0'],
				value: '55027f8b-f046-4e71-bc51-53d5448661e0'
			},
			{
				label: $schedulerIdToDisplayName['82cf78dd-6afb-48cc-aca6-14224cca6950'],
				value: '82cf78dd-6afb-48cc-aca6-14224cca6950'
			},
			{
				label: $schedulerIdToDisplayName['b7224e56-1440-43b9-ac86-66d66f9e8c91'],
				value: 'b7224e56-1440-43b9-ac86-66d66f9e8c91'
			}
			/* // UNI_PC
			{
				label: $schedulerIdToDisplayName['01e94c28-501d-4c6d-8f00-079f3230bf58'],
				value: '01e94c28-501d-4c6d-8f00-079f3230bf58'
			} */
		];
		return items;
	}
);

export type TAvailableSchedulerId = keyof typeof schedulerIdToSchedulerNameCog;
export type TSchedulerNameCog = (typeof schedulerIdToSchedulerNameCog)[TAvailableSchedulerId];
