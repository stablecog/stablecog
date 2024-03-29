export type TStatus = 'idle' | 'loading' | 'success' | 'error';

export type THrefTarget = '_blank' | '_self' | undefined;

export interface TTab<T> {
	label: string;
	value: T;
	icon?: ConstructorOfATypedSvelteComponent;
	isNew?: boolean;
}

export type TIconSc =
	| 'discord'
	| 'reddit'
	| 'twitter'
	| 'x'
	| 'instagram'
	| 'telegram'
	| 'facebook'
	| 'github'
	| 'medium'
	| 'youtube'
	| 'email'
	| 'producthunt'
	| 'stablecog'
	| 'raycast'
	| 'unknown';

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
