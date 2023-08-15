import type { LayoutLoad } from './$types';
import { loadLocaleAsync } from '$i18n/i18n-util.async';
import { writable } from 'svelte/store';
import type { TAvailableThemes } from '$ts/stores/theme';
import type { TUserSummary } from '$ts/stores/user/summary';
import { createSupabaseLoadClient } from '@supabase/auth-helpers-sveltekit';
import type { SupabaseClient } from '@supabase/supabase-js';
import { getUserSummary } from '$ts/helpers/user/user';
import { supabaseAnonKey, supabaseUrl } from '$ts/constants/supabase';

export const load: LayoutLoad = async (event) => {
	event.depends('supabase:auth');
	const supabase = createSupabaseLoadClient({
		supabaseUrl: supabaseUrl,
		supabaseKey: supabaseAnonKey,
		event: { fetch },
		serverSession: event.data.session
	});
	let {
		data: { session }
	} = await supabase.auth.getSession();

	let userSummary: TUserSummary | undefined = undefined;
	if (event.data.userSummary) {
		userSummary = event.data.userSummary;
	} else if (session && session.access_token && session.expires_in > 3) {
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
