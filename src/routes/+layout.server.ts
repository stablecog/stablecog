import type { LayoutServerLoad } from './$types';
import { getServerSession, getSupabase } from '@supabase/auth-helpers-sveltekit';
import { loadLocaleAsync } from '$i18n/i18n-util.async';
import type { IUserPlan } from '$ts/types/stripe';

export const load: LayoutServerLoad = async (event) => {
	let plan: IUserPlan = 'ANONYMOUS';
	let session = await getServerSession(event);
	const { supabaseClient } = await getSupabase(event);
	if (session?.user.id) {
		try {
			const { data } = await supabaseClient
				.from('user')
				.select('subscription_tier')
				.eq('id', session.user.id)
				.maybeSingle();
			if (data && data.subscription_tier) {
				plan = data.subscription_tier;
			} else {
				let { data } = await supabaseClient.auth.refreshSession(session);
				if (data && data.session) {
					session = data.session;
					const { data: userData } = await supabaseClient
						.from('user')
						.select('subscription_tier')
						.eq('id', session.user.id)
						.maybeSingle();
					if (userData && userData.subscription_tier) {
						plan = userData.subscription_tier;
					} else throw Error('No user found');
				} else throw Error('No session found');
			}
		} catch (error) {
			session = null;
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
