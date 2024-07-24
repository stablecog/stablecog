import { LOKI_TOKEN } from '$env/static/private';
import {
	availableAdminLogLayoutOptions,
	type TLayoutOption
} from '$routes/(app)/admin/logs/constants.js';

export function load({ url }) {
	const _search = url.searchParams.get('q');
	const _layoutOptions = url.searchParams.get('l');

	const search = _search !== undefined && _search !== null ? _search : '';
	const layoutOptions: TLayoutOption[] | null =
		_layoutOptions !== undefined && _layoutOptions !== null
			? (_layoutOptions
					.split(',')
					.filter((option) =>
						availableAdminLogLayoutOptions.includes(option as TLayoutOption)
					) as TLayoutOption[])
			: [];

	return {
		search,
		layoutOptions: layoutOptions.length > 0 ? layoutOptions : null,
		lokiToken: LOKI_TOKEN
	};
}
