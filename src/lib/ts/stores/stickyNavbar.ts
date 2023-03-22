import { page } from '$app/stores';
import { mdBreakpoint } from '$components/generationFullScreen/constants';
import { isAdminGalleryEditActive } from '$ts/stores/admin/gallery';
import { isUserGalleryEditActive } from '$ts/stores/user/gallery';
import { windowWidth } from '$ts/stores/window';
import type { Page } from '@sveltejs/kit';
import { derived, type Readable } from 'svelte/store';

type TNavbarStickyType = 'auto' | 'sticky' | 'not-sticky';

interface TNavbarRouteDefinition {
	pathname: string;
	stickyType: TNavbarStickyType;
}

export const navbarRouteDefinitions = derived(
	[isAdminGalleryEditActive, isUserGalleryEditActive, windowWidth],
	([$isAdminGalleryEditActive, $isUserGalleryEditActive, $windowWidth]) => {
		const routeDefinitions: TNavbarRouteDefinition[] = [
			{ pathname: '/admin/gallery', stickyType: $isAdminGalleryEditActive ? 'not-sticky' : 'auto' },
			{
				pathname: '/history',
				stickyType: $isUserGalleryEditActive
					? 'not-sticky'
					: $windowWidth < mdBreakpoint
					? 'auto'
					: 'sticky'
			},
			{ pathname: '/gallery', stickyType: $windowWidth < mdBreakpoint ? 'auto' : 'sticky' },
			{ pathname: '/', stickyType: $windowWidth < mdBreakpoint ? 'auto' : 'sticky' }
		];
		return routeDefinitions;
	}
);

export const navbarStickyType = derived<
	[Readable<TNavbarRouteDefinition[]>, Readable<Page<Record<string, string>, string | null>>],
	TNavbarStickyType
>([navbarRouteDefinitions, page], ([$navbarRouteDefinitions, $page]) => {
	const route = $navbarRouteDefinitions.find((r) => r.pathname === $page.url.pathname);
	if (!route) {
		return 'sticky';
	}
	return route.stickyType;
});
