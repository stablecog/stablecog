import type { LayoutServerLoad } from './$types';
import { loadLocaleAsync } from '$i18n/i18n-util.async';
import type { TUserSummary } from '$ts/stores/user/summary';
import { getUserSummary } from '$ts/helpers/user/user';
import type { Session } from '@supabase/supabase-js';

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
	await loadLocaleAsync(locale);
	return {
		locale,
		session: session as Session | null,
		theme,
		userSummary,
		isLeftSidebarHidden
	};
};
