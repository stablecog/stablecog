import type { LayoutLoad } from './$types';
import { loadLocaleAsync } from '$i18n/i18n-util.async';
import { writable } from 'svelte/store';
import type { TAvailableThemes } from '$ts/stores/theme';
import { apiUrl } from '$ts/constants/main';
import type { TUserSummary } from '$ts/stores/user/summary';
import { createSupabaseLoadClient } from '@supabase/auth-helpers-sveltekit';
import { env as envPublic } from '$env/dynamic/public';
import type { SupabaseClient } from '@supabase/supabase-js';

export const load: LayoutLoad = async (event) => {
	event.depends('supabase:auth');
	const supabase = createSupabaseLoadClient({
		supabaseUrl:
			envPublic.PUBLIC_APP_MODE === 'qa'
				? envPublic.PUBLIC_SUPABASE_URL_QA
				: envPublic.PUBLIC_APP_MODE === 'dev'
				? envPublic.PUBLIC_SUPABASE_URL
				: envPublic.PUBLIC_SUPABASE_URL,
		supabaseKey:
			envPublic.PUBLIC_APP_MODE === 'qa'
				? envPublic.PUBLIC_SUPABASE_ANON_KEY_QA
				: envPublic.PUBLIC_APP_MODE === 'dev'
				? envPublic.PUBLIC_SUPABASE_ANON_KEY
				: envPublic.PUBLIC_SUPABASE_ANON_KEY,
		event: { fetch },
		serverSession: event.data.session
	});
	let {
		data: { session }
	} = await supabase.auth.getSession();

	let userSummary: TUserSummary | undefined = undefined;
	if (session?.access_token) {
		try {
			const userRes = await fetch(`${apiUrl.origin}/v1/user`, {
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${session?.access_token}`
				}
			});
			if (userRes.ok) {
				const userResJson: TUserSummary = await userRes.json();
				userSummary = userResJson;
			}
		} catch (error) {
			console.log(error);
		}
	}
	const locale = event.data.locale;
	await loadLocaleAsync(locale);
	const theme = event.data.theme;
	const globalSeed = Math.round(Math.random() * Math.pow(10, 12));
	const isLeftSidebarHidden = event.data.isLeftSidebarHidden;

	return {
		locale,
		session: session as Session | null,
		supabase: supabase as SupabaseClient,
		theme,
		themeStore: writable<TAvailableThemes>('dark'),
		userSummary,
		userSummaryStore: writable<TUserSummary | undefined>(userSummary),
		globalSeed,
		globalSeedStore: writable<number>(globalSeed),
		isLeftSidebarHidden,
		isLeftSidebarHiddenStore: writable<boolean>(isLeftSidebarHidden)
	};
};
