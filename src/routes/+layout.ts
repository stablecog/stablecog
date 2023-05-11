import type { LayoutLoad } from './$types';
import { loadLocaleAsync } from '$i18n/i18n-util.async';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { writable } from 'svelte/store';
import type { TAvailableThemes } from '$ts/stores/theme';
import { apiUrl } from '$ts/constants/main';
import type { TUserSummary } from '$ts/stores/user/summary';
import { isHydrated } from '$ts/helpers/isHydrated';

export const load: LayoutLoad = async (event) => {
	let { session } = await getSupabase(event);
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
			} else {
				session = null;
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
		session,
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
