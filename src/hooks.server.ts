import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { initAcceptLanguageHeaderDetector } from 'typesafe-i18n/detectors';
import { detectLocale, isLocale } from '$i18n/i18n-util';
import { loadAllLocales } from '$i18n/i18n-util.sync';
import type { Handle } from '@sveltejs/kit';
import type { RequestEvent } from '.svelte-kit/types/src/routes/$types';

loadAllLocales();

export const handle: Handle = async ({ event, resolve }) => {
	let preferredLocale = getPreferredLocale(event);
	const locale = isLocale(preferredLocale) ? preferredLocale : 'en';
	event.locals.locale = locale;
	// protect requests to all routes that start with /admin (except login)
	if (event.url.pathname.startsWith('/admin') && event.url.pathname !== '/admin/login') {
		try {
			const { session, supabaseClient: _supabaseClient } = await getSupabase(event);
			const userId = session?.user?.id;
			const { data, error } = await _supabaseClient.from('admin').select('id');
			const admins = data?.map((a) => a.id);
			if (data && !error && admins && admins.includes(userId)) {
				console.log('Admin user access:', userId);
			} else {
				console.log('Non-admin user access:', userId);
				return new Response(null, { status: 303, headers: { location: '/admin/login' } });
			}
		} catch (error) {
			console.log('Admin access error:', error);
			return new Response(null, { status: 303, headers: { location: '/admin/login' } });
		}
	}
	return resolve(event);
};

const getPreferredLocale = ({ request }: RequestEvent) => {
	const acceptLanguageDetector = initAcceptLanguageHeaderDetector(request);
	return detectLocale(acceptLanguageDetector);
};
