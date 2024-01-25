import type { LayoutLoad } from './$types';
import { loadLocaleAsync } from '$i18n/i18n-util.async';
import { writable } from 'svelte/store';
import type { TAvailableThemes } from '$ts/stores/theme';
import type { TUserSummary } from '$ts/stores/user/summary';
import type { SupabaseClient } from '@supabase/supabase-js';
import { getUserSummary } from '$ts/helpers/user/user';
import { supabaseAnonKey, supabaseUrl } from '$ts/constants/supabase';
import { createBrowserClient, isBrowser, parse } from '@supabase/ssr';

// const pages = import.meta.glob('./**/*.*');
/* let usernameBlacklistSet = new Set<string>();
for (const path in pages) {
	const parts = path.split('/');
	usernameBlacklistSet.add(parts[1]);
	usernameBlacklistSet.add(parts[2]);
}
const usernameBlacklist = Array.from(usernameBlacklistSet).filter(
	(username) => username !== undefined
);
console.log(usernameBlacklist); */

export const load: LayoutLoad = async (event) => {
	const { depends, data, fetch } = event;
	depends('supabase:auth');
	const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey, {
		global: {
			fetch
		},
		cookies: {
			get(key) {
				if (!isBrowser()) {
					return JSON.stringify(data.session);
				}

				const cookie = parse(document.cookie);
				return cookie[key];
			}
		}
	});
	const {
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
	const isLeftSidebarHidden = event.data.isLeftSidebarHidden;
	return {
		locale,
		session,
		supabase,
		theme,
		themeStore: writable<TAvailableThemes>('dark'),
		userSummary,
		userSummaryStore: writable<TUserSummary | undefined>(userSummary),
		globalSeed: event.data.globalSeed,
		globalSeedStore: writable<number>(event.data.globalSeed),
		isLeftSidebarHidden,
		isLeftSidebarHiddenStore: writable<boolean>(isLeftSidebarHidden),
		dirTree: writable<TDirTreeItem[]>([])
	};
};

export interface TDirTreeItem {
	title: string;
	href: string;
}
