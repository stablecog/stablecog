import type { LayoutServerLoad } from './$types';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { loadLocaleAsync } from '$i18n/i18n-util.async';
import type { IStripeSubscriptionTier } from '$ts/types/stripe';

export const load: LayoutServerLoad = async (event) => {
	let tier: IStripeSubscriptionTier = 'FREE';
	const { supabaseClient, session } = await getSupabase(event);
	if (session?.user.id) {
		try {
			const { data } = await supabaseClient
				.from('user')
				.select('subscription_tier')
				.eq('id', session.user.id)
				.maybeSingle();
			if (data && data.subscription_tier) {
				tier = data.subscription_tier;
			}
		} catch (error) {
			console.error(error);
		}
	}
	const locale = event.locals.locale;
	await loadLocaleAsync(locale);
	return {
		locale,
		session,
		tier
	};
};
