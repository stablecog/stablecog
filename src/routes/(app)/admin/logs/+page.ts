import {
	availableAdminLogLayoutOptions,
	createAdminLogsStores,
	type TLayoutOption
} from '$routes/(app)/admin/logs/constants.js';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url, data }) => {
	const _search = url.searchParams.get('q');
	const _layoutOptions = url.searchParams.get('l');
	const _workerNames = url.searchParams.get('w');
	const _appNames = url.searchParams.get('a');

	const search = _search !== undefined && _search !== null ? _search : '';
	const layouts: TLayoutOption[] | null =
		_layoutOptions !== undefined && _layoutOptions !== null
			? (_layoutOptions
					.split(',')
					.filter(
						(option) =>
							availableAdminLogLayoutOptions.includes(option as TLayoutOption) || option === 'none'
					) as TLayoutOption[])
			: null;

	const workerNames =
		_workerNames !== undefined && _workerNames !== null
			? _workerNames.split(',').filter((w) => data.workerNames.includes(w))
			: null;
	const appNames =
		_appNames !== undefined && _appNames !== null
			? _appNames.split(',').filter((a) => data.appNames.includes(a) || a === 'all')
			: null;
	const _isSettingsOpen = url.searchParams.get('s');
	const isSettingsOpen =
		_isSettingsOpen === 'true' ? true : _isSettingsOpen === 'false' ? false : null;

	const stores = createAdminLogsStores();

	if (search) stores.search.set(search);
	if (layouts && layouts.length > 0) stores.selectedLayouts.set(layouts);
	if (workerNames && workerNames.length > 0) stores.selectedWorkers.set(workerNames);
	if (appNames && appNames.length > 0) stores.selectedApps.set(appNames);
	if (isSettingsOpen !== null) stores.isSettingsOpen.set(isSettingsOpen);

	return {
		stores,
		...data
	};
};
