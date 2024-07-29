import { localAndUrlParamWritable } from '$ts/stores/localAndUrlParamStore';

export const adminLogsLayoutOptionsDefault: TLayoutOption[] = ['timestamp'];
export const adminLogsLayoutOptions = localAndUrlParamWritable<TLayoutOption[]>(
	'adminLogsLayoutOptions',
	'l',
	adminLogsLayoutOptionsDefault
);

export const adminLogsSearch = localAndUrlParamWritable<string | undefined | null>(
	'adminLogsSearch',
	'q',
	''
);

export const adminLogsSelectedWorkerDefault = 'all-workers';
export const adminLogsSelectedWorker = localAndUrlParamWritable<string>(
	'adminLogsSelectedWorker',
	'w',
	adminLogsSelectedWorkerDefault
);
export const adminLogsIsSettingsOpenDefault = false;
export const adminLogsIsSettingsOpen = localAndUrlParamWritable<boolean>(
	'adminLogsIsSettingsOpen',
	's',
	adminLogsIsSettingsOpenDefault
);

export const availableAdminLogLayoutOptions = ['timestamp', 'worker-name', 'none'] as const;

export type TLayoutOption = (typeof availableAdminLogLayoutOptions)[number];
