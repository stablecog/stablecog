import { supabaseClient } from '$ts/constants/supabaseClient';
import { supabaseAdmin } from '$ts/constants/supabaseAdmin';
import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import type { Handle, RequestEvent } from '@sveltejs/kit';
import { initAcceptLanguageHeaderDetector } from 'typesafe-i18n/detectors';
import { detectLocale, isLocale } from '$i18n/i18n-util';
import { loadAllLocales } from '$i18n/i18n-util.sync';

loadAllLocales();

export const handle: Handle = async ({ event, resolve }) => {
	let preferredLocale = getPreferredLocale(event);
	const locale = isLocale(preferredLocale) ? preferredLocale : 'en';
	event.locals.locale = locale;
	// protect requests to all routes that start with /admin (except login)
	if (event.url.pathname.startsWith('/admin') && event.url.pathname !== '/admin/login') {
		if (!supabaseClient || !supabaseAdmin) return Response.redirect(`${event.url.origin}/`, 303);
		const { session, supabaseClient: _supabaseClient } = await getSupabase(event);
		const userId = session?.user?.id;
		const { data, error } = await _supabaseClient.from('admin').select('id');
		const admins = data?.map((a) => a.id);
		if (data && !error && admins && admins.includes(userId)) {
			console.log('Admin user access:', userId);
		} else {
			console.log('Non-admin user access:', userId);
			return Response.redirect(`${event.url.origin}/admin/login`, 303);
		}
	}
	return resolve(event);
};

const getPreferredLocale = ({ request }: RequestEvent) => {
	const acceptLanguageDetector = initAcceptLanguageHeaderDetector(request);
	return detectLocale(acceptLanguageDetector);
};
