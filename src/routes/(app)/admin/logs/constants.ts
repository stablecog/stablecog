import { sessionAndUrlParamWritable } from '$ts/stores/sessionAndUrlParamStore';

export const adminLogsLayoutDefault: TLayout = 'desktop-logs-time';
export const adminLogsLayout = sessionAndUrlParamWritable<TLayout>(
	'adminLogsLayout',
	'l',
	adminLogsLayoutDefault
);

export const adminLogsSearch = sessionAndUrlParamWritable<string | undefined | null>(
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
