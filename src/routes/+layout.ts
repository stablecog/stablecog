import type { LayoutLoad } from './$types';
import { loadLocaleAsync } from '$i18n/i18n-util.async';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { writable } from 'svelte/store';
import type { TAvailableThemes } from '$ts/stores/theme';
import { apiUrl } from '$ts/constants/main';
import type { TUserSummary } from '$ts/stores/user/summary';

export const load: LayoutLoad = async (event) => {
	let { session } = await getSupabase(event);
	let userSummary: TUserSummary | undefined = undefined;
	const userRes = await fetch(`${apiUrl}v1/user`, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${session?.access_token}`
		}
	});
	if (userRes.ok) {
		const userResJson: TUserSummary = await userRes.json();
		userSummary = userResJson;
	}
	const locale = event.data.locale;
	await loadLocaleAsync(locale);
	const theme = event.data.theme;
	const advancedMode = event.data.advancedMode;
	return {
		locale,
		session,
		theme,
		advancedMode,
		advancedModeStore: writable(false),
		themeStore: writable<TAvailableThemes>('dark'),
		globalSeedStore: writable<number>(Math.round(Math.random() * Math.pow(10, 12))),
		userSummary
	};
};
