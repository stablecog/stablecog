import { createServerClient } from '@supabase/ssr';
import type { Handle, RequestEvent } from '@sveltejs/kit';
import { initAcceptLanguageHeaderDetector } from 'typesafe-i18n/detectors';
import { detectLocale, isLocale } from '$i18n/i18n-util';
import { loadAllLocales } from '$i18n/i18n-util.sync';
import type { TAvailableTheme } from '$ts/stores/theme';
import { getApiUrl } from '$ts/constants/main';
import { galleryAdminAllowedRoutes, isGalleryAdmin, isSuperAdmin } from '$ts/helpers/admin/roles';
import { supabaseAnonKey, supabaseUrl } from '$ts/constants/supabase';
import { isKubeProbe, logger } from '$ts/constants/logger';

loadAllLocales();

export const handle: Handle = async ({ event, resolve }) => {
	const start = Date.now();
	const url = new URL(event.request.url);
	event.locals.supabase = createServerClient(supabaseUrl, supabaseAnonKey, {
		cookies: {
			getAll: () => event.cookies.getAll(),
			setAll: (cookiesToSet) => {
				cookiesToSet.forEach(({ name, value, options }) => {
					event.cookies.set(name, value, { ...options, path: '/' });
				});
			}
		}
	});

	event.locals.safeGetSession = async () => {
		const {
			data: { session }
		} = await event.locals.supabase.auth.getSession();
		if (!session) {
			return { session: null, user: null };
		}
		const {
			data: { user },
			error
		} = await event.locals.supabase.auth.getUser();
		if (error) {
			return { session: null, user: null };
		}
		return { session, user };
	};

	let preferredLocale = getPreferredLocale(event);
	const localeC = event.cookies.get('sc-locale');
	const themeC = event.cookies.get('sc-theme') as TAvailableTheme | null;
	const locale =
		localeC && isLocale(localeC) ? localeC : isLocale(preferredLocale) ? preferredLocale : 'en';
	const isLeftSidebarHiddenC = event.cookies.get('sc-l-sidebar-h') as string | null;
	event.locals.locale = locale;
	event.locals.theme = themeC === 'light' || themeC === 'dark' ? themeC : null;
	event.locals.isLeftSidebarHidden = isLeftSidebarHiddenC === 'true' ? true : false;

	let IP = event.request.headers.get('X-Forwarded-For');
	if (!IP) IP = event.request.headers.get('CF-Connecting-IP');
	if (!IP) IP = event.getClientAddress();
	event.locals.IP = IP;
	let countryCode = event.request.headers.get('x-vercel-ip-country');
	event.locals.countryCode = countryCode;

	// protect requests to all routes that start with /admin
	if (event.url.pathname.startsWith('/admin')) {
		const notSignedInRedirectRoute = `/sign-in?rd_to=${encodeURIComponent(event.url.pathname)}`;
		const notAuthorizedRedirectRoute = `/`;
		try {
			const { session, user } = await event.locals.safeGetSession();
			if (!session || !user || !user.id) {
				return notSignedInResponse(notSignedInRedirectRoute);
			}
			const res = await fetch(`${getApiUrl().origin}/v1/user`, {
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
			const response = await resolve(event, {
				filterSerializedResponseHeaders(name) {
					return name === 'content-range';
				}
			});
			response.headers.delete('link');
			if (!isKubeProbe(event.request.headers)) {
				logger.info(`'${url.pathname + url.search}' | ${Date.now() - start}ms`);
			}
			return response;
		} catch (error) {
			console.log('Admin access error:', error);
			return notAuthorizedResponse(notAuthorizedRedirectRoute);
		}
	}
	const response = await resolve(event, {
		filterSerializedResponseHeaders(name) {
			return name === 'content-range' || name === 'x-supabase-api-version';
		}
	});
	response.headers.delete('link');
	if (!isKubeProbe(event.request.headers)) {
		logger.info(`'${url.pathname + url.search}' | ${Date.now() - start}ms`);
	}
	/* const LINK_HEADER_LENGTH = 60;
	const linkHeaders = response.headers.get('Link');
	if (linkHeaders) {
		const newLinkHeadersArr = linkHeaders.split(', ');
		if (newLinkHeadersArr.length > LINK_HEADER_LENGTH) {
			response.headers.set('Link', newLinkHeadersArr.slice(0, LINK_HEADER_LENGTH).join(', '));
		}
	} */
	return response;
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
