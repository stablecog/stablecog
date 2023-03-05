import LL from '$i18n/i18n-svelte';
import type { TTab } from '$ts/types/main';
import { derived, type Readable } from 'svelte/store';

// Scheduler IDs
export const availableSchedulerIds = [
	'55027f8b-f046-4e71-bc51-53d5448661e0',
	'6fb13b76-9900-4fa4-abf8-8f843e034a7f',
	'af2679a4-dbbb-4950-8c06-c3bb15416ef6',
	'9d175114-9a26-4371-861c-729ba9ecb4da',
	'7e98751f-e135-4206-b855-48b141e7b98f'
] as const;

export type TAvailableSchedulerId = typeof availableSchedulerIds[number];

export const availableSchedulerIdsFree: TAvailableSchedulerId[] = [
	'55027f8b-f046-4e71-bc51-53d5448661e0',
	'6fb13b76-9900-4fa4-abf8-8f843e034a7f',
	'af2679a4-dbbb-4950-8c06-c3bb15416ef6'
];

export const schedulerIdDefault: TAvailableSchedulerId = '6fb13b76-9900-4fa4-abf8-8f843e034a7f';

export const schedulerIdToSchedulerNameCog: Record<TAvailableSchedulerId, TSchedulerNameCog> = {
	'55027f8b-f046-4e71-bc51-53d5448661e0': 'K_LMS',
	'6fb13b76-9900-4fa4-abf8-8f843e034a7f': 'K_EULER',
	'af2679a4-dbbb-4950-8c06-c3bb15416ef6': 'K_EULER_ANCESTRAL',
	'9d175114-9a26-4371-861c-729ba9ecb4da': 'DPM++_2M',
	'7e98751f-e135-4206-b855-48b141e7b98f': 'DPM++_2S'
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
		'9d175114-9a26-4371-861c-729ba9ecb4da':
			$LL.Shared.SchedulerOptions['9d175114-9a26-4371-861c-729ba9ecb4da'].realName(),
		'7e98751f-e135-4206-b855-48b141e7b98f':
			$LL.Shared.SchedulerOptions['7e98751f-e135-4206-b855-48b141e7b98f'].realName()
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
			},
			{
				label: $schedulerIdToDisplayName['9d175114-9a26-4371-861c-729ba9ecb4da'],
				value: '9d175114-9a26-4371-861c-729ba9ecb4da'
			},
			{
				label: $schedulerIdToDisplayName['7e98751f-e135-4206-b855-48b141e7b98f'],
				value: '7e98751f-e135-4206-b855-48b141e7b98f'
			}
		];
		return items;
	}
);

export type TSchedulerNameCog = 'K_LMS' | 'K_EULER' | 'K_EULER_ANCESTRAL' | 'DPM++_2M' | 'DPM++_2S';
