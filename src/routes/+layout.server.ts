import type { LayoutServerLoad } from './$types';
import { getServerSession, getSupabase } from '@supabase/auth-helpers-sveltekit';
import { loadLocaleAsync } from '$i18n/i18n-util.async';

export const load: LayoutServerLoad = async (event) => {
	let session = await getServerSession(event);
	const locale = event.locals.locale;
	const theme = event.locals.theme;
	const advancedMode = event.locals.advancedMode;
	await loadLocaleAsync(locale);
	return {
		locale,
		session,
		theme,
		advancedMode
	};
};
