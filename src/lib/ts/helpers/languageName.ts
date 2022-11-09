import type { Locales } from '$i18n/i18n-types';

export const languageName = (locale: Locales) => {
	return new Intl.DisplayNames([locale], {
		type: 'language'
	});
};
