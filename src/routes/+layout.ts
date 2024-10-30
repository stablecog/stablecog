import type { LayoutLoad } from './$types';
import { loadLocaleAsync } from '$i18n/i18n-util.async';
import { writable } from 'svelte/store';
import type { TAvailableTheme } from '$ts/stores/theme';
import type { TUserSummary } from '$ts/stores/user/summary';
import { getUserSummary } from '$ts/helpers/user/user';
import { supabaseAnonKey, supabaseUrl } from '$ts/constants/supabase';
import { createBrowserClient, createServerClient, isBrowser } from '@supabase/ssr';
import { browser } from '$app/environment';
import { logger } from '$ts/constants/loggerBrowser';

export const load: LayoutLoad = async (event) => {
	const { depends, data, fetch } = event;
	depends('supabase:auth');

	const supabase = isBrowser()
		? createBrowserClient(supabaseUrl, supabaseAnonKey, {
				global: {
					fetch
				}
			})
		: createServerClient(supabaseUrl, supabaseAnonKey, {
				global: {
					fetch
				},
				cookies: {
					getAll() {
						return data.cookies;
					}
				}
			});

	const {
		data: { session }
	} = await supabase.auth.getSession();

	const {
		data: { user }
	} = await supabase.auth.getUser();

	const startUserSummary = Date.now();
	let userSummary: TUserSummary | undefined = undefined;
	if (user && session) {
		try {
			const summary = await getUserSummary(session.access_token);
			if (!browser) {
				logger.info(`[+layout.ts] | getUserSummary | ${Date.now() - startUserSummary}ms`);
			}
			if (summary) {
				userSummary = summary;
			}
		} catch (error) {
			logger.error('getUserSummary error', error);
		}
	}
	const locale = event.data.locale;
	await loadLocaleAsync(locale);
	const theme = event.data.theme;
	const isLeftSidebarHidden = event.data.isLeftSidebarHidden;

	return {
		locale,
		session,
		user,
		supabase,
		theme,
		themeStore: writable<TAvailableTheme>('dark'),
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
