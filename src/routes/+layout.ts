import type { LayoutLoad } from './$types';
import { loadLocaleAsync } from '$i18n/i18n-util.async';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import type { IUserPlan } from '$ts/types/stripe';
import { writable } from 'svelte/store';
import type { TAvailableThemes } from '$ts/stores/theme';

export const load: LayoutLoad = async (event) => {
	let { session } = await getSupabase(event);
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
		themeStore: writable<TAvailableThemes>('dark')
	};
};
