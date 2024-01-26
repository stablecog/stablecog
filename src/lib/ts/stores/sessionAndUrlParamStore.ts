import { browser } from '$app/environment';
import { sessionWritable } from '@macfja/svelte-persistent-store';

export function sessionAndUrlParamWritable<T>(
	sessionKey: string,
	paramKey: string,
	defaultValue: T
) {
	const {
		set: sessionSet,
		delete: sessionDelete,
		subscribe: sessionSubscribe,
		update: sessionUpdate
	} = sessionWritable<T>(sessionKey, defaultValue);

	const set: typeof sessionSet = (params) => {
		sessionSet(params);
		setUrlSearchParam({ key: paramKey, value: params, defaultValue });
	};

	const del: typeof sessionDelete = () => {
		sessionDelete();
	};

	const subscribe: typeof sessionSubscribe = (params) => {
		return sessionSubscribe(params);
	};

	const update: typeof sessionUpdate = (params) => {
		sessionUpdate(params);
	};

	return {
		set,
		del,
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
