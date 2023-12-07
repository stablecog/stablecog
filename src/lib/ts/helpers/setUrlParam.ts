import { browser } from '$app/environment';

export function setUrlParam({
	key,
	value,
	defaultValue = ''
}: {
	key: string;
	value: string | string[] | number;
	defaultValue?: string | string[] | number;
}) {
	if (!browser) return;
	const url = new URL(window.location.href);
	const current = url.searchParams.get(key);
	const currentString = current === null ? '' : current;
	const valueString =
		typeof value === 'string' ? value : Array.isArray(value) ? value.join(',') : value.toString();
	const defaultValueString =
		typeof defaultValue === 'string'
			? defaultValue
			: Array.isArray(defaultValue)
			? defaultValue.join(',')
			: defaultValue.toString();
	if (currentString === valueString) return;
	if (valueString && valueString !== defaultValueString) {
		url.searchParams.set(key, valueString);
	} else {
		url.searchParams.delete(key);
	}
	const relativeUrl = url.pathname + url.search;
	window.history.replaceState(window.history.state, '', relativeUrl);
}
