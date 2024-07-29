import { localAndUrlParamWritable } from '$ts/stores/localAndUrlParamStore';

export const adminLogsLayoutOptionsDefault: TLayoutOption[] = ['timestamp'];
export const adminLogsSelectedWorkerDefault = 'all-workers';
export const adminLogsIsSettingsOpenDefault = false;

export function createAdminLogsStores() {
	const adminLogsLayoutOptions = localAndUrlParamWritable<TLayoutOption[]>(
		'adminLogsLayoutOptions',
		'l',
		adminLogsLayoutOptionsDefault
	);
	const adminLogsSearch = localAndUrlParamWritable<string | undefined | null>(
		'adminLogsSearch',
		'q',
		''
	);
	const adminLogsSelectedWorker = localAndUrlParamWritable<string>(
		'adminLogsSelectedWorker',
		'w',
		adminLogsSelectedWorkerDefault
	);
	const adminLogsIsSettingsOpen = localAndUrlParamWritable<boolean>(
		'adminLogsIsSettingsOpen',
		's',
		adminLogsIsSettingsOpenDefault
	);

	return {
		adminLogsLayoutOptions,
		adminLogsSearch,
		adminLogsSelectedWorker,
		adminLogsIsSettingsOpen
	};
}

export const availableAdminLogLayoutOptions = ['timestamp', 'worker-name', 'none'] as const;

export type TLayoutOption = (typeof availableAdminLogLayoutOptions)[number];
