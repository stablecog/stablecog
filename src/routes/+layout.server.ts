import type { LayoutServerLoad } from './$types';
import { getServerSession } from '@supabase/auth-helpers-sveltekit';
import { loadLocaleAsync } from '$i18n/i18n-util.async';

export const prerender = false;
export const load: LayoutServerLoad = async (event) => {
	const session = await getServerSession(event);
	const locale = event.locals.locale;
	await loadLocaleAsync(locale);
	return {
		locale,
		session
	};
};
