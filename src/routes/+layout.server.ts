import { loadLocaleAsync } from '$i18n/i18n-util.async';
import { getUserSummary } from '$ts/helpers/user/user';
import type { TUserSummary } from '$ts/stores/user/summary';
import type { Session } from '@supabase/supabase-js';
import type { LayoutServerLoad } from './$types';

export const load: LayoutServerLoad = async (event) => {
	let session = await event.locals.getSession();
	let userSummary: TUserSummary | undefined = undefined;
	if (session && session.access_token && session.expires_in > 3) {
		try {
			const summary = await getUserSummary(session.access_token);
			if (summary) {
				userSummary = summary;
			}
		} catch (error) {
			console.log('/v1/user error', error);
		}
	}
	const locale = event.locals.locale;
	const theme = event.locals.theme;
	const isLeftSidebarHidden = event.locals.isLeftSidebarHidden;
	const globalSeed = Math.round(Math.random() * Math.pow(10, 12));
	await loadLocaleAsync(locale);
	return {
		locale,
		session,
		theme,
		userSummary,
		isLeftSidebarHidden,
		globalSeed
	};
};
