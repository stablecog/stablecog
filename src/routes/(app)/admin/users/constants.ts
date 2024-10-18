import { writableSessionAndUrlParam } from '$ts/stores/writableSessionAndUrlParam';
import { z } from 'zod';

export const adminPanelUsersSearchString = writableSessionAndUrlParam<string>({
	key: 'adminPanelUserSearchString',
	paramKey: 'q',
	defaultValue: '',
	schema: z.string()
});

export const adminPanelUsersView = writableSessionAndUrlParam<string>({
	key: 'adminPanelUsersView',
	paramKey: 'view',
	defaultValue: '',
	schema: z.string()
});
