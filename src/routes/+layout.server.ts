import type { LayoutServerLoad } from './$types';
import { getServerSession } from '@supabase/auth-helpers-sveltekit';
import { loadLocaleAsync } from '$i18n/i18n-util.async';
import type { TUserSummary } from '$ts/stores/user/summary';
import { getUserSummary } from '$ts/helpers/user/user';

export const load: LayoutServerLoad = async (event) => {
	let session = await getServerSession(event);
	let userSummary: TUserSummary | undefined = undefined;
	if (session?.access_token) {
		try {
			const summary = await getUserSummary(session?.access_token);
			if (summary) {
				userSummary = summary;
			} else {
				session = null;
			}
		} catch (error) {
			console.log('/v1/user error', error);
		}
	}
	const locale = event.locals.locale;
	const theme = event.locals.theme;
	const advancedMode = event.locals.advancedMode;
	await loadLocaleAsync(locale);
	return {
		locale,
		session,
		theme,
		advancedMode,
		userSummary
	};
};
