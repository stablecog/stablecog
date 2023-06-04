import type { LayoutLoad } from './$types';
import { loadLocaleAsync } from '$i18n/i18n-util.async';
import { writable } from 'svelte/store';
import type { TAvailableThemes } from '$ts/stores/theme';
import type { TUserSummary } from '$ts/stores/user/summary';
import { createSupabaseLoadClient } from '@supabase/auth-helpers-sveltekit';
import { env as envPublic } from '$env/dynamic/public';
import type { SupabaseClient } from '@supabase/supabase-js';
import { getUserSummary } from '$ts/helpers/user/user';

export const load: LayoutLoad = async (event) => {
	event.depends('supabase:auth');
	const supabase = createSupabaseLoadClient({
		supabaseUrl:
			envPublic.PUBLIC_APP_MODE === 'qa'
				? envPublic.PUBLIC_SUPABASE_URL_QA || ''
				: envPublic.PUBLIC_APP_MODE === 'dev'
				? envPublic.PUBLIC_SUPABASE_URL || ''
				: envPublic.PUBLIC_SUPABASE_URL || '',
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
	if (event.data.userSummary) {
		userSummary = event.data.userSummary;
	} else if (session?.access_token) {
		try {
			const summary = await getUserSummary(session.access_token);
			if (summary) {
				userSummary = summary;
			}
		} catch (error) {
			console.log('/v1/user error', error);
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
		isLeftSidebarHiddenStore: writable<boolean>(isLeftSidebarHidden),
		dirTree: writable<TDirTreeItem[]>([])
	};
};

export interface TDirTreeItem {
	title: string;
	href: string;
}
