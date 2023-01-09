import type { LayoutLoad } from './$types';
import { loadLocaleAsync } from '$i18n/i18n-util.async';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import type { IUserPlan } from '$ts/types/stripe';
import { writable } from 'svelte/store';
import type { TAvailableThemes } from '$ts/stores/theme';

export const load: LayoutLoad = async (event) => {
	let plan: IUserPlan = 'ANONYMOUS';
	let { supabaseClient, session } = await getSupabase(event);
	const maxExpire = 60 * 60 * 1.1;
	const now = Math.round(Date.now() / 1000);
	if (session && session.expires_at && session.expires_at - now > maxExpire) {
		try {
			let { data, error } = await supabaseClient.auth.refreshSession(session);
			if (error) {
				throw Error(error.message);
			}
			if (data) {
				session = data.session;
			}
		} catch (error) {
			session = null;
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
			supabaseClient.auth.refreshSession();
			console.log(error);
		}
	}
	const locale = event.data.locale;
	await loadLocaleAsync(locale);
	const theme = event.data.theme;
	const advancedMode = event.data.advancedMode;
	return {
		locale,
		session,
		plan,
		theme,
		advancedMode,
		advancedModeStore: writable(false),
		themeStore: writable<TAvailableThemes>('dark')
	};
};
