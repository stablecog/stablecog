import { writableLocalAndUrlParam } from '$ts/stores/writableLocalAndUrlParam';
import { z } from 'zod';

export const availableAdminLogLayoutOptions = [
	'timestamp',
	'worker-name',
	'app-name',
	'none'
] as const;

export const LayoutOptionSchema = z.enum(availableAdminLogLayoutOptions);

export type TLayoutOption = z.infer<typeof LayoutOptionSchema>;

export const selectedLayoutsDefault: TLayoutOption[] = ['timestamp'];
export const selectedWorkersDefault = [];
export const selectedAppsDefault = ['sc-worker'];
export const isSettingsOpenDefault = false;

export function createAdminLogsStores() {
	const selectedLayouts = writableLocalAndUrlParam<TLayoutOption[]>({
		key: 'adminLogsSelectedLayouts',
		paramKey: 'l',
		defaultValue: selectedLayoutsDefault,
		schema: z.array(LayoutOptionSchema)
	});
	const search = writableLocalAndUrlParam<string>({
		key: 'adminLogsSearch',
		paramKey: 'q',
		defaultValue: '',
		schema: z.string()
	});
	const selectedApps = writableLocalAndUrlParam<string[]>({
		key: 'adminLogsSelectedApps',
		paramKey: 'a',
		defaultValue: selectedAppsDefault,
		schema: z.array(z.string())
	});
	const selectedWorkers = writableLocalAndUrlParam<string[]>({
		key: 'adminLogsSelectedWorkers',
		paramKey: 'w',
		defaultValue: selectedWorkersDefault,
		schema: z.array(z.string())
	});
	const isSettingsOpen = writableLocalAndUrlParam<boolean>({
		key: 'adminLogsIsSettingsOpen',
		paramKey: 's',
		defaultValue: isSettingsOpenDefault,
		schema: z.boolean()
	});

	return {
		selectedLayouts,
		search,
		selectedWorkers,
		selectedApps,
		isSettingsOpen
	};
}
