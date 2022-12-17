import type { LayoutLoad } from './$types';
import { loadLocaleAsync } from '$i18n/i18n-util.async';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';

export const load: LayoutLoad = async (event) => {
	const locale = event.data.locale;
	// load locale dictionary into memory
	await loadLocaleAsync(locale);
	const { session } = await getSupabase(event);
	return { locale, session };
};
