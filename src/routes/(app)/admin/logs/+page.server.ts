import { LOKI_TOKEN } from '$env/static/private';
import { availableAdminLogLayouts, type TLayout } from '$routes/(app)/admin/logs/constants.js';

export function load({ url }) {
	const _search = url.searchParams.get('q');
	const _layout = url.searchParams.get('l');

	const search = _search !== undefined && _search !== null ? _search : '';
	const layout: TLayout | null =
		_layout && availableAdminLogLayouts.includes(_layout as TLayout) ? (_layout as TLayout) : null;

	return {
		search,
		layout,
		lokiToken: LOKI_TOKEN
	};
}
