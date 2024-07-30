import { localAndUrlParamWritable } from '$ts/stores/localAndUrlParamStore';

export const selectedLayoutsDefault: TLayoutOption[] = ['timestamp'];
export const selectedWorkerDefault = 'all-workers';
export const selectedWorkerAll = 'all-workers';
export const selectedAppDefault = 'sc-worker';
export const selectedAppAll = 'all-apps';
export const isSettingsOpenDefault = false;

export function createAdminLogsStores() {
	const selectedLayouts = localAndUrlParamWritable<TLayoutOption[]>(
		'adminLogsSelectedLayouts',
		'l',
		selectedLayoutsDefault
	);
	const search = localAndUrlParamWritable<string | undefined | null>('adminLogsSearch', 'q', '');
	const selectedApp = localAndUrlParamWritable<string>(
		'adminLogsSelectedApp',
		'a',
		selectedAppDefault
	);
	const selectedWorker = localAndUrlParamWritable<string>(
		'adminLogsSelectedWorker',
		'w',
		selectedWorkerDefault
	);
	const isSettingsOpen = localAndUrlParamWritable<boolean>(
		'adminLogsIsSettingsOpen',
		's',
		isSettingsOpenDefault
	);

	return {
		selectedLayouts,
		search,
		selectedWorker,
		selectedApp,
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
