import { LOKI_TOKEN } from '$env/static/private';
import { PUBLIC_LOKI_HOST } from '$env/static/public';
import {
	availableAdminLogLayoutOptions,
	type TLayoutOption
} from '$routes/(app)/admin/logs/constants.js';

export async function load({ url }) {
	const start = Date.now() * 1_000_000 - 24 * 60 * 60 * 1_000 * 1_000_000;
	const workerNamesEndpoint = `https://${PUBLIC_LOKI_HOST}/loki/api/v1/label/worker_name/values?start=${start}&token=${LOKI_TOKEN}`;
	const _search = url.searchParams.get('q');
	const _layoutOptions = url.searchParams.get('l');
	const _workerName = url.searchParams.get('w');

	const search = _search !== undefined && _search !== null ? _search : '';
	const layoutOptions: TLayoutOption[] | null =
		_layoutOptions !== undefined && _layoutOptions !== null
			? (_layoutOptions
					.split(',')
					.filter((option) =>
						availableAdminLogLayoutOptions.includes(option as TLayoutOption)
					) as TLayoutOption[])
			: [];

	const workerNamesRes = await fetch(workerNamesEndpoint);
	const workerNamesJSON: { data: string[] } = await workerNamesRes.json();
	const workerName =
		_workerName !== undefined && _workerName !== null && workerNamesJSON.data.includes(_workerName)
			? _workerName
			: null;
	const _isSettingsOpen = url.searchParams.get('s');
	const isSettingsOpen = _isSettingsOpen === 'true' ? true : null;

	return {
		search,
		workerName,
		layoutOptions: layoutOptions.length > 0 ? layoutOptions : null,
		lokiToken: LOKI_TOKEN,
		workerNames: workerNamesJSON.data,
		isSettingsOpen
	};
}
