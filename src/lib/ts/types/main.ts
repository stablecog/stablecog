export type TStatus = 'idle' | 'loading' | 'success' | 'error';

export type THrefTarget = '_blank' | '_self';

export interface TTab<T> {
	label: string;
	value: T;
	icon?: ConstructorOfATypedSvelteComponent;
}

export type TIconSocial =
	| 'discord'
	| 'reddit'
	| 'twitter'
	| 'instagram'
	| 'telegram'
	| 'facebook'
	| 'github'
	| 'medium'
	| 'youtube'
	| 'email'
	| 'producthunt';

export type TNavbarRouteOption =
	| 'home'
	| 'live'
	| 'blog'
	| 'history'
	| 'gallery'
	| 'servers'
	| 'users';

export interface TNavbarRoute {
	name: string;
	href: string;
	icon: TNavbarRouteOption;
}

export interface TBlogPost {
	slug: string;
	title: string;
	description: string;
	author: string;
	author_url?: string;
	date: string;
}

export interface TToC {
	title: string;
	description: string;
	author: string;
	author_url?: string;
	date: string;
}

export type TTabBarPlacement = 'bottom' | 'normal';

export type TCurrentSettingsPage = 'settings' | 'language';
