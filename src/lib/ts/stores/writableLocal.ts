import { browser } from '$app/environment';
import { writable } from 'svelte/store';
import type { z } from 'zod';

type TWritableSharedParams<T> = {
	key: string;
	defaultValue: T;
	schema: z.Schema<T>;
	storage: Storage | null;
};

export function writableShared<T>({
	key,
	defaultValue,
	schema,
	storage
}: TWritableSharedParams<T>) {
	const {
		set: internalSet,
		subscribe: internalSubscribe,
		update: internalUpdate
	} = writable<T>(defaultValue);

	if (browser && storage) {
		const storedStr = storage.getItem(key);
		if (storedStr !== null) {
			try {
				const parsedValue = JSON.parse(storedStr);
				const realValue = schema.parse(parsedValue);
				internalSet(realValue);
			} catch (error) {
				console.log(`Error parsing local storage variable "${key}"`, error);
				storage.removeItem(key);
			}
		}
	}

	const localSet: typeof internalSet = (params) => {
		try {
			const value = schema.parse(params);
			const valueStr = JSON.stringify(value);
			if (browser && storage) {
				storage.setItem(key, valueStr);
			}
			internalSet(value);
		} catch (error) {
			console.log(`Error parsing local storage variable "${key}"`, error);
			if (browser && storage) {
				storage.removeItem(key);
			}
		}
	};

	const localSubscribe: typeof internalSubscribe = (params) => {
		return internalSubscribe(params);
	};

	const localUpdate: typeof internalUpdate = (params) => {
		internalUpdate(params);
	};

	const localDelete = () => {
		internalSet(defaultValue);
		if (!browser) return;
		localStorage.removeItem(key);
	};

	return {
		set: localSet,
		subscribe: localSubscribe,
		update: localUpdate,
		delete: localDelete
	};
}

export function writableLocal<T>(params: Omit<TWritableSharedParams<T>, 'storage'>) {
	return writableShared({
		...params,
		storage: browser ? localStorage : null
	});
}

export function writableSession<T>(params: Omit<TWritableSharedParams<T>, 'storage'>) {
	return writableShared({
		...params,
		storage: browser ? sessionStorage : null
	});
}
