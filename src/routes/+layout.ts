import type { LayoutLoad } from './$types';
import { loadLocaleAsync } from '$i18n/i18n-util.async';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import type { IStripeSubscriptionTier } from '$ts/types/stripe';

export const load: LayoutLoad = async (event) => {
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
			console.log(error);
		}
	}
	const locale = event.data.locale;
	await loadLocaleAsync(locale);
	const theme = event.data.theme;
	const advancedMode = event.data.advancedMode;
	return { locale, session, tier, theme, advancedMode };
};
