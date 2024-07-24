import { localAndUrlParamWritable } from '$ts/stores/localAndUrlParamStore';

export const adminLogsLayoutDefault: TLayout = 'desktop-logs-time';
export const adminLogsLayout = localAndUrlParamWritable<TLayout>(
	'adminLogsLayout',
	'l',
	adminLogsLayoutDefault
);

export const adminLogsSearch = localAndUrlParamWritable<string | undefined | null>(
	'adminLogsSearch',
	'q',
	''
);

export const availableAdminLogLayouts = [
	'desktop-logs-time',
	'desktop-logs',
	'desktop-logs-time-name',
	'mobile-logs-time',
	'mobile-logs',
	'mobile-logs-time-name'
] as const;

export type TLayout = (typeof availableAdminLogLayouts)[number];
