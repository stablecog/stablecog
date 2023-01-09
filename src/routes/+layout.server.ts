import type { LayoutServerLoad } from './$types';
import { getServerSession, getSupabase } from '@supabase/auth-helpers-sveltekit';
import { loadLocaleAsync } from '$i18n/i18n-util.async';
import type { IUserPlan } from '$ts/types/stripe';

export const load: LayoutServerLoad = async (event) => {
	let plan: IUserPlan = 'ANONYMOUS';
	let session = await getServerSession(event);
	const { supabaseClient } = await getSupabase(event);
	if (session) {
		let { data, error } = await supabaseClient.auth.refreshSession(session);
		if (data) {
			session = data.session;
		}
	}
	if (session?.user.id) {
		try {
			const { data } = await supabaseClient
				.from('user')
				.select('subscription_tier')
				.eq('id', session.user.id)
				.maybeSingle();
			if (data && data.subscription_tier) {
				plan = data.subscription_tier;
			}
		} catch (error) {
			console.error(error);
		}
	}
	const locale = event.locals.locale;
	const theme = event.locals.theme;
	const advancedMode = event.locals.advancedMode;
	await loadLocaleAsync(locale);
	return {
		locale,
		session,
		plan,
		theme,
		advancedMode
	};
};
