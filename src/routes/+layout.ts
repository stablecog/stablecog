import type { LayoutLoad } from './$types';
import { loadLocaleAsync } from '$i18n/i18n-util.async';

export const load: LayoutLoad = async ({ data: { locale } }) => {
	// load dictionary into memory
	await loadLocaleAsync(locale);
	// pass locale to the "rendering context"
	return { locale, session: null };
};
