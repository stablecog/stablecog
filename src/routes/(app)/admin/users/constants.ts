import { sessionAndUrlParamWritable } from '$ts/stores/sessionAndUrlParamStore';

export const adminPanelUsersSearchString = sessionAndUrlParamWritable<string>(
	'adminPanelUserSearchString',
	'q',
	''
);

export const adminPanelUsersView = sessionAndUrlParamWritable<string>(
	'adminPanelUsersView',
	'view',
	''
);
