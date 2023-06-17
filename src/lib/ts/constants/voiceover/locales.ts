import { browser } from '$app/environment';
import { locale } from '$i18n/i18n-svelte';
import { languageName } from '$ts/helpers/language';
import type { TTab } from '$ts/types/main';
import { derived } from 'svelte/store';

export type TVoiceoverLocale =
	| 'de'
	| 'en'
	| 'es'
	| 'fr'
	| 'hi'
	| 'it'
	| 'ja'
	| 'ko'
	| 'pl'
	| 'pt'
	| 'ru'
	| 'tr'
	| 'zh';

export const voiceoverLocaleDropdownItems = derived([locale], ([$locale]) => {
	const items: TTab<TVoiceoverLocale>[] = [
		{
			label: browser ? languageName($locale).of('en') || 'en' : 'en',
			value: 'en'
		},
		{
			label: browser ? languageName($locale).of('de') || 'de' : 'de',
			value: 'de'
		},
		{
			label: browser ? languageName($locale).of('es') || 'es' : 'es',
			value: 'es'
		},
		/* {
			label: browser ? languageName($locale).of('fr') || 'fr' : 'fr',
			value: 'fr'
		},
		{
			label: browser ? languageName($locale).of('hi') || 'hi' : 'hi',
			value: 'hi'
		},
		{
			label: browser ? languageName($locale).of('it') || 'it' : 'it',
			value: 'it'
		},*/
		{
			label: browser ? languageName($locale).of('ja') || 'ja' : 'ja',
			value: 'ja'
		},
		/* {
			label: browser ? languageName($locale).of('ko') || 'ko' : 'ko',
			value: 'ko'
		},
		{
			label: browser ? languageName($locale).of('pl') || 'pl' : 'pl',
			value: 'pl'
		},
		{
			label: browser ? languageName($locale).of('pt') || 'pt' : 'pt',
			value: 'pt'
		}, */
		{
			label: browser ? languageName($locale).of('ru') || 'ru' : 'ru',
			value: 'ru'
		},
		{
			label: browser ? languageName($locale).of('tr') || 'tr' : 'tr',
			value: 'tr'
		},
		{
			label: browser ? languageName($locale).of('zh') || 'zh' : 'zh',
			value: 'zh'
		}
	];
	return items;
});
