import { browser } from '$app/environment';
import { sessionWritable as writable } from '@macfja/svelte-persistent-store';

export function sessionAndUrlParamWritable<T>(key: string, paramKey: string, defaultValue: T) {
	const {
		set: _set,
		delete: _delete,
		subscribe: _subscribe,
		update: _update
	} = writable<T>(key, defaultValue);

	const set: typeof _set = (params) => {
		_set(params);
		setUrlSearchParam({ key: paramKey, value: params, defaultValue });
	};

	const del: typeof _delete = () => {
		_delete();
	};

	const subscribe: typeof _subscribe = (params) => {
		return _subscribe(params);
	};

	const update: typeof _update = (params) => {
		_update(params);
	};

	return {
		set,
		delete: del,
		subscribe,
		update
	};
}

export function setUrlSearchParam<T>({
	key,
	value,
	defaultValue
}: {
	key: string;
	value: T;
	defaultValue?: T;
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
				: defaultValue === undefined || defaultValue === null
					? ''
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
