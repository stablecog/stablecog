import { loadLocaleAsync } from '$i18n/i18n-util.async';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	const { cookies } = event;
	const locale = event.locals.locale;
	const theme = event.locals.theme;
	const isLeftSidebarHidden = event.locals.isLeftSidebarHidden;
	const globalSeed = Math.round(Math.random() * Math.pow(10, 12));
	await loadLocaleAsync(locale);
	return {
		locale,
		theme,
		isLeftSidebarHidden,
		globalSeed,
		cookies: cookies.getAll()
	};
};
