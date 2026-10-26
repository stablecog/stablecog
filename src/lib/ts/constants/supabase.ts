import { env as envPublic } from '$env/dynamic/public';
import { writable } from 'svelte/store';

export const supabaseUrl =
	(envPublic.PUBLIC_APP_MODE === 'qa'
		? envPublic.PUBLIC_SUPABASE_URL_QA || ''
		: envPublic.PUBLIC_APP_MODE === 'dev'
			? envPublic.PUBLIC_SUPABASE_URL || ''
			: envPublic.PUBLIC_SUPABASE_URL) || '';

export const supabaseAnonKey =
	(envPublic.PUBLIC_APP_MODE === 'qa'
		? envPublic.PUBLIC_SUPABASE_ANON_KEY_QA
		: envPublic.PUBLIC_APP_MODE === 'dev'
			? envPublic.PUBLIC_SUPABASE_ANON_KEY
			: envPublic.PUBLIC_SUPABASE_ANON_KEY) || '';

// Only store the access & refresh tokens in cookies, not the user object.
// Keeps the auth cookies small enough for Cloudflare & Nginx header limits.
// Must be the same for createBrowserClient and createServerClient.
export const supabaseCookieEncode = 'tokens-only' as const;

export const sessionStore = writable<Session | null>(null);
export const supabaseStore = writable<SupabaseClient | null>(null);
