import { browser } from '$app/environment';
import { replaceState } from '$app/navigation';

export function setUrlSearchParam({
	key,
	value,
	defaultValue = ''
}: {
	key: string;
	value: string | string[] | number | null | undefined;
	defaultValue?: string | string[] | number;
}) {
	if (!browser) return;
	const url = new URL(window.location.href);
	const current = url.searchParams.get(key);
	const currentValueString = current === null ? '' : current;
	const defaultValueString =
		typeof defaultValue === 'string'
			? defaultValue
			: Array.isArray(defaultValue)
				? defaultValue.join(',')
				: defaultValue.toString();
	const toBeValueString =
		value === null || value === undefined
			? ''
			: typeof value === 'string'
				? value
				: Array.isArray(value)
					? value.join(',')
					: value.toString();

	if (currentValueString === '' && toBeValueString === defaultValueString) return;
	if (toBeValueString === currentValueString && toBeValueString !== defaultValueString) return;

	if (toBeValueString !== currentValueString && toBeValueString !== defaultValueString) {
		url.searchParams.set(key, toBeValueString);
	} else {
		url.searchParams.delete(key);
	}

	const relativeUrl = url.pathname + url.search;
	window.history.replaceState(window.history.state, '', relativeUrl);
}
