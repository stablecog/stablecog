import { page } from '$app/stores';
import { mdBreakpoint } from '$components/generationFullScreen/constants';
import { isAdminGalleryEditActive } from '$ts/stores/admin/gallery';
import { isUserGalleryEditActive } from '$ts/stores/user/gallery';
import { windowWidth } from '$ts/stores/window';
import type { Page } from '@sveltejs/kit';
import { derived, type Readable } from 'svelte/store';

type TNavbarStickyType = 'auto-hiding' | 'fixed' | 'relative';

interface TNavbarRouteDefinition {
	pathname: string;
	stickyType: TNavbarStickyType;
	noStartsWith?: boolean;
}

export const navbarRouteDefinitions = derived(
	[isAdminGalleryEditActive, isUserGalleryEditActive, windowWidth],
	([$isAdminGalleryEditActive, $isUserGalleryEditActive, $windowWidth]) => {
		const routeDefinitions: TNavbarRouteDefinition[] = [
			{
				pathname: '/history',
				stickyType: $isUserGalleryEditActive
					? 'relative'
					: $windowWidth < mdBreakpoint
					? 'auto-hiding'
					: 'fixed'
			},
			{ pathname: '/gallery', stickyType: $windowWidth < mdBreakpoint ? 'auto-hiding' : 'fixed' },
			{ pathname: '/blog', stickyType: $windowWidth < mdBreakpoint ? 'auto-hiding' : 'fixed' },
			{ pathname: '/guide', stickyType: $windowWidth < mdBreakpoint ? 'auto-hiding' : 'fixed' },
			{ pathname: '/docs', stickyType: $windowWidth < mdBreakpoint ? 'auto-hiding' : 'fixed' },
			{
				pathname: '/admin/gallery',
				stickyType: $isAdminGalleryEditActive
					? 'relative'
					: $windowWidth < mdBreakpoint
					? 'auto-hiding'
					: 'fixed'
			},
			{
				pathname: '/admin/users',
				stickyType: $windowWidth < mdBreakpoint ? 'auto-hiding' : 'fixed'
			},
			{
				pathname: '/generate',
				stickyType: 'relative'
			},
			{
				pathname: '/voiceover/generate',
				stickyType: 'relative'
			},
			{
				pathname: '/admin/voiceover/generate',
				stickyType: 'relative'
			},
			{
				pathname: '/',
				stickyType: 'fixed',
				noStartsWith: true
			}
		];
		return routeDefinitions;
	}
);

export const navbarStickyType = derived<
	[Readable<TNavbarRouteDefinition[]>, Readable<Page<Record<string, string>, string | null>>],
	TNavbarStickyType
>([navbarRouteDefinitions, page], ([$navbarRouteDefinitions, $page]) => {
	const route = $navbarRouteDefinitions.find(
		(r) =>
			r.pathname === $page.url.pathname ||
			(!r.noStartsWith && $page.url.pathname.startsWith(r.pathname))
	);
	if (!route) {
		return 'fixed';
	}
	return route.stickyType;
});

export const noCreditInfoRoutes = ['/guide', '/docs', '/try'];

export const isNoCreditsInfoRoute = derived<
	[Readable<Page<Record<string, string>, string | null>>],
	boolean
>([page], ([$page]) => {
	return noCreditInfoRoutes.some((r) => $page.url.pathname.startsWith(r));
});
