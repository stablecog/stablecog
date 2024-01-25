import { env as envPublic } from '$env/dynamic/public';
import { writable } from 'svelte/store';

export const supabaseUrl =
	envPublic.PUBLIC_APP_MODE === 'qa'
		? envPublic.PUBLIC_SUPABASE_URL_QA || ''
		: envPublic.PUBLIC_APP_MODE === 'dev'
		? envPublic.PUBLIC_SUPABASE_URL || ''
		: envPublic.PUBLIC_SUPABASE_URL || '';

export const supabaseAnonKey =
	envPublic.PUBLIC_APP_MODE === 'qa'
		? envPublic.PUBLIC_SUPABASE_ANON_KEY_QA
		: envPublic.PUBLIC_APP_MODE === 'dev'
		? envPublic.PUBLIC_SUPABASE_ANON_KEY
		: envPublic.PUBLIC_SUPABASE_ANON_KEY || '';

export const sessionStore = writable<Session | null>(null);
export const supabaseStore = writable<SupabaseClient | null>(null);
