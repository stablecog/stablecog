import { getSupabase } from '@supabase/auth-helpers-sveltekit';
import { initAcceptLanguageHeaderDetector } from 'typesafe-i18n/detectors';
import { detectLocale, isLocale } from '$i18n/i18n-util';
import { loadAllLocales } from '$i18n/i18n-util.sync';
import type { Handle, RequestEvent } from '@sveltejs/kit';
import '$ts/constants/supabase';
import type { TAvailableThemes } from '$ts/stores/theme';
import { apiUrl } from '$ts/constants/main';
import { galleryAdminAllowedRoutes, isGalleryAdmin, isSuperAdmin } from '$ts/helpers/admin/roles';

loadAllLocales();

export const handle: Handle = async ({ event, resolve }) => {
	let preferredLocale = getPreferredLocale(event);
	const localeC = event.cookies.get('sc-locale');
	const themeC = event.cookies.get('sc-theme') as TAvailableThemes | null;
	const advancedModeC =
		event.cookies.get('sc-advanced-mode') === 'true'
			? true
			: event.cookies.get('sc-advanced-mode') === 'false'
			? false
			: null;
	const locale =
		localeC && isLocale(localeC) ? localeC : isLocale(preferredLocale) ? preferredLocale : 'en';
	event.locals.locale = locale;
	event.locals.theme = themeC === 'light' || themeC === 'dark' ? themeC : null;
	event.locals.advancedMode = advancedModeC;

	let IP = event.request.headers.get('X-Forwarded-For');
	if (!IP) IP = event.request.headers.get('CF-Connecting-IP');
	if (!IP) IP = event.getClientAddress();
	event.locals.IP = IP;
	let countryCode = event.request.headers.get('x-vercel-ip-country');
	event.locals.countryCode = countryCode;

	// protect requests to all routes that start with /admin
	if (event.url.pathname.startsWith('/admin')) {
		const notSignedInRedirectRoute = `/sign-in?redirect_to=${encodeURIComponent(
			event.url.pathname
		)}`;
		const notAuthorizedRedirectRoute = `/`;
		try {
			const { session } = await getSupabase(event);
			const userId = session?.user?.id;
			if (!userId) {
				return notSignedInResponse(notSignedInRedirectRoute);
			}
			const res = await fetch(`${apiUrl.origin}/v1/user`, {
				method: 'GET',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${session.access_token}`
				}
			});
			if (!res.ok) {
				console.log('Not OK', res.status);
				return notAuthorizedResponse(notAuthorizedRedirectRoute);
			}
			const { roles } = await res.json();
			if (!isSuperAdmin(roles) && !isGalleryAdmin(roles)) {
				return notAuthorizedResponse(notAuthorizedRedirectRoute);
			}
			if (isGalleryAdmin(roles) && !galleryAdminAllowedRoutes.includes(event.url.pathname)) {
				return notAuthorizedResponse('/admin');
			}
			return resolve(event);
		} catch (error) {
			console.log('Admin access error:', error);
			return notAuthorizedResponse(notAuthorizedRedirectRoute);
		}
	}
	return resolve(event);
};

const getPreferredLocale = ({ request }: RequestEvent) => {
	const acceptLanguageDetector = initAcceptLanguageHeaderDetector(request);
	return detectLocale(acceptLanguageDetector);
};

const notAuthorizedResponse = (route: string) => {
	return new Response('Not authorized', {
		status: 303,
		headers: { location: route }
	});
};

const notSignedInResponse = (route: string) => {
	return new Response('Not logged in', {
		status: 303,
		headers: { location: route }
	});
};
