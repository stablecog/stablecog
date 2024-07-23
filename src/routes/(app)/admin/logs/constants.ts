import { sessionAndUrlParamWritable } from '$ts/stores/sessionAndUrlParamStore';

export const adminLogsLayoutDefault: TLayout = 'desktop-time';
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
	'desktop-time',
	'desktop-time-name',
	'mobile-time',
	'mobile-time-name',
	'logs-only'
] as const;

export type TLayout = (typeof availableAdminLogLayouts)[number];
