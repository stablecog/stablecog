import { page } from '$app/stores';
import LL from '$i18n/i18n-svelte';
import { isAdmin, isSuperAdmin } from '$ts/helpers/admin/roles';
import { userSummary } from '$ts/stores/user/summary';
import { derived } from 'svelte/store';

export const regularRoutes = derived([LL, userSummary], ([$LL, $userSummary]) => {
	const routes: TNavbarRoute[] = [
		{
			name: $LL.Navbar.GenerateTab(),
			href: '/generate',
			icon: 'generate'
		},
		{
			name: $LL.Navbar.HistoryTab(),
			href: '/history',
			icon: 'history'
		},
		{
			name: $LL.Navbar.GalleryTab(),
			href: '/gallery',
			icon: 'gallery'
		},
		$userSummary?.product_id
			? {
					name: $LL.Navbar.AccountTab(),
					href: '/account',
					icon: 'account'
			  }
			: {
					name: $LL.Navbar.PricingTab(),
					href: '/pricing',
					icon: 'pricing'
			  }
	];
	return routes;
});

export const superAdminRoutes = derived([LL], ([$LL]) => {
	const routes: TNavbarRoute[] = [
		{
			name: $LL.Admin.UsersTab(),
			href: '/admin/users',
			icon: 'users'
		}
	];
	return routes;
});

export const adminRoutes = derived(
	[LL, userSummary, superAdminRoutes],
	([$LL, $userSummary, $superAdminRoutes]) => {
		const routes: TNavbarRoute[] = [
			{
				name: $LL.Admin.AdminTab(),
				href: '/admin',
				icon: 'admin',
				strictMatch: true
			},
			{
				name: $LL.Navbar.AdminGalleryTab(),
				href: '/admin/gallery',
				icon: 'gallery'
			},
			...(isSuperAdmin($userSummary?.roles || []) ? $superAdminRoutes : [])
		];
		return routes;
	}
);

export const routes = derived(
	[page, regularRoutes, adminRoutes],
	([$page, $regularRoutes, $adminRoutes]) => {
		return $page.url.pathname.startsWith('/admin') ? $adminRoutes : $regularRoutes;
	}
);

export const extraRoutes = derived([LL], ([$LL]) => {
	const routes: TNavbarRoute[] = [
		{
			name: $LL.Guide.PageTitle(),
			href: '/guide',
			icon: 'guide'
		},
		{
			name: $LL.Blog.TitleAlt(),
			href: '/blog',
			icon: 'blog'
		},
		{
			name: $LL.Navbar.LiveTab(),
			href: '/live',
			icon: 'live'
		}
	];
	return routes;
});

export const routesDrawer = derived(
	[regularRoutes, extraRoutes, adminRoutes, userSummary, page],
	([$regularRoutes, $extraRoutes, $adminRoutes, $userSummary, $page]) => {
		let routes = [...$regularRoutes, ...$extraRoutes];
		const userIsAdmin = isAdmin($userSummary?.roles);
		if (userIsAdmin) {
			if ($page.url.pathname.startsWith('/admin')) {
				routes.unshift(...$adminRoutes);
			} else {
				routes.push(...$adminRoutes);
			}
		}
		return routes;
	}
);

export type TNavbarRouteOption =
	| 'home'
	| 'generate'
	| 'pricing'
	| 'account'
	| 'live'
	| 'blog'
	| 'history'
	| 'gallery'
	| 'servers'
	| 'users'
	| 'guide'
	| 'admin';

export interface TNavbarRoute {
	name: string;
	href: string;
	icon: TNavbarRouteOption;
	strictMatch?: boolean;
}
