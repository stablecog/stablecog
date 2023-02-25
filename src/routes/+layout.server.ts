import type { LayoutServerLoad } from './$types';
import { getServerSession, getSupabase } from '@supabase/auth-helpers-sveltekit';
import { loadLocaleAsync } from '$i18n/i18n-util.async';
import { apiUrl } from '$ts/constants/main';

export const load: LayoutServerLoad = async (event) => {
	let session = await getServerSession(event);
	let userSummary: TUserSummary | undefined = undefined;
	const userRes = await fetch(`${apiUrl}v1/user`, {
		headers: {
			'Content-Type': 'application/json',
			Authorization: `Bearer ${session?.access_token}`
		}
	});
	if (userRes.ok) {
		const userResJson: TUserSummary = await userRes.json();
		console.log(userResJson);
	}
	const locale = event.locals.locale;
	const theme = event.locals.theme;
	const advancedMode = event.locals.advancedMode;
	await loadLocaleAsync(locale);
	return {
		locale,
		session,
		theme,
		advancedMode
	};
};

export interface TUserSummary {
	total_remaining_credits: number;
	product?: string;
}
