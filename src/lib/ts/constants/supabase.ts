import { createClient } from '@supabase/supabase-js';
import { env as envPublic } from '$env/dynamic/public';

export const supabase =
	envPublic.PUBLIC_SUPABASE_URL && envPublic.PUBLIC_SUPABASE_ANON_KEY
		? createClient(envPublic.PUBLIC_SUPABASE_URL, envPublic.PUBLIC_SUPABASE_ANON_KEY)
		: undefined;
