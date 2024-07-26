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

export const adminLogsSelectedWorker = localAndUrlParamWritable<string>(
	'adminLogsSelectedWorker',
	'w',
	'all-workers'
);

export const availableAdminLogLayoutOptions = ['timestamp', 'worker-name', 'none'] as const;

export type TLayoutOption = (typeof availableAdminLogLayoutOptions)[number];
