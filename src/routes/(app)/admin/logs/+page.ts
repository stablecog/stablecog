import {
	availableAdminLogLayoutOptions,
	createAdminLogsStores,
	type TLayoutOption
} from '$routes/(app)/admin/logs/constants.js';
import type { PageLoad } from './$types';

export const load: PageLoad = async ({ url, data }) => {
	const _search = url.searchParams.get('q');
	const _layoutOptions = url.searchParams.get('l');
	const _workerName = url.searchParams.get('w');

	const search = _search !== undefined && _search !== null ? _search : '';
	const selectedLayouts: TLayoutOption[] | null =
		_layoutOptions !== undefined && _layoutOptions !== null
			? (_layoutOptions
					.split(',')
					.filter((option) =>
						availableAdminLogLayoutOptions.includes(option as TLayoutOption)
					) as TLayoutOption[])
			: [];

	const workerName =
		_workerName !== undefined && _workerName !== null && data.workerNames.includes(_workerName)
			? _workerName
			: null;
	const _isSettingsOpen = url.searchParams.get('s');
	const isSettingsOpen = _isSettingsOpen === 'true' ? true : null;

	const stores = createAdminLogsStores();

	if (search) stores.search.set(search);
	if (selectedLayouts.length > 0) stores.selectedLayouts.set(selectedLayouts);
	if (workerName) stores.selectedWorker.set(workerName);
	if (isSettingsOpen !== null) stores.isSettingsOpen.set(isSettingsOpen);

	return {
		stores,
		...data
	};
};
