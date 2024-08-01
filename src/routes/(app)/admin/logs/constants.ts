import { localAndUrlParamWritable } from '$ts/stores/localAndUrlParamStore';

export const selectedLayoutsDefault: TLayoutOption[] = ['timestamp'];
export const selectedWorkersDefault = [];
export const selectedAppsDefault = ['sc-worker'];
export const isSettingsOpenDefault = false;

export function createAdminLogsStores() {
	const selectedLayouts = localAndUrlParamWritable<TLayoutOption[]>(
		'adminLogsSelectedLayouts',
		'l',
		selectedLayoutsDefault
	);
	const search = localAndUrlParamWritable<string | undefined | null>('adminLogsSearch', 'q', '');
	const selectedApps = localAndUrlParamWritable<string[]>(
		'adminLogsSelectedApps',
		'a',
		selectedAppsDefault
	);
	const selectedWorkers = localAndUrlParamWritable<string[]>(
		'adminLogsSelectedWorkers',
		'w',
		selectedWorkersDefault
	);
	const isSettingsOpen = localAndUrlParamWritable<boolean>(
		'adminLogsIsSettingsOpen',
		's',
		isSettingsOpenDefault
	);

	return {
		selectedLayouts,
		search,
		selectedWorkers,
		selectedApps,
		isSettingsOpen
	};
}

export const availableAdminLogLayoutOptions = [
	'timestamp',
	'worker-name',
	'app-name',
	'none'
] as const;

export type TLayoutOption = (typeof availableAdminLogLayoutOptions)[number];
